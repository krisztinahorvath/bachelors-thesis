using app_server.Controllers;
using app_server.Models;
using app_server.Models.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
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

        public async Task<ActionResult<StudentUserPreferenceDTO>?> GetUserPreferences(long studentId)
        {
            if (_context.Students == null)
                return null;

            var userPreference = await _context.UserPreferences.FirstOrDefaultAsync(x => x.StudentId == studentId);

            if (userPreference == null)
                return null;

            return StudentUserPreferenceToDTO(userPreference);
        }

        public async Task<ActionResult<StudentFinalGradeDTO>?> GetStudentSituationAtCourse(long studentId, long courseId)
        {
            if (_context.Students == null)
                return null;

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

            return new StudentFinalGradeDTO
            {
                FinalGrade = result.FinalGrade,
                ExperiencePoints = (int)(result.FinalGrade * 300)
            };
        }

        public async Task<StudentAchievementDTO?> FetchStudentAchievements(long courseId, long studentId)
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

        public async Task<ActionResult<IEnumerable<AssignmentAndGradeDTO>>?> GetStudentAssignmentAndGrades(long studentId, long courseId)
        {
            if (_context.Students == null)
                return null;

            return await _context.Assignments
               .Where(a => a.CourseId == courseId)
               .OrderBy(a => a.DueDate)
               .Select(x => new AssignmentAndGradeDTO
               {
                   AssignmentId = x.Id,
                   Name = x.Name,
                   Description = x.Description,
                   DueDate = x.DueDate,
                   Weight = x.Weight,
                   Score = x.Grades!.Where(g => g.StudentId == studentId).Select(g => g.Score).FirstOrDefault(),
                   DateReceived = x.Grades!.Where(g => g.StudentId == studentId).Select(g => g.DateReceived).FirstOrDefault(),

               }).ToListAsync();
        }

        public async Task<bool?> UpdateStudentPreferences(long studentId, StudentUserPreferenceDTO studentUserPreferenceDTO)
        {
            var userPreference = await _context.UserPreferences.FirstOrDefaultAsync(x => x.StudentId == studentId);

            if (userPreference == null)
            {
                return null;
            }

            userPreference.ShowPoints = studentUserPreferenceDTO.ShowPoints;
            userPreference.ShowLevels = studentUserPreferenceDTO.ShowLevels;
            userPreference.ShowBadges = studentUserPreferenceDTO.ShowBadges;
            userPreference.ShowProgressBars = studentUserPreferenceDTO.ShowProgressBars;
            userPreference.ShowLeaderboards = studentUserPreferenceDTO.ShowLeaderboards;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(studentId))
                {
                    return null;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }


        private bool StudentExists(long id)
        {
            return (_context.Students?.Any(e => e.Id == id)).GetValueOrDefault();
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

        private static StudentUserPreferenceDTO StudentUserPreferenceToDTO(UserPreference userPreference)
        {
            return new StudentUserPreferenceDTO
            {
                ShowPoints = userPreference.ShowPoints,
                ShowLevels = userPreference.ShowLevels,
                ShowBadges = userPreference.ShowBadges,
                ShowProgressBars = userPreference.ShowProgressBars,
                ShowLeaderboards = userPreference.ShowLeaderboards,
            };
        }
    }
}
