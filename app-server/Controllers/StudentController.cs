using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Controllers
{
    [Route("api/students")]
    [ApiController]
    public class StudentController: ControllerBase
    {
        private readonly StudentsRegisterContext _context;
        private readonly Validate _validate;

        public StudentController(StudentsRegisterContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
        }

        // GET: api/students/user-preferences
        [HttpGet("user-preferences")]
        public async Task<ActionResult<StudentUserPreferenceDTO>> GetUserPreferences()
        {
            if (_context.Students == null)
                return NotFound();

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student)
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData.Item1;

            var userPreference = await _context.UserPreferences.FirstOrDefaultAsync(x => x.StudentId == studentId);

            if (userPreference == null)
                return NotFound();

            return StudentUserPreferenceToDTO(userPreference);
        }

        // PUT: api/students/user-preferences
        [HttpPut("user-preferences")]
        public async Task<IActionResult> PutAssignments(StudentUserPreferenceDTO studentUserPreferenceDTO)
        {
            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student))
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData!.Item1;

            var userPreference = await _context.UserPreferences.FirstOrDefaultAsync(x => x.StudentId == studentId);

            if (userPreference == null)
            {
                return NotFound();
            }

            userPreference.ShowPoints = studentUserPreferenceDTO.ShowPoints;
            userPreference.ShowLevels = studentUserPreferenceDTO.ShowLevels;
            userPreference.ShowBadges = studentUserPreferenceDTO.ShowBadges;
            userPreference.ShowProgressBars = studentUserPreferenceDTO.ShowProgressBars;
            userPreference.ShowLeaderboards = studentUserPreferenceDTO.ShowLeaderboards;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(studentId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool StudentExists(long id)
        {
            return (_context.Students?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static StudentUserPreferenceDTO StudentUserPreferenceToDTO(UserPreference userPreference)
        {
            return new StudentUserPreferenceDTO
            {
                ShowPoints = userPreference.ShowPoints,
                ShowLevels = userPreference.ShowLevels,
                ShowBadges = userPreference.ShowBadges,
                ShowProgressBars = userPreference.ShowProgressBars,
                ShowLeaderboards = userPreference.ShowLeaderboards,
            };
        }
    }
}
