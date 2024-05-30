using app_server.Models.DTOs;
using app_server.Services;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Controllers
{
    [Route("api/grades")]
    [ApiController]
    public class GradeController : ControllerBase
    {
        private readonly Validate _validate;
        private readonly GradeService _gradeService;

        public GradeController(Validate validate, GradeService gradeService)
        {
            _validate = validate;
            _gradeService = gradeService;
        }

        // POST: api/grades
        [HttpPost("create")]
        [AuthorizeTeacher]
        public async Task<ActionResult<GradeDTO>> CreateOrUpdateGrade(GradeDTO gradeDTO)
        {
            var teacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _gradeService.CreateOrUpdateGrade(teacherId, gradeDTO);

            if (result == null)
                return NotFound();
            
            // because the service takes a reference to the var
            return Ok(gradeDTO);
        }

        // POST: api/grades/create-from-import
        [HttpPost("create-from-import/{courseId}")]
        [AuthorizeTeacher]
        public async Task<IActionResult> CreateGrades([FromBody] List<ImportGradeDTO> gradeDTOs, long courseId)
        {
            var teacherId = (long)HttpContext.Items["TeacherId"];

            try
            {
                var result = await _gradeService.CreateGradesFromImport(gradeDTOs, courseId);
                if (!result.Success)
                    return Problem(result.ErrorMessage);

            } catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Grades have been successfully created.");
        }


        // PUT: api/grades/5/5
        [HttpPut("{studentId}/assignmentId")]
        [AuthorizeTeacher]
        public async Task<IActionResult> PutGrade(long studentId, long assignmentId, GradeDTO gradeDTO)
        {
            if (studentId != gradeDTO.StudentId || assignmentId != gradeDTO.AssignmentId)
            {
                return BadRequest();
            }

            var teacherId = (long)HttpContext.Items["TeacherId"];

            try
            {
                var result = await _gradeService.PutGrade(teacherId, studentId, assignmentId, gradeDTO);

                if (!result.Success)
                    return Problem(result.ErrorMessage);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
