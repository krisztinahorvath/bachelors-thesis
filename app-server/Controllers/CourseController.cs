using app_server.Models;
using app_server.Models.DTOs;
using app_server.Services;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace app_server.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly CourseService _courseService;

        public CourseController(CourseService courseService)
        {
            _courseService = courseService;
        }

        // GET: api/courses/5
        [HttpGet("{id}")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult<CourseDTO>> GetCourseById(long id)
        {
            var result = await _courseService.GetCourseById(id);
            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/courses/courses-of-teacher
        [HttpGet("courses-of-teacher")] // get all courses of a teacher
        [AuthorizeTeacher]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCoursesOfTeacher()
        {
            var teacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _courseService.GetCoursesOfTeacher(teacherId);
            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/courses/courses-of-student/5
        [HttpGet("courses-of-student")] // get all courses of a student
        [AuthorizeStudent]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetCoursesOfStudent()
        {
            var studentId = (long)HttpContext.Items["StudentId"];

            var result = await _courseService.GetCoursesOfStudent(studentId);
            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/courses/{courseId}/teachers
        [HttpGet("{courseId}/teachers")] // get all teachers that teach at a certain course
        [AuthorizeGeneralUser]
        public async Task<ActionResult<IEnumerable<TeacherDTO>>> GetTeachersOfACourse(long courseId)
        {
            var userId = (long)HttpContext.Items["UserId"];

            var result = await _courseService.GetTeachersOfACourse(courseId, userId);
            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/courses/students/5
        [HttpGet("students/{courseId}")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult<IEnumerable<EnrolledStudentDTO>>> GetAllStudentsAtCourse (long courseId)
        {
            var userId = (long)HttpContext.Items["UserId"];

            var result = await _courseService.GetAllStudentsAtCourse(courseId, userId);
            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/courses/new-enrollment-key/5
        [HttpGet("new-enrollment-key/{courseId}")]
        [AuthorizeTeacher]
        public async Task<ActionResult<string>> GetNewEnrollmentKey(long courseId)
        {

            var teacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _courseService.GetNewEnrollmentKey(courseId, teacherId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("all/{courseId}")]
        [AuthorizeTeacher]
        public async Task<ActionResult<Dictionary<string, object>>> GetAllCourseStudentsAssignmentGrades(long courseId)
        {
            var result = await _courseService.GetAllCourseStudentsAssignmentGrades(courseId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // POST: api/courses
        [HttpPost]
        [AuthorizeTeacher]
        public async Task<IActionResult> CreateCourse([FromForm] string courseDTO, [FromForm] IFormFile image)
        {
            // deserialize courseDTO JSON string to CourseDTO object
            var courseInput = JsonConvert.DeserializeObject<CourseDTO>(courseDTO);
            if (courseInput == null)
                return BadRequest();

            // convert IFormFile to byte array
            using (var memoryStream = new MemoryStream())
            {
                await image.CopyToAsync(memoryStream);
                courseInput.Image = memoryStream.ToArray();
            }

            var teacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _courseService.CreateCourse(courseInput, teacherId);
            if (!result.Success)
                return BadRequest(result.ErrorMessage);


            return CreatedAtAction(nameof(GetCourseById), new { id = result.Data.Id }, result.Data);
        }
        
        // PUT: api/courses
        [HttpPut]
        [AuthorizeTeacher]
        public async Task<IActionResult> PutCourse([FromForm] string courseDTO, [FromForm] IFormFile? image = null)
        {
            var userInput = JsonConvert.DeserializeObject<CourseDTO>(courseDTO);

            if (userInput == null)
                return BadRequest();

            if(image != null)
            {
                // Convert IFormFile to byte array
                using (var memoryStream = new MemoryStream())
                {
                    await image.CopyToAsync(memoryStream);
                    userInput.Image = memoryStream.ToArray();
                }
            }
            var teacherId = (long)HttpContext.Items["TeacherId"]; 
            try
            {
                var result = await _courseService.PutCourse(userInput, teacherId);
                if (!result.Success)
                    return BadRequest(result.ErrorMessage);
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest("An error occured while updating the course.");
            }

            return NoContent();
        }

        // DELETE: api/courses/5
        [HttpDelete("{id}")]
        [AuthorizeTeacher]
        public async Task<ActionResult> DeleteCourse(long id)
        {
            var teacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _courseService.DeleteCourse(id, teacherId);
            if (!result.Success)
                return BadRequest(result.ErrorMessage);

            return NoContent();
        }
    }
}
