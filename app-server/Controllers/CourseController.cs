using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace app_server.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;

        public CourseController(StudentsRegisterContext context)
        {
            _context = context;
        }

        // GET: api/courses 
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCourse()
        {
            if (_context.Courses == null)
            {
                return NotFound();
            }

            return await _context.Courses
                .Select(x => CourseToDTO(x)).ToListAsync();
        }

        // POST: api/teachers/add-course
        [HttpPost]
        public async Task<ActionResult<CourseDTO>> CreateCourse(CourseDTO courseDTO)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'BookContext.Genre'  is null.");
            }

            // extract user role from the JWT token
            if (!Enum.TryParse<UserType>(User.FindFirst(ClaimTypes.Role).Value, out var userRole) || userRole != UserType.Teacher)
            {
                return Unauthorized("Invalid token or user is not a teacher.");
            }

            Console.WriteLine("USER ROLE:" + userRole);

            // extract teacher id from the JWT token
            if (!long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out long teacherId))
            {
                return Unauthorized("Invalid token.");
            }

            Course course = new Course
            {
                Name = courseDTO.Name,
                EnrollmentKey = courseDTO.EnrollmentKey,
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            CourseTeacher courseTeacher = new CourseTeacher
            {
                CourseId = course.Id,
                TeacherId = teacherId,
            };


            _context.CourseTeachers.Add(courseTeacher);
            await _context.SaveChangesAsync();


            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        // ************************************
        // TODO: get all courses of a teacher
        // ************************************

        // ************************************
        // TODO: get all courses of a student
        // ************************************

        // ************************************
        // TODO: modify course 
        // ************************************

        // ************************************
        // TODO: delete course
        // ************************************

        // ************************************
        // TODO: generate new enrollment key
        // ************************************

        private static CourseDTO CourseToDTO(Course course)
        {
            return new CourseDTO
            {
                Id = course.Id,
                Name = course.Name,
                EnrollmentKey = course.EnrollmentKey
            };
        }
    }
}
