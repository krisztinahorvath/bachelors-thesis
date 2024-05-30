using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Services
{
    public class StudentService
    {
        private readonly StudentsRegisterContext _context;

        public StudentService(StudentsRegisterContext context)
        {
            _context = context;
        }

        public async Task<StudentAchievementDTO?> FetchStudentAchievementsAsync(long courseId, long studentId)
        {
            var query = from enrollment in _context.Enrollments
                        where enrollment.CourseId == courseId && enrollment.StudentId == studentId
                        join grade in _context.Grades.Where(g => g.Assignment.CourseId == courseId) on studentId equals grade.StudentId into studentGrades
                        select new
                        {
                            FinalGrade = studentGrades.Sum(g => g.Score * g.Assignment.Weight) / 100,
                        };

            var result = await query.FirstOrDefaultAsync();

            if (result == null)
                return null;

            var noAssignmentsOnTime = await GetNoOfAssignmentsDoneOnTimeAtCourse(studentId, courseId);
            var noAssignmentsAtCourse = _context.Assignments.Where(a => a.CourseId == courseId).Count();

            // see if 75% of assignments were done before the deadline
            var onTimeBadge = false;

            if ((noAssignmentsAtCourse * 75) / 100 <= (int) noAssignmentsOnTime.Value)
                onTimeBadge = true;

            return new StudentAchievementDTO
            {
                StudentId = studentId,
                FinalGrade = result.FinalGrade,
                ExperiencePoints = (int)(result.FinalGrade * 300),
                OnTimeBadgeUnlocked = onTimeBadge,
                Level = ComputeStudentLevel(result.FinalGrade)
            };
        }

        private async Task<ActionResult<int>> GetNoOfAssignmentsDoneOnTimeAtCourse(long studentId, long courseId)
        {
            var student = await _context.Students
                .Include(s => s.Grades)
                .ThenInclude(g => g.Assignment)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
                return 0;

            int count = student.Grades
                .Where(g => g.Assignment.CourseId == courseId &&
                            g.DateReceived <= g.Assignment.DueDate &&
                            g.Score > 0)
                .Count();

            return count;
        }

        private static int ComputeStudentLevel(float grade)
        {
            if (grade < 2)
                return 1;
            else if (grade >= 2 && grade < 4)
                return 2;
            else if (grade >= 4 && grade < 6.5)
                return 3;
            else if (grade >= 6.5 && grade < 9.5)
                return 4;
            return 5;
        }
    }
}
