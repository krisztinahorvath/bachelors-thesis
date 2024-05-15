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

        // GET: api/students/student-grades-at-course/5
        [HttpGet("student-grades-at-course/{courseId}")]
        public async Task<ActionResult<StudentFinalGradeDTO>> GetStudentSituationAtCourse(long courseId)
        {
            if (_context.Students == null)
                return NotFound();

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student)
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData.Item1;

            var query = from enrollment in _context.Enrollments
                        where enrollment.CourseId == courseId && enrollment.StudentId == studentId
                        join grade in _context.Grades.Where(g => g.Assignment.CourseId == courseId) on studentId equals grade.StudentId into studentGrades
                        select new 
                        {
                            FinalGrade = studentGrades.Sum(g => g.Score * g.Assignment.Weight) / 100,
                        };

            var result = await query.FirstOrDefaultAsync();

            if (result == null)
                return NotFound();

            return Ok(new StudentFinalGradeDTO
            {
                FinalGrade = result.FinalGrade,
                ExperiencePoints = (int)(result.FinalGrade * 300)

            });
        }

        // GET: api/students/assignments-and-grades/5
        [HttpGet("assignments-and-grades/{courseId}")]
        public async Task<ActionResult<IEnumerable<AssignmentAndGradeDTO>>> GetStudentAssignmentAndGrades(long courseId)
        {
            if (_context.Students == null)
                return NotFound();

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null || tokenData?.Item2 != UserType.Student)
                return Unauthorized("Invalid token or user is not a student.");

            var studentId = tokenData.Item1;

            return await _context.Assignments
               .Where(a => a.CourseId == courseId)
               .OrderBy(a => a.DueDate)
               .Select(x => new AssignmentAndGradeDTO
               {
                   AssignmentId = x.Id,
                   Name = x.Name,
                   Description = x.Description,
                   DueDate = x.DueDate,
                   Weight = x.Weight,
                   Score = x.Grades!.Where(g => g.StudentId == studentId).Select(g => g.Score).FirstOrDefault(),
                   DateReceived = x.Grades!.Where(g => g.StudentId == studentId).Select(g => g.DateReceived).FirstOrDefault(),

               }).ToListAsync();
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
