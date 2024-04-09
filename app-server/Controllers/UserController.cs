using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
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
    // ************************************
    // TODO: create a logout with jwt blacklist and when i check if a token is blacklisted, remove the tokens that are expired, 
    //       or remove them another time, make it efficient???
    // ************************************


    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly Validate _validate;

        public UserController(StudentsRegisterContext context, IOptions<JwtSettings> jwtSettings, Validate validate)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
            _validate = validate;
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

        // POST: api/users/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Register(UserRegisterDTO userRegisterDTO)
        {
            // validate input fields
            var isValidUser = _validate.ValidateUserFields(userRegisterDTO, _context);
            if (isValidUser != "")
                return BadRequest(isValidUser);

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
                return BadRequest("Invalid UserType");

            return newUser;
        }

        // POST: api/users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDTO userDTO)
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

        public static Tuple<long, UserType>? ExtractUserIdAndJWTToken(ClaimsPrincipal claims)
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
