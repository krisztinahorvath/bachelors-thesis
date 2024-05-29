using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Controllers
{
    [Route("api/teachers")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;

        public TeacherController(StudentsRegisterContext context)
        {
            _context = context;
        }

        // GET: api/teachers/autocomplete/10?query=string&pageNumber=1&pageSize=100
        [HttpGet("autocomplete")]
        public async Task<ActionResult<IEnumerable<TeacherDTO>>> AutocompleteName(long courseId, string query, int pageNumber = 1, int pageSize = 100)
        {
            var enrolledTeacherIds = await _context.CourseTeachers
                .Where(ct => ct.CourseId == courseId)
                .Select(ct => ct.TeacherId)
                .ToListAsync();

            var names = await _context.Teachers
                .Where(t => t.Name.ToLower().Contains(query.ToLower()) && !enrolledTeacherIds.Contains(t.Id))
                .Select(t => TeacherToTeacherDTO(t))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(names);
        }

        // POST: api/teachers/5/teacher-list
        [HttpPost("{courseId}/teacher-list")]
        public async Task<IActionResult> AddTeachersToCourse(long courseId, [FromBody] CourseTeacherListDTO addCourseTeachersDTO)
        {
            var course = await _context.Courses.FindAsync(courseId);

            if (course == null)
            {
                return NotFound(new { message = "Course not found" });
            }

            var teachers = await _context.Teachers.Where(t => addCourseTeachersDTO.TeacherIds.Contains(t.Id)).ToListAsync();

            foreach (var teacher in teachers)
            {
                if (!_context.CourseTeachers.Any(ct => ct.CourseId == courseId && ct.TeacherId == teacher.Id))
                {
                    _context.CourseTeachers.Add(new CourseTeacher { CourseId = courseId, TeacherId = teacher.Id });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Teachers added successfully to course!" });
        }

        // DELETE: api/teachers/remove-teacher-from-course/5/5
        [HttpDelete("remove-teacher-from-course/{courseId}/{teacherId}")]
        public async Task<ActionResult> UnenrollFromCourse(long courseId, long teacherId)
        {
            if (_context.Courses == null)
            {
                return NotFound();
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var currentTeacherId = tokenData.Item1;

            // make sure the person removing the teacher from the course is a course teacher
            if (!_context.CourseTeachers.Any(t => t.TeacherId == currentTeacherId && t.CourseId == courseId))
            {
                return Unauthorized("You can't remove a teacher from a courses that you aren't a teacher for");
            }

            var courseTeacher = await _context.CourseTeachers
                .FirstOrDefaultAsync(e => e.TeacherId == teacherId && e.CourseId == courseId);

            if (courseTeacher == null)
            {
                return NotFound();
            }

            _context.CourseTeachers.Remove(courseTeacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        // ************************************
        // TODO: create assignmnet for a given course
        // ************************************

        // ************************************
        // TODO: grade assigmnet
        // ************************************

        // ************************************
        // TODO: modify assigment 
        // ************************************

        // ************************************
        // TODO: modify grade / grade details
        // ************************************

        // ************************************
        // TODO: view all students enrolled at a course
        // ************************************

        // ************************************
        // TODO: teacher wants to enroll to course => give permission?
        // ************************************

        private static TeacherDTO TeacherToTeacherDTO(Teacher teacher)
        {
            return new TeacherDTO
            {
                Id = teacher.Id,
                Name = teacher.Name,
                Email = teacher.Email,
            };
        }
    }
}
