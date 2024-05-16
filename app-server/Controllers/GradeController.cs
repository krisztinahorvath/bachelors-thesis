using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Controllers
{
    [Route("api/grades")]
    [ApiController]
    public class GradeController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;
        private readonly Validate _validate;

        public GradeController(StudentsRegisterContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
        }

        // GET: api/grades 
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<GradeDTO>>> GetGrades()
        {
            if (_context.Grades == null)
            {
                return NotFound();
            }

            return await _context.Grades
                .Select(x => GradeToDTO(x)).ToListAsync();
        }

        // what gets?
        // see all grades of stud idk
        // add grade


        // POST: api/grades
        [HttpPost]
        public async Task<ActionResult<GradeDTO>> CreateGrade(GradeDTO gradeDTO)
        {
            if (_context.Grades == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Grades'  is null.");
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            // valid teacher id
            if (!_context.Teachers.Any(t => t.Id == teacherId))
            {
                return Unauthorized("User is not a registered teacher.");
            }

            Grade grade = new Grade
            {
                StudentId = gradeDTO.StudentId,
                AssignmentId = gradeDTO.AssignmentId,
                Score = gradeDTO.Score,
                DateReceived = gradeDTO.DateReceived
            };

            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();

            return Ok(grade);
        }

        // POST: api/grades
        [HttpPost("create")]
        public async Task<ActionResult<GradeDTO>> CreateOrUpdateGrade(GradeDTO gradeDTO)
        {
            if (_context.Grades == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Grades' is null.");
            }

            // Validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            // Valid teacher id
            if (!_context.Teachers.Any(t => t.Id == teacherId))
            {
                return Unauthorized("User is not a registered teacher.");
            }

            // Check if the grade already exists
            var existingGrade = await _context.Grades
                .FirstOrDefaultAsync(g => g.StudentId == gradeDTO.StudentId && g.AssignmentId == gradeDTO.AssignmentId);

            if (existingGrade == null)
            {
                // Create new grade
                var grade = new Grade
                {
                    StudentId = gradeDTO.StudentId,
                    AssignmentId = gradeDTO.AssignmentId,
                    Score = gradeDTO.Score,
                    DateReceived = gradeDTO.DateReceived,
                };

                _context.Grades.Add(grade);
            }
            else
            {
                // Update existing grade
                existingGrade.Score = gradeDTO.Score;
                existingGrade.DateReceived = gradeDTO.DateReceived;
            }

            await _context.SaveChangesAsync();

            // compute the new final grade at the course
            var courseId = _context.Assignments
                .Where(a => a.Id == gradeDTO.AssignmentId)
                .Select(a => a.CourseId)
                .FirstOrDefault();

            var query = from enrollment in _context.Enrollments
                        where enrollment.CourseId == courseId && enrollment.StudentId == gradeDTO.StudentId
                        join grade in _context.Grades.Where(g => g.Assignment.CourseId == courseId) on gradeDTO.StudentId equals grade.StudentId into studentGrades
                        select new
                        {
                          FinalGrade = studentGrades.Sum(g => g.Score * g.Assignment.Weight) / 100,
                        };
            var result = await query.FirstOrDefaultAsync();

            gradeDTO.FinalGrade = result!.FinalGrade;
            
            return Ok(gradeDTO);
        }


        // PUT: api/grades/5/5
        [HttpPut("{studentId}/assignmentId")]
        public async Task<IActionResult> PutGrade(long studentId, long assignmentId, GradeDTO gradeDTO)
        {
            if (studentId != gradeDTO.StudentId || assignmentId != gradeDTO.AssignmentId)
            {
                return BadRequest();
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            var assignment = _context.Assignments.Find(assignmentId);

            // make sure the person updating the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == assignment!.CourseId))
            {
                return Unauthorized("You can't update assignments for courses that you aren't a teacher for");
            }

            var grade = await _context.Grades
                .FirstOrDefaultAsync(a => a.StudentId == studentId && a.AssignmentId == assignmentId);


            if (grade == null)
            {
                return NotFound();
            }

            grade.Score = gradeDTO.Score;
            grade.DateReceived = gradeDTO.DateReceived;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GradeExists(studentId, assignmentId))
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

        private bool GradeExists(long studentId, long assignmentId)
        {
            return (_context.Grades?.Any(e => e.StudentId == studentId && e.AssignmentId == assignmentId)).GetValueOrDefault();
        }

        private static GradeDTO GradeToDTO(Grade grade)
        {
            return new GradeDTO
            {
                StudentId = grade.StudentId,
                AssignmentId = grade.AssignmentId,
                Score = grade.Score,
                DateReceived = grade.DateReceived
            };
        }
    }
}
