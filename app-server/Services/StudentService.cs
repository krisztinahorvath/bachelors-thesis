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

        // GET LEADERBOARD
        public async Task<IEnumerable<LeaderboardDTO>?> GetLeaderboardAtCourse(long courseId, long userId)
        {
            // Cceck if user is a course teacher or is a student enrolled in the course
            if (!_context.Enrollments.Any(e => e.CourseId == courseId && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == courseId && c.TeacherId == userId))
                return null;

            // retrieve all student ids enrolled in the course
            var studentIds = _context.Enrollments.Where(e => e.CourseId == courseId).Select(e => e.StudentId).ToList();

            List<LeaderboardDTO> leaderboard = new List<LeaderboardDTO>();
            foreach (var studentId in studentIds)
            {
                var achievement = await FetchStudentAchievements(courseId, studentId);
                if (achievement != null)
                {
                    leaderboard.Add(new LeaderboardDTO
                    {
                        Nickname = _context.Students.FirstOrDefault(s => s.Id == studentId)?.Nickname,
                        FinalGrade = (float)Math.Round(achievement.FinalGrade, 2),
                        ExperiencePoints = achievement.ExperiencePoints,
                        Image = _context.Students.FirstOrDefault(s => s.Id == studentId)?.Image,
                        Level = achievement.Level,
                        Rank = 0, // temporarly 0, will be updated after sorting
                        OnTimeBadgeUnlocked = achievement.OnTimeBadgeUnlocked,
                    });
                }
            }

            // sort leaderboard by final grade and update ranks
            leaderboard = leaderboard.OrderByDescending(x => x.FinalGrade).ToList();
            for (int i = 0; i < leaderboard.Count; i++)
            {
                leaderboard[i].Rank = i + 1;
            }

            var top10 = leaderboard.Take(10).ToList();

            // check if the current user's rank is beyond top 10 and add them if necessary
            var userEntry = leaderboard.FirstOrDefault(x => x.Image == _context.Students.FirstOrDefault(s => s.Id == userId)?.Image);
            if (userEntry != null && userEntry.Rank > 10)
            {
                top10.Add(new LeaderboardDTO
                {
                    Nickname = userEntry.Nickname,
                    FinalGrade = userEntry.FinalGrade,
                    ExperiencePoints = userEntry.ExperiencePoints,
                    Rank = userEntry.Rank,
                    Image = userEntry.Image,
                    OnTimeBadgeUnlocked = userEntry.OnTimeBadgeUnlocked,
                });
            }

            return top10;
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

        public static int ComputeStudentLevel(float grade)
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
