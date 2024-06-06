using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace app_server.Services
{
    public class GradeService
    {
        private readonly StudentsRegisterContext _context;
        private readonly Validate _validate;

        public GradeService(StudentsRegisterContext context, Validate validate)
        {
            _context = context;
            _validate = validate;
        }

        // CREATE OR UPDATE GRADE
        public async Task<OperationResult<GradeDTO>> CreateOrUpdateGrade(long teacherId, GradeDTO gradeDTO)
        {
            var isGradeValid = _validate.ValidateGradeFields(gradeDTO);
            if (isGradeValid != "")
                return OperationResult<GradeDTO>.FailResult(isGradeValid);

            // check if the grade already exists
            var existingGrade = await _context.Grades
                .FirstOrDefaultAsync(g => g.StudentId == gradeDTO.StudentId && g.AssignmentId == gradeDTO.AssignmentId);

            if (existingGrade == null)
            {
                // Create new grade
                var grade = new Grade
                {
                    StudentId = gradeDTO.StudentId,
                    AssignmentId = gradeDTO.AssignmentId,
                    Score = gradeDTO.Score,
                    DateReceived = gradeDTO.DateReceived,
                };

                _context.Grades.Add(grade);
            }
            else
            {
                // Update existing grade
                existingGrade.Score = gradeDTO.Score;
                existingGrade.DateReceived = gradeDTO.DateReceived;
            }

            await _context.SaveChangesAsync();

            // compute the new final grade at the course
            var courseId = _context.Assignments
                .Where(a => a.Id == gradeDTO.AssignmentId)
                .Select(a => a.CourseId)
                .FirstOrDefault();

            var query = from enrollment in _context.Enrollments
                        where enrollment.CourseId == courseId && enrollment.StudentId == gradeDTO.StudentId
                        join grade in _context.Grades.Where(g => g.Assignment.CourseId == courseId) on gradeDTO.StudentId equals grade.StudentId into studentGrades
                        select new
                        {
                            FinalGrade = studentGrades.Sum(g => g.Score * g.Assignment.Weight) / 100,
                        };
            var result = await query.FirstOrDefaultAsync();

            gradeDTO.FinalGrade = (float?)Math.Round(result!.FinalGrade, 2);

            return OperationResult<GradeDTO>.SuccessResult(gradeDTO);
        }

        // CREATE OR UPDATE GRADES FROM IMPORT
        public async Task<OperationResult> CreateGradesFromImport(List<ImportGradeDTO> gradeDTOs, long courseId)
        {

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var gradeDto in gradeDTOs)
                    {
                        // check if the student is enrolled in the course
                        var enrollment = await _context.Enrollments
                            .Include(e => e.Student)
                            .FirstOrDefaultAsync(e => e.Student.UniqueIdentificationCode == gradeDto.UniqueIdCode && e.CourseId == courseId);

                        if (enrollment == null)
                        {
                            await transaction.RollbackAsync();
                            return OperationResult.FailResult($"Student with unique id code {gradeDto.UniqueIdCode} is not enrolled to this course.");
                        }

                        var studentId = enrollment.StudentId;

                        foreach (var assignmentGrade in gradeDto.Assignments)
                        {
                            if (assignmentGrade.Score.HasValue && assignmentGrade.DateReceived.HasValue)
                            {
                                var existingGrade = await _context.Grades
                                    .FirstOrDefaultAsync(g => g.StudentId == studentId && g.AssignmentId == assignmentGrade.AssignmentId);

                                if (existingGrade != null)
                                {
                                    // update existing grade
                                    existingGrade.Score = assignmentGrade.Score.Value;
                                    existingGrade.DateReceived = assignmentGrade.DateReceived.Value;

                                    _context.Grades.Update(existingGrade);
                                }
                                else
                                {
                                    var grade = new Grade
                                    {
                                        StudentId = studentId,
                                        AssignmentId = assignmentGrade.AssignmentId,
                                        Score = assignmentGrade.Score.Value,
                                        DateReceived = assignmentGrade.DateReceived.Value
                                    };

                                    _context.Grades.Add(grade);
                                }
                            }
                        }
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return OperationResult.FailResult($"Internal server error: {ex.Message}");
                }
            }

            return OperationResult.SuccessResult();
        }


        // UPDATE GRADE
        public async Task<OperationResult> PutGrade(long teacherId, long studentId, long assignmentId, GradeDTO gradeDTO)
        {
            var assignment = _context.Assignments.Find(assignmentId);

            // make sure the person updating the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == assignment!.CourseId))
            {
                return OperationResult.FailResult("You can't update assignments for courses that you aren't a teacher for");
            }

            var grade = await _context.Grades
                .FirstOrDefaultAsync(a => a.StudentId == studentId && a.AssignmentId == assignmentId);

            if (grade == null)
            {
                return OperationResult.FailResult("Grade not found.");
            }

            grade.Score = gradeDTO.Score;
            grade.DateReceived = gradeDTO.DateReceived;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GradeExists(studentId, assignmentId))
                {
                    return OperationResult.FailResult("Grade doesn't exist for this assignment and student.");
                }
                else
                {
                    throw;
                }
            }

            return OperationResult.SuccessResult();
        }

        private bool GradeExists(long studentId, long assignmentId)
        {
            return (_context.Grades?.Any(e => e.StudentId == studentId && e.AssignmentId == assignmentId)).GetValueOrDefault();
        }
    }
}
