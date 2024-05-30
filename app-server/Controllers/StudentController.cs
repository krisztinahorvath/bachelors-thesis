using app_server.Models;
using app_server.Models.DTOs;
using app_server.Services;
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
        private readonly StudentService _studentService;

        public StudentController(StudentsRegisterContext context, Validate validate, StudentService studentService)
        {
            _context = context;
            _validate = validate;
            _studentService = studentService;
        }

        // GET: api/students/user-preferences
        [HttpGet("user-preferences")]
        public async Task<ActionResult<StudentUserPreferenceDTO>> GetUserPreferences()
        { 
            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student)
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData.Item1;

            var userPreference = await _studentService.GetUserPreferences(studentId);

            if (userPreference == null)
                return NotFound();

            return userPreference;
        }

        // GET: api/students/student-grades-at-course/5
        [HttpGet("student-grades-at-course/{courseId}")]
        public async Task<ActionResult<StudentFinalGradeDTO>> GetStudentSituationAtCourse(long courseId)
        {
            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student)
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData.Item1;

            var result = await _studentService.GetStudentSituationAtCourse(studentId, courseId);

            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/students/achievements/5
        [HttpGet("achievements/{courseId}")]
        public async Task<ActionResult<StudentAchievementDTO>> GetStudentAchievementsAtCourse(long courseId)
        {
            if (_context.Students == null)
                return NotFound();

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student)
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData.Item1;

            var achievement = await _studentService.FetchStudentAchievements(courseId, studentId);

            if(achievement == null)
                return NotFound();

            return Ok(achievement);
        }

        // GET: api/students/assignments-and-grades/5
        [HttpGet("assignments-and-grades/{courseId}")]
        public async Task<ActionResult<IEnumerable<AssignmentAndGradeDTO>>> GetStudentAssignmentAndGrades(long courseId)
        {
            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student)
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData.Item1;

            var result = await _studentService.GetStudentAssignmentAndGrades(studentId, courseId);

            if (result == null)
                return NotFound();

            return result;
        }

        // PUT: api/students/user-preferences
        [HttpPut("user-preferences")]
        public async Task<IActionResult> UpdateStudentPreferences(StudentUserPreferenceDTO studentUserPreferenceDTO)
        {
            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student))
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData!.Item1;

            try
            {
                var result = await _studentService.UpdateStudentPreferences(studentId, studentUserPreferenceDTO);
                if (result == null)
                    return NotFound();
                else return NoContent();
            }
            catch (DbUpdateConcurrencyException) {
                return NotFound();
            }
        }
    }
}
