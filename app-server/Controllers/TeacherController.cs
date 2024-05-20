using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace app_server.Controllers
{
    [Route("api/teachers")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly StudentsRegisterContext _context;

        public TeacherController(StudentsRegisterContext context)
        {
            _context = context;
        }

        // GET: api/teachers/autocomplete/10?query=string&pageNumber=1&pageSize=100
        [HttpGet("autocomplete")]
        public async Task<ActionResult<IEnumerable<Teacher>>> AutocompleteName(long courseId, string query, int pageNumber = 1, int pageSize = 100)
        {
            var enrolledTeacherIds = await _context.CourseTeachers
                .Where(ct => ct.CourseId == courseId)
                .Select(ct => ct.TeacherId)
                .ToListAsync();

            var names = await _context.Teachers
                .Where(t => t.Name.ToLower().Contains(query.ToLower()) && !enrolledTeacherIds.Contains(t.Id))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(names);
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
