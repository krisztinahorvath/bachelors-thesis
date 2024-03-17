using app_server.Models;
using Microsoft.AspNetCore.Mvc;

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

        // ************************************
        // TODO: create a new course
        // ************************************

        // ************************************
        // TODO: create assignmnet for a given course
        // ************************************

        // ************************************
        // TODO: grade assigmnet
        // ************************************

        // ************************************
        // TODO: modify assigment details
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
