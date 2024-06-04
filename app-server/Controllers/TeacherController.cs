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
        public async Task<ActionResult> DeleteCourseTeacher(long courseId, long teacherId)
        {
            var currentLoggedInTeacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _teacherService.DeleteCourseTeacher(courseId, teacherId, currentLoggedInTeacherId);
            if (!result.Success)
                return Problem(result.ErrorMessage);

            return NoContent();
        }

        // DELETE: api/teachers/unenroll/5/5
        [HttpDelete("unenroll/{courseId}/{studentId}")]
        [AuthorizeTeacher]
        public async Task<ActionResult> DeleteStudentFromCourse(long courseId, long studentId)
        {
            var teacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _teacherService.DeleteStudentFromCourse(courseId, studentId, teacherId);
            if (!result.Success)
                return BadRequest(result.ErrorMessage);

            return NoContent();
        }
    }
}
