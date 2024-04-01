using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;

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

        // GET: api/courses/courses-of-teacher/5
        [HttpGet("courses-of-teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCoursesOfTeacher(long teacherId)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // extract user role from the JWT token
            if (!Enum.TryParse<UserType>(User.FindFirst(ClaimTypes.Role).Value, out var userRole) || userRole != UserType.Teacher)
            {
                return Unauthorized("Invalid token or user is not a teacher.");
            }

            // extract teacher id from the JWT token
            if (!long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out long userId) || userId != teacherId)
            {
                return Unauthorized("Invalid token.");
            }

            var courses = await _context.CourseTeachers
                .Where(t => t.TeacherId == teacherId)
                .Select(x => CourseToDTO(x.Course))
                .ToListAsync();

            return courses;
        }

        // GET: api/courses/courses-of-student/5
        [HttpGet("courses-of-student/{studentId}")]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCoursesOfStudent(long studentId)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // extract user role from the JWT token
            if (!Enum.TryParse<UserType>(User.FindFirst(ClaimTypes.Role).Value, out var userRole) || userRole != UserType.Student)
            {
                return Unauthorized("Invalid token or user is not a student.");
            }

            // extract student id from the JWT token
            if (!long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out long userId) || userId != studentId)
            {
                return Unauthorized("Invalid token.");
            }

            var courses = await _context.Enrollments
                .Where(t => t.StudentId == studentId)
                .Select(x => CourseToDTO(x.Course))
                .ToListAsync();

            return courses;
        }

        // GET: api/courses/teachers/{courseId}
        [HttpGet("teachers/{courseId}")]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachersOfACourse(long courseId)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // extract user role from the JWT token
            if (!Enum.TryParse<UserType>(User.FindFirst(ClaimTypes.Role).Value, out var userRole))
            {
                return Unauthorized("Invalid token.");
            }

            // extract student id from the JWT token
            if (!long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out long userId))
            {
                return Unauthorized("Invalid token.");
            }

            // verify if user id from token is valid
            if(!_context.Users.Any(u => u.Id == userId))
            {
                return Unauthorized("Invalid token.");
            }

            var teachers = await _context.CourseTeachers
                .Where(c => c.CourseId == courseId)
                .Select(t => t.Teacher).ToListAsync();

            return teachers;
        }


        // ************************************
        // TODO: view all students at a course
        // ************************************
        [HttpGet("students/{courseId}")]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetAllStudentsAtCourse (long courseId)
        {
            return Ok();
        }

        [HttpGet("all/{courseId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<RegisterDTO>>> GetAllCourseStudentsAssignmentGrades(long courseId)
        {
            // TODO: check if user is teacher at that course

            // select all students from course and all assignments from that course
            var studentsAndAssignments = await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .SelectMany(e => _context.Courses
                    .Where(c => c.Id == courseId)
                    .SelectMany(c => c.Assignments.Select(a => new RegisterDTO
                    {
                        StudentId = e.StudentId,
                        StudentName = e.Student.Nickname,
                        AssignmentId = a.Id,
                        AssignmentName = a.Name
                    })))
                .ToListAsync();

            // select grades
            var courseStudentsGrades = studentsAndAssignments.Select(dto =>
            {
                var grade = _context.Grades.FirstOrDefault(g =>
                    g.StudentId == dto.StudentId &&
                    g.AssignmentId == dto.AssignmentId);

                return new RegisterDTO
                {
                    StudentId = dto.StudentId,
                    StudentName = dto.StudentName,
                    AssignmentId = dto.AssignmentId,
                    AssignmentName = dto.AssignmentName,
                    Score = grade != null ? grade.Score.ToString() : "" 
                };
            }).ToList();

            return Ok(courseStudentsGrades);
        }


        // POST: api/courses
        [HttpPost]
        public async Task<ActionResult<CourseDTO>> CreateCourse(CourseDTO courseDTO)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // extract user role from the JWT token
            if (!Enum.TryParse<UserType>(User.FindFirst(ClaimTypes.Role).Value, out var userRole) || userRole != UserType.Teacher)
            {
                return Unauthorized("Invalid token or user is not a teacher.");
            }

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

        // POST: api/courses/enroll/5/abcdefgh
        [HttpPost("enroll/{studentId}/{enrollmentKey}")]
        public async Task<ActionResult<CourseDTO>> EnrollToCourse(long studentId, string enrollmentKey)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            if (_context.Students == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Students'  is null.");
            }

            if (!_context.Students.Any(s => s.Id == studentId))
            {
                return BadRequest("Student doesn't exist!");
            }

            Course course = await _context.Courses.FirstOrDefaultAsync(c => c.EnrollmentKey == enrollmentKey);
            if (course == null)
            {
                return BadRequest("Invalid enrollment key, no course could be found with that key");
            }

            // extract user role from the JWT token
            if (!Enum.TryParse<UserType>(User.FindFirst(ClaimTypes.Role).Value, out var userRole) || userRole != UserType.Student)
            {
                return Unauthorized("Invalid token or user is not a student.");
            }

            // extract student id from the JWT token
            if (!long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out long userId) || userId != studentId)
            {
                return Unauthorized("Invalid token.");
            }

            Enrollment enrollment = new Enrollment
            {
                StudentId = studentId,
                CourseId = course.Id,
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok(enrollment);
        }

        // PUT: api/course/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, CourseDTO courseDTO)
        {
            if(id != courseDTO.Id)
            {
                return BadRequest();
            }

            var course = await _context.Courses.FindAsync(id);

            if(course == null)
            {
                return NotFound();
            }

            course.Name = courseDTO.Name;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
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

        // DELETE: api/courses/5
        [HttpDelete("id")]
        public async Task<ActionResult> DeleteCourse(long id)
        {
            if(_context.Courses == null)
            {
                return NotFound();
            }

            var course = await _context.Courses.FindAsync(id);
            if(course == null)
            {
                return NotFound();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ************************************
        // TODO: maybe move the jwt token checks to UserController and make them static methods
        // ************************************

        // ************************************
        // TODO: create separate functions for validations, have cleaner more understandable code
        // ************************************

        // ************************************
        // TODO: 1.endpoint for generating random unique enrollment key
        //       2.change create course too, to make sure that the enrollment key is unique in the db
        //       3.add unique constraint on EnrollmentKey
        // ************************************

        // PUT: api/courses/generate-enrollment-key


        private bool CourseExists(long id)
        {
            return (_context.Courses?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static string GenerateRandomString(int length)
        {
            Random random = new Random();
            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            StringBuilder randomString = new StringBuilder(length);

            for(int i = 0; i < length; i++)
            {
                randomString.Append(alphabet[random.Next(alphabet.Length)]);
            }

            return randomString.ToString();
        }

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
