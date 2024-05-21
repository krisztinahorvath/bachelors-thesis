using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
