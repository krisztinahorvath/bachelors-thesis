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
                .Select(x => AssignmentToDTO(x)).ToListAsync();
        }

        // GET: api/assignments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssignmentDTO>> GetAssignmentById(long id)
        {
            if (_context.Assignments == null)
                return NotFound();

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || tokenData?.Item1 == null)
                return Unauthorized("Invalid token.");

            var assignment = await _context.Assignments.FirstOrDefaultAsync(x => x.Id == id);

            if (assignment == null)
                return NotFound();

            var userId = tokenData.Item1;

            // check if user is a course teacher or it is a student enrolled to that course
            if (!_context.Enrollments.Any(e => e.CourseId == assignment.CourseId && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == assignment.CourseId && c.TeacherId == userId))
                return Unauthorized("You aren't authorized to see information about this course.");


            return AssignmentToDTO(assignment);
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
                .Select(x => AssignmentToDTO(x)).ToListAsync();
        }

        // GET: api/assignments/names/course/5
        [HttpGet("names/course/{courseId}")]
        public async Task<ActionResult<IEnumerable<AssignmentNameDTO>>> GetAllAssignmentNamesAtCourse(long courseId)
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
                //.OrderBy(a => a.DueDate)
                .Select(x => AssignmentNameToDTO(x)).ToListAsync();
        }

        // POST: api/assignments
        [HttpPost]
        public async Task<ActionResult<AssignmentDTO>> CreateAssignment(AssignmentDTO assignmentDTO)
        {
            if (_context.Assignments == null)
            {
                return Problem("Entity set 'StudentsRegisterContext.Assignments'  is null.");
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

            Assignment assignment = new Assignment
            {
                Name = assignmentDTO.Name,
                Description = assignmentDTO.Description,
                DueDate = assignmentDTO.DueDate,
                CourseId = assignmentDTO.CourseId,
                Weight = assignmentDTO.Weight
            };

            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAssignments), new { id = assignment.Id }, assignment);
        }

        // PUT: api/assignments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssignments(long id, AssignmentDTO assignmentDTO)
        {
            if (id != assignmentDTO.Id)
            {
                return BadRequest();
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var teacherId = tokenData!.Item1;

            // make sure the person updating the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == assignmentDTO.CourseId))
            {
                return Unauthorized("You can't update assignments for courses that you aren't a teacher for");
            }

            var assignment = await _context.Assignments.FindAsync(id);

            if (assignment == null)
            {
                return NotFound();
            }

            assignment.Name = assignmentDTO.Name;
            assignment.Description = assignmentDTO.Description;
            assignment.DueDate = assignmentDTO.DueDate;
            assignment.Weight = assignmentDTO.Weight;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssignmentExists(id))
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

        // DELETE: api/assignments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAssignment(long id)
        {
            if (_context.Assignments == null)
            {
                return NotFound();
            }

            // validate token data
            var tokenData = UserController.ExtractUserIdAndJWTToken(User);
            if (tokenData == null || (tokenData?.Item1 == null || tokenData?.Item2 != UserType.Teacher))
                return Unauthorized("Invalid token or user is not a teacher.");

            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null)
            {
                return NotFound();
            }

            var teacherId = tokenData!.Item1;
            // make sure the person deleting the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == assignment.CourseId))
            {
                return Unauthorized("You can't delete courses that you aren't a teacher for");
            }

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ************************************
        // TODO: grade assignment - from spreadsheet?
        // ************************************

        // ************************************
        // TODO: modify grade / grade details
        // ************************************

        private bool AssignmentExists(long id)
        {
            return (_context.Assignments?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static AssignmentDTO AssignmentToDTO(Assignment assignment)
        {
            return new AssignmentDTO
            {
                Id = assignment.Id,
                Name = assignment.Name,
                Description = assignment.Description,
                DueDate = assignment.DueDate.ToLocalTime(),
                Weight = assignment.Weight,
                CourseId = assignment.CourseId
            };
        }

        private static AssignmentNameDTO AssignmentNameToDTO(Assignment assignment)
        {
            return new AssignmentNameDTO
            {
                Id = assignment.Id,
                Name = assignment.Name,
                Weight = assignment.Weight,
            };
        }
    }
}
