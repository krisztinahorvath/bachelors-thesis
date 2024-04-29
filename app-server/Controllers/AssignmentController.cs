using app_server.Models;
using app_server.Models.DTOs;
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

        public AssignmentController(StudentsRegisterContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
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
                .Select(x => AssignmentsToDTO(x)).ToListAsync();
        }

        // GET: api/assignments/course/5
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<AssignmentDTO>>> GetAllAssignmentsAtCourse(long courseId)
        {
            if (_context.Assignments == null)
            {
                return NotFound();
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null)
                return Unauthorized("Invalid token.");

            var userId = tokenData.Item1;

            // check if user is a course teacher or it is a student enrolled to that course
            if (!_context.Enrollments.Any(e => e.CourseId == courseId && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == courseId && c.TeacherId == userId))
                return Unauthorized("You aren't authorized to see information about this assignment.");

            return await _context.Assignments
                .Where(a => a.CourseId == courseId)
                .OrderBy(a => a.DueDate)
                .Select(x => AssignmentsToDTO(x)).ToListAsync();
        }

        // ************************************
        // TODO: create assignmnet for a given course
        // ************************************

        // ************************************
        // TODO: grade assignment - from spreadsheet?
        // ************************************

        // ************************************
        // TODO: modify assigment 
        // ************************************

        // ************************************
        // TODO: modify grade / grade details
        // ************************************

        private static AssignmentDTO AssignmentsToDTO(Assignment assignment)
        {
            return new AssignmentDTO
            {
                Id = assignment.Id,
                Name = assignment.Name,
                Description = assignment.Description,
                DueDate = assignment.DueDate,
                CourseId = assignment.CourseId
            };
        }
    }
}
