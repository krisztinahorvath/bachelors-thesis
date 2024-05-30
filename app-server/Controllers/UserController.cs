using app_server.Models;
using app_server.Models.DTOs;
using app_server.Services;
using app_server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

namespace app_server.Controllers
{
    // ************************************
    // TODO: create a logout with jwt blacklist and when i check if a token is blacklisted, remove the tokens that are expired, 
    //       or remove them another time, make it efficient???
    // ************************************


    // ************************************
    // TODO: USE VALIDATE USER FIELDS HERE ????????????????????????????????
    //

    // ************************************


    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly Validate _validate;
        private readonly UserService _userService;

        public UserController(StudentsRegisterContext context, IOptions<JwtSettings> jwtSettings, Validate validate, UserService userService)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
            _validate = validate;
            _userService = userService;
        }

        // GET: api/users/user-profile
        [HttpGet("user-profile")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult<UserDTO>> GetUserProfile()
        {
            var userId = (long)HttpContext.Items["UserId"];
            var userType = (UserType)HttpContext.Items["UserType"];

            var result = await _userService.GetUserProfile(userId, userType);
            if (result == null)
                return NotFound();

            return result;
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

            var result = await _userService.Register(userRegisterDTO);
            if (result == null)
                return BadRequest();

            return result;
        }

        // POST: api/users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDTO userDTO)
        {
            var (isValid, token, userType, email, image, nickname) = await _userService.Login(userDTO);
            if (!isValid)
                return Unauthorized("Invalid email or password.");

            if (userType == UserType.Student)
                return Ok(new { token, userType, email, image, nickname });

            return Ok(new { token, userType, email, image });
        }

        // PATCH: api/users/update-password
        [HttpPatch("update-password")]
        [AuthorizeGeneralUser]
        public async Task<IActionResult> UpdatePassword(UserPasswordUpdateDTO userPasswordUpdateDTO)
        {
            // do validations
            if (!_validate.IsPasswordValid(userPasswordUpdateDTO.NewPassword))
                return BadRequest("The password must have at least 8 characters and " +
                    "must contain at least one upper letter and a digit.");

            var userId = (long)HttpContext.Items["UserId"];

            try
            {
                var result = await _userService.UpdatePassword(userId, userPasswordUpdateDTO);
                if (!result.Success)
                    return BadRequest(result.ErrorMessage);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return Ok("Password updated successfully");

        }

        // PUT: api/users/profile
        [HttpPut("profile")]
        [AuthorizeGeneralUser]
        public async Task<IActionResult> UpdateUserProfile([FromForm] string userDTO, [FromForm] IFormFile? image = null)
        {
            // Deserialize userDTO JSON string to UserDTO object
            var userInput = JsonConvert.DeserializeObject<UserDTO>(userDTO);

            if (userInput == null)
                return BadRequest();

            // validate email structure
            if (!Validate.IsEmailValid(userInput.Email))
                return BadRequest("Invalid email provided.");

            // Convert IFormFile to byte array
            if (image != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await image.CopyToAsync(memoryStream);
                    userInput.Image = memoryStream.ToArray();
                }
            }

            var userId = (long)HttpContext.Items["UserId"];
            var userType = (UserType)HttpContext.Items["UserType"];

            try
            {
                var result = await _userService.UpdateUserProfile(userId, userType, userInput);
                if (!result.Success)
                    return BadRequest(result.ErrorMessage);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("An error occured while updating your profile.");
            }


            return NoContent();
        }

        // DELETE: api/users
        [HttpDelete("account/{email}/{password}")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult> DeleteAccount(string email, string password)
        {
            var userId = (long)HttpContext.Items["UserId"];

            var result = await _userService.DeleteAccount(userId, email, password);
            if (!result.Success)
                return Unauthorized(result.ErrorMessage);

            return NoContent();
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
    }
}
