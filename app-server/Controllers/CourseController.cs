using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;

namespace app_server.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;
        private readonly Validate _validate;

        public CourseController(StudentsRegisterContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
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

        // GET: api/courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDTO>> GetCourseById(long id)
        {
            if (_context.Courses == null)
                return NotFound();

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null )
                return Unauthorized("Invalid token.");

            var userId = tokenData.Item1;

            // check if user is a course teacher or it is a student enrolled to that course
            if (!_context.Enrollments.Any(e => e.CourseId == id && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == id && c.TeacherId == userId))
                return Unauthorized("You aren't authorized to see information about this course.");

            var course = await _context.Courses.FirstOrDefaultAsync(x => x.Id == id);

            if (course == null)
                return NotFound();

            return CourseToDTO(course);
        }

        // GET: api/courses/courses-of-teacher
        [HttpGet("courses-of-teacher")] // get all courses of a teacher
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCoursesOfTeacher()
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if(tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var courses = await _context.CourseTeachers
                .Where(t => t.TeacherId == tokenData.Item1)
                .Select(x => CourseToDTO(x.Course))
                .ToListAsync();

            return courses;
        }

        // GET: api/courses/courses-of-student/5
        [HttpGet("courses-of-student/{studentId}")] // get all courses of a student
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCoursesOfStudent(long studentId)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 != studentId || tokenData?.Item2 != UserType.Student))
                return Unauthorized("Invalid token or user is not a student.");

            var courses = await _context.Enrollments
                .Where(t => t.StudentId == studentId)
                .Select(x => CourseToDTO(x.Course))
                .ToListAsync();

            return courses;
        }

        // GET: api/courses/teachers/{courseId}
        [HttpGet("teachers/{courseId}")] // get all teachers that teach at a certain course
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachersOfACourse(long courseId)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 == null))
                return Unauthorized("Invalid token.");

            var userId = tokenData!.Item1;

            // check if user is a course teacher or it is a student enrolled to that course
            if (!_context.Enrollments.Any(e => e.CourseId == courseId && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == courseId && c.TeacherId == userId))
                return Unauthorized("You aren't authorized to see information about this course.");

            var teachers = await _context.CourseTeachers
                .Where(c => c.CourseId == courseId)
                .Select(t => t.Teacher).ToListAsync();

            return teachers;
        }


        // ************************************
        // TODO: view all students at a course
        // ************************************
        [HttpGet("students/{courseId}")]
        public async Task<ActionResult<IEnumerable<EnrolledStudentDTO>>> GetAllStudentsAtCourse (long courseId)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 == null))
                return Unauthorized("Invalid token.");

            var userId = tokenData!.Item1;

            // check if user is a course teacher or it is a student enrolled to that course
            if (!_context.Enrollments.Any(e => e.CourseId == courseId && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == courseId && c.TeacherId == userId))
                return Unauthorized("You aren't authorized to see information about this course.");

            var students = await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Select(s => StudentToEnrolledStudentDTO(s.Student)).ToListAsync();

            return students;
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

        [HttpPost("create")]
        //[AllowAnonymous]
        public async Task<IActionResult> CreateCourse([FromForm] string courseDTO, [FromForm] IFormFile image)
        {
            // Deserialize courseDTO JSON string to CourseDTO object
            var courseInput = JsonConvert.DeserializeObject<CourseDTO>(courseDTO);

            // Convert IFormFile to byte array
            using (var memoryStream = new MemoryStream())
            {
                await image.CopyToAsync(memoryStream);
                courseInput.Image = memoryStream.ToArray();
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

            Course course = new Course
            {
                Name = courseInput.Name,
                EnrollmentKey = await GenerateUniqueEnrollmentKey(8),
                Image = courseInput.Image
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



        // POST: api/courses
        [HttpPost]
        public async Task<ActionResult<CourseDTO>> CreateCourse(CourseDTO courseDTO)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            // valid teacher id
            if (!_context.Teachers.Any(t => t.Id == teacherId)){
                return Unauthorized("User is not a registered teacher.");
            }

            Console.WriteLine("IMAGEDTO: " + courseDTO.Image.ToString());

            Course course = new Course
            {
                Name = courseDTO.Name,
                EnrollmentKey = await GenerateUniqueEnrollmentKey(8),
                Image = courseDTO.Image
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

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 != studentId || tokenData?.Item2 != UserType.Student))
                return Unauthorized("Invalid token or user is not a teacher.");

            Enrollment enrollment = new Enrollment
            {
                StudentId = studentId,
                CourseId = course.Id,
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok(enrollment);
        }

        // PATCH: api/courses/new-enrollment-key/5
        [HttpPatch("new-enrollment-key/{courseId}")]
        public async Task<ActionResult<string>> PatchNewEnrollmentKey(long courseId)
        {
            if (_context.Courses == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Courses'  is null.");
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            // make sure the person deleting the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == courseId))
            {
                return Unauthorized("You can't delete courses that you aren't a teacher for.");
            }

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return NotFound(); 
            }
            
            course.EnrollmentKey = await GenerateUniqueEnrollmentKey(8);
            await _context.SaveChangesAsync();
           
            
            return Ok(course.EnrollmentKey);
        }
        
        // PUT: api/courses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(long id, CourseDTO courseDTO)
        {
            if(id != courseDTO.Id)
            {
                return BadRequest();
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            // make sure the person updating the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == id))
            {
                return Unauthorized("You can't update courses that you aren't a teacher for");
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
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCourse(long id)
        {
            if(_context.Courses == null)
            {
                return NotFound();
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            // make sure the person deleting the course is a teacher at that course
            if(!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == id)) {
                return Unauthorized("You can't delete courses that you aren't a teacher for");
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

        private bool CourseExists(long id)
        {
            return (_context.Courses?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private async Task<string> GenerateUniqueEnrollmentKey(int length)
        {
            string enrollmentKey;
            do
            {
                enrollmentKey = GenerateRandomString(length);
            } while (await _context.Courses.AnyAsync(course => course.EnrollmentKey == enrollmentKey));

            return enrollmentKey;
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
                EnrollmentKey = course.EnrollmentKey,
                Image = course.Image
            };
        }

        private static EnrolledStudentDTO StudentToEnrolledStudentDTO(Student student)
        {
            return new EnrolledStudentDTO
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email
            };
        }
    }
}
