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
        private readonly Validate _validate;
        private readonly StudentService _studentService;

        public StudentController(Validate validate, StudentService studentService)
        {
            _validate = validate;
            _studentService = studentService;
        }

        // GET: api/students/user-preferences
        [HttpGet("user-preferences")]
        [AuthorizeStudent]
        public async Task<ActionResult<StudentUserPreferenceDTO>> GetUserPreferences()
        {
            var studentId = (long)HttpContext.Items["StudentId"];

            var userPreference = await _studentService.GetUserPreferences(studentId);

            if (userPreference == null)
                return NotFound();

            return userPreference;
        }

        // GET: api/students/student-grades-at-course/5
        [HttpGet("student-grades-at-course/{courseId}")]
        [AuthorizeStudent]
        public async Task<ActionResult<StudentFinalGradeDTO>> GetStudentSituationAtCourse(long courseId)
        {
            var studentId = (long)HttpContext.Items["StudentId"];

            var result = await _studentService.GetStudentSituationAtCourse(studentId, courseId);

            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/students/achievements/5
        [HttpGet("achievements/{courseId}")]
        [AuthorizeStudent]
        public async Task<ActionResult<StudentAchievementDTO>> GetStudentAchievementsAtCourse(long courseId)
        {
            var studentId = (long)HttpContext.Items["StudentId"];

            var achievement = await _studentService.FetchStudentAchievements(courseId, studentId);

            if(achievement == null)
                return NotFound();

            return Ok(achievement);
        }

        // GET: api/students/leaderboard/5
        [HttpGet("leaderboard/{courseId}")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult<ICollection<LeaderboardDTO>>> GetLeaderboardAtCourse(long courseId)
        {
            var userId = (long)HttpContext.Items["UserId"];

            var result = await _studentService.GetLeaderboardAtCourse(courseId, userId);
            if (result == null)
                return NotFound();


            return Ok(result);
        }

        // GET: api/students/assignments-and-grades/5
        [HttpGet("assignments-and-grades/{courseId}")]
        [AuthorizeStudent]
        public async Task<ActionResult<IEnumerable<AssignmentAndGradeDTO>>> GetStudentAssignmentAndGrades(long courseId)
        {
            var studentId = (long)HttpContext.Items["StudentId"];

            var result = await _studentService.GetStudentAssignmentAndGrades(studentId, courseId);

            if (result == null)
                return NotFound();

            return result;
        }

        // PUT: api/students/user-preferences
        [HttpPut("user-preferences")]
        [AuthorizeStudent]
        public async Task<IActionResult> UpdateStudentPreferences(StudentUserPreferenceDTO studentUserPreferenceDTO)
        {
            var studentId = (long)HttpContext.Items["StudentId"];

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
