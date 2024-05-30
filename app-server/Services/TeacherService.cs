using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Services
{
    public class TeacherService
    {
        private readonly StudentsRegisterContext _context;

        public TeacherService(StudentsRegisterContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<TeacherDTO>>> AutocompleteName(long courseId, string query, int pageNumber = 1, int pageSize = 100)
        {
            var enrolledTeacherIds = await _context.CourseTeachers
                .Where(ct => ct.CourseId == courseId)
                .Select(ct => ct.TeacherId)
                .ToListAsync();

            var names = await _context.Teachers
                .Where(t => t.Name.ToLower().Contains(query.ToLower()) && !enrolledTeacherIds.Contains(t.Id))
                .Select(t => TeacherToTeacherDTO(t))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return names;
        }

        public async Task<OperationResult> AddTeachersToCourse(long courseId, CourseTeacherListDTO addCourseTeachersDTO)
        {
            var course = await _context.Courses.FindAsync(courseId);

            if (course == null) 
            {
                return OperationResult.FailResult("Course not found");
            }

            var teachers = await _context.Teachers.Where(t => addCourseTeachersDTO.TeacherIds.Contains(t.Id)).ToListAsync();

            foreach (var teacher in teachers)
            {
                if (!_context.CourseTeachers.Any(ct => ct.CourseId == courseId && ct.TeacherId == teacher.Id))
                {
                    _context.CourseTeachers.Add(new CourseTeacher { CourseId = courseId, TeacherId = teacher.Id });
                }
            }

            await _context.SaveChangesAsync();

            return OperationResult.SuccessResult();
        }

        public async Task<OperationResult> UnenrollFromCourse(long courseId, long teacherId, long currentLoggedInTeacherId)
        {
            if (_context.Courses == null)
            {
                return OperationResult.FailResult("No courses found.");
            }

            // make sure the person removing the teacher from the course is a course teacher
            if (!_context.CourseTeachers.Any(t => t.TeacherId == currentLoggedInTeacherId && t.CourseId == courseId))
            {
                return OperationResult.FailResult("You can't remove a teacher from a courses that you aren't a teacher for");
            }

            var courseTeacher = await _context.CourseTeachers
                .FirstOrDefaultAsync(e => e.TeacherId == teacherId && e.CourseId == courseId);

            if (courseTeacher == null)
            {
                return OperationResult.FailResult("Course teacher not found");
            }

            _context.CourseTeachers.Remove(courseTeacher);
            await _context.SaveChangesAsync();

            return OperationResult.SuccessResult();
        }

        private static TeacherDTO TeacherToTeacherDTO(Teacher teacher)
        {
            return new TeacherDTO
            {
                Id = teacher.Id,
                Name = teacher.Name,
                Email = teacher.Email,
            };
        }
    }
}
