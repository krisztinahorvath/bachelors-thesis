using app_server.Models;
using app_server.Models.DTOs;
using app_server.Services;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;

namespace app_server.Controllers
{
    [Route("api/teachers")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly TeacherService _teacherService;

        public TeacherController(TeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        // GET: api/teachers/autocomplete/10?query=string&pageNumber=1&pageSize=100
        [HttpGet("autocomplete")]
        [AuthorizeTeacher]
        public async Task<ActionResult<IEnumerable<TeacherDTO>>> AutocompleteName(long courseId, string query, int pageNumber = 1, int pageSize = 100)
        {
            var result = await _teacherService.AutocompleteName(courseId, query, pageNumber, pageSize);

            return result;
        }

        // POST: api/teachers/5/teacher-list
        [HttpPost("{courseId}/teacher-list")]
        [AuthorizeTeacher]
        public async Task<IActionResult> AddTeachersToCourse(long courseId, [FromBody] CourseTeacherListDTO addCourseTeachersDTO)
        {
            var result = await _teacherService.AddTeachersToCourse(courseId, addCourseTeachersDTO);
            if (!result.Success)
                return Problem(result.ErrorMessage);

            return Ok(new { message = "Teachers added successfully to course!" });
        }

        // DELETE: api/teachers/remove-teacher-from-course/5/5
        [HttpDelete("remove-teacher-from-course/{courseId}/{teacherId}")]
        [AuthorizeTeacher]
        public async Task<ActionResult> UnenrollFromCourse(long courseId, long teacherId)
        {
            var currentLoggedInTeacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _teacherService.UnenrollFromCourse(courseId, teacherId, currentLoggedInTeacherId);
            if (!result.Success)
                return Problem(result.ErrorMessage);

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

       
    }
}
