using app_server.Models;
using app_server.Models.DTOs;
using app_server.Services;
using app_server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;


namespace app_server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
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


            var result = await _userService.Register(userRegisterDTO);
            if (!result.Success)
                return BadRequest(result.ErrorMessage);

            return result.Data;
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
            // deserialize userDTO JSON string to UserDTO object
            var userInput = JsonConvert.DeserializeObject<UserDTO>(userDTO);

            if (userInput == null)
                return BadRequest();

            // convert IFormFile to byte array
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
    }
}
