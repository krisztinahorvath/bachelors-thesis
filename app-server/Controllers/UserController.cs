using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace app_server.Controllers
{

    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;
        private readonly JwtSettings _jwtSettings;

        public UserController(StudentsRegisterContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        // GET: api/users
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<User>>> GetUser(int pageNumber = 0, int pageSize = 10)
        {
            if (_context.Users == null)
                return NotFound();

            return await _context.Users
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                
                .ToListAsync();
        }

        // POST: api/users/register-student
        [HttpPost("register-student")]
        [AllowAnonymous]
        public async Task<ActionResult<StudentDTO>> Register(StudentDTO studentDTO)
        {
            // ************************************
            // TODO: call a validate fields method for students 
            // ************************************

            if (await _context.Students.AnyAsync(s => s.Nickname == studentDTO.Nickname))
                return BadRequest("Username already exists! Please choose another one!");

            var student = new Student
            {
                Name = studentDTO.Name,
                Email = studentDTO.Email,
                Password = HashPassword(studentDTO.Password),
                Nickname = studentDTO.Nickname,
                UserType = UserType.Student
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return studentDTO;
        }


        // POST: api/users/register-teacher
        [HttpPost("register-teacher")]
        [AllowAnonymous]
        public async Task<ActionResult<TeacherDTO>> Register(TeacherDTO teacherDTO)
        {
            // ************************************
            // TODO: call a validate fields method for teachers 
            // ************************************

            var teacher = new Teacher
            {
                Name = teacherDTO.Name,
                Email = teacherDTO.Email,
                Password = HashPassword(teacherDTO.Password),
                UserType = UserType.Teacher
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return teacherDTO;
        }


        // POST: api/users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserDTO userDTO)
        {
            // Find user by username and password
            User user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == userDTO.Email && u.Password == HashPassword(userDTO.Password));

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Generate JWT token
            string token = GenerateJwtToken(user);

            return Ok(new { token, user.UserType, user.Email });
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
