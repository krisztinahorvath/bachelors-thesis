using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace app_server.Services
{
    public class UserService
    {
        private readonly StudentsRegisterContext _context;
        private readonly JwtSettings _jwtSettings;

        public UserService(StudentsRegisterContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<ActionResult<UserDTO>?> GetUserProfile(long userId, UserType userType)
        {
            if (_context.Users == null)
                return null;

            UserDTO user = new();
            if (userType == UserType.Teacher)
            {
                var teacher = await _context.Teachers.FindAsync(userId);
                user.Name = teacher.Name;
                user.Email = teacher.Email;
                user.Image = teacher.Image;
            }
            else if (userType == UserType.Student)
            {
                var student = await _context.Students.FindAsync(userId);
                user.Name = student.Name;
                user.Email = student.Email;
                user.Image = student.Image;
                user.Nickname = student.Nickname;
                user.UniqueIdentificationCode = student.UniqueIdentificationCode;
            }

            return user;
        }

        public async Task<ActionResult<User>?> Register(UserRegisterDTO userRegisterDTO)
        {
            userRegisterDTO.Password = HashPassword(userRegisterDTO.Password);

            User newUser;
            if (userRegisterDTO.UserType == UserType.Teacher)
            {
                newUser = new TeacherFactory().CreateUser(userRegisterDTO);
                _context.Add(newUser);
                await _context.SaveChangesAsync();
            }
            else if (userRegisterDTO.UserType == UserType.Student)
            {
                newUser = new StudentFactory().CreateUser(userRegisterDTO);
                _context.Add(newUser);
                await _context.SaveChangesAsync();

                var userPreference = newUser.CreateUserPreference();
                _context.UserPreferences.Add(userPreference);
                await _context.SaveChangesAsync();
            }
            else 
                return null;

            return newUser;
        }


        // LOGIN
        public async Task<(bool isValid, string? token, UserType? userType, string? Email, byte[]? image, string? nickname)> Login(UserLoginDTO userDTO)
        {
            // Find user by username and password
            User user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == userDTO.Email && u.Password == HashPassword(userDTO.Password));

            if (user == null)
            {
                return (false, null, default, null, null, null);
            }

            // Generate JWT token
            string token = GenerateJwtToken(user);

            if (user.UserType == UserType.Student)
            {
                var student = await _context.Students.FindAsync(user.Id);
                return (true, token, user.UserType, user.Email, user.Image, student!.Nickname);
            }


            return (true, token, user.UserType, user.Email, user.Image, null);
        }

        // UPDATE PASSWORD
        public async Task<OperationResult> UpdatePassword(long userId, UserPasswordUpdateDTO userPasswordUpdateDTO)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return OperationResult.FailResult("User not found.");

            if (user.Password != HashPassword(userPasswordUpdateDTO.OldPassword))
                return OperationResult.FailResult("Incorrect password provided");

            user.Password = HashPassword(userPasswordUpdateDTO.NewPassword);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(userId))
                {
                    return OperationResult.FailResult("User does not exist.");
                }
                else
                {
                    throw;
                }
            }

            return OperationResult.SuccessResult();
        }

        // UPDATE PROFILE
        public async Task<OperationResult> UpdateUserProfile(long userId, UserType userType, UserDTO userInput)
        {
            if (userType == UserType.Teacher)
            {
                var teacher = await _context.Teachers.FindAsync(userId);
                if (teacher == null)
                    return OperationResult.FailResult("Teacher not found.");

                teacher.Name = userInput.Name;

                if (teacher.Email != userInput.Email)
                    if (!Validate.IsEmailUnique(_context, userInput.Email))
                        return OperationResult.FailResult("Email must be unique, another user is already using this email.");
                    else teacher.Email = userInput.Email;

                if (userInput.Image != null)
                    teacher.Image = userInput.Image;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TeacherExists(userId))
                    {
                        return OperationResult.FailResult("");
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            else if (userType == UserType.Student)
            {
                var student = await _context.Students.FindAsync(userId);
                if (student == null)
                    return OperationResult.FailResult("Student not found.");

                student.Name = userInput.Name;

                if (student.Email != userInput.Email)
                    if (!Validate.IsEmailUnique(_context, userInput.Email))
                        return OperationResult.FailResult("Email must be unique, another user is already using this email.");
                    else student.Email = userInput.Email;

                if (userInput.Image != null)
                    student.Image = userInput.Image;

                if (userInput.Nickname != student.Nickname)
                    if (!Validate.IsNicknameUnique(_context, userInput.Nickname))
                        return OperationResult.FailResult("Nickname must be unique.");
                    else
                        student.Nickname = userInput.Nickname;

                /// MAKE SURE THIS IS UNIQUE TOO????
                student.UniqueIdentificationCode = userInput.UniqueIdentificationCode;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StudentExists(userId))
                    {
                        return OperationResult.FailResult("");
                    }
                    else
                    {
                        throw;
                    }
                }
            }


            return OperationResult.SuccessResult();
        }

        // DELETE ACCOUNT
        public async Task<OperationResult> DeleteAccount(long userId, string email, string password)
        {
            if (_context.Users == null)
            {
                return OperationResult.FailResult("");
            }


            // make sure the person deleting the course is a teacher at that course
            if (!_context.Users.Any(t => t.Id == userId && t.Email == email && t.Password == HashPassword(password)))
            {
                return OperationResult.FailResult("Invalid data provided.");
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return OperationResult.FailResult("User with such data not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return OperationResult.SuccessResult();
        }

        private bool UserExists(long id)
        {
            return (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private bool TeacherExists(long id)
        {
            return (_context.Teachers?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private bool StudentExists(long id)
        {
            return (_context.Students?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static Tuple<long, UserType>? ExtractUserIdAndJWTToken(ClaimsPrincipal claims)
        {
            if (claims == null || claims.Identity?.IsAuthenticated == false) // token might be expired
                return null;

            if (!long.TryParse(claims.FindFirst(ClaimTypes.NameIdentifier)?.Value, out long userId))
                return null;

            if (!Enum.TryParse<UserType>(claims.FindFirst(ClaimTypes.Role)?.Value, out var userType))
                return null;

            return new Tuple<long, UserType>(userId, userType);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                 new Claim(ClaimTypes.Role, user.UserType.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string HashPassword(string password)
        {
            byte[] bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }
    }
}
