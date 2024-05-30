using app_server.Models;
using app_server.Models.DTOs;
using app_server.Services;
using app_server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Controllers
{
    [Route("api/assignments")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;
        private readonly Validate _validate;
        private readonly AssignmentService _assignmentService;

        public AssignmentController(StudentsRegisterContext context, Validate validate, AssignmentService assignmentService)
        {
            _context = context;
            _validate = validate;
            _assignmentService = assignmentService;
        }

        // GET: api/assignments 
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AssignmentDTO>>> GetAssignments()
        {
            if (_context.Assignments == null)
            {
                return NotFound();
            }

            return await _context.Assignments
                .Select(x => AssignmentService.AssignmentToDTO(x)).ToListAsync();
        }

        // GET: api/assignments/5
        [HttpGet("{id}")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult<AssignmentDTO>> GetAssignmentById(long id)
        {
            var result = await _assignmentService.GetAssignmentById(id);
            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/assignments/course/5
        [HttpGet("course/{courseId}")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult<IEnumerable<AssignmentDTO>>> GetAllAssignmentsAtCourse(long courseId)
        {
            var result = await _assignmentService.GetAllAssignmentsAtCourse(courseId);
            if (result == null)
                return NotFound();

            return result;
        }

        // GET: api/assignments/names/course/5
        [HttpGet("names/course/{courseId}")]
        [AuthorizeGeneralUser]
        public async Task<ActionResult<IEnumerable<AssignmentNameDTO>>> GetAllAssignmentNamesAtCourse(long courseId)
        {
            var result = await _assignmentService.GetAllAssignmentNamesAtCourse(courseId);
            if (result == null)
                return NotFound();

            return result;
        }

        // POST: api/assignments
        [HttpPost]
        [AuthorizeTeacher]
        public async Task<ActionResult<AssignmentDTO>> CreateAssignment(AssignmentDTO assignmentDTO)
        {
            var assignment = await _assignmentService.CreateAssignment(assignmentDTO);
            if (assignment == null)
                return Problem();

            return CreatedAtAction(nameof(GetAssignments), new { id = assignment.Id }, assignment);
        }

        // PUT: api/assignments/5
        [HttpPut("{id}")]
        [AuthorizeTeacher]
        public async Task<IActionResult> PutAssignments(long id, AssignmentDTO assignmentDTO)
        {
            if (id != assignmentDTO.Id)
            {
                return BadRequest();
            }

            var teacherId = (long)HttpContext.Items["TeacherId"];

            try
            {
                var result = await _assignmentService.PutAssignments(id, assignmentDTO, teacherId);
                if (!result.Success)
                    return Problem(result.ErrorMessage);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/assignments/5
        [HttpDelete("{id}")]
        [AuthorizeTeacher]
        public async Task<ActionResult> DeleteAssignment(long id)
        {
            var teacherId = (long)HttpContext.Items["TeacherId"];

            var result = await _assignmentService.DeleteAssignment(id, teacherId);
            if (!result.Success)
                return Problem(result.ErrorMessage);

            return NoContent();
        }
    }
}
