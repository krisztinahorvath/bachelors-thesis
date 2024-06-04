using app_server.Controllers;
using app_server.Models;
using app_server.Models.DTOs;
using app_server.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;

namespace app_server.Services
{
    public class CourseService
    {
        private readonly StudentsRegisterContext _context;

        public CourseService(StudentsRegisterContext context)
        {
            _context = context;
        }

        // GET COURSE BY ID
        public async Task<ActionResult<CourseDTO>?> GetCourseById(long courseId)
        {
            if (_context.Courses == null)
                return null;

            var course = await _context.Courses.FirstOrDefaultAsync(x => x.Id == courseId);

            if (course == null)
                return null;

            return CourseToDTO(course);
        }

        // GET COURSES OF TEACHER
        public async Task<ActionResult<IEnumerable<CourseDTO>>?> GetCoursesOfTeacher(long teacherId)
        {
            if (_context.Courses == null)
            {
                return null;
            }

            var courses = await _context.CourseTeachers
                .Where(t => t.TeacherId == teacherId)
                .Select(x => CourseToDTO(x.Course))
                .ToListAsync();

            return courses;
        }

        // GET COURSES OF STUDENT
        public async Task<ActionResult<IEnumerable<CourseDTO>>?> GetCoursesOfStudent(long studentId)
        {
            if (_context.Courses == null)
            {
                return null;
            }

            var courses = await _context.Enrollments
                .Where(t => t.StudentId == studentId)
                .Select(x => CourseToDTO(x.Course))
                .ToListAsync();

            return courses;
        }

        // GET ALL TEACHERS AT COURSE
        public async Task<ActionResult<IEnumerable<TeacherDTO>>?> GetTeachersOfACourse(long courseId, long userId)
        {
            if (_context.Courses == null)
            {
                return null;
            }

            // check if user is a course teacher or it is a student enrolled to that course
            if (!_context.Enrollments.Any(e => e.CourseId == courseId && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == courseId && c.TeacherId == userId))
                return null;

            var teachers = await _context.CourseTeachers
                .Where(c => c.CourseId == courseId)
                .OrderBy(c => c.Teacher.Name)
                .Select(t => TeacherToTeacherDTO(t.Teacher))
                .ToListAsync();

            return teachers;
        }

        // GET ALL STUDENTS AT COURSE
        public async Task<ActionResult<IEnumerable<EnrolledStudentDTO>>?> GetAllStudentsAtCourse(long courseId, long userId)
        {
            if (_context.Courses == null)
            {
                return null;
            }

            // check if user is a course teacher or it is a student enrolled to that course
            if (!_context.Enrollments.Any(e => e.CourseId == courseId && e.StudentId == userId) &&
                !_context.CourseTeachers.Any(c => c.CourseId == courseId && c.TeacherId == userId))
                return null;

            var students = await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Select(e => e.Student)
                .OrderBy(s => s.Name)
                .Select(s => StudentToEnrolledStudentDTO(s))
                .ToListAsync();

            return students;
        }

        // GET NEW ENROLLMENT KEY
        public async Task<string?> GetNewEnrollmentKey(long courseId, long teacherId)
        {
            if (_context.Courses == null)
            {
                return null;
            }

            // make sure the person deleting the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == courseId))
            {
                return null;
            }

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return null;
            }

            course.EnrollmentKey = await GenerateUniqueEnrollmentKey(8);
            await _context.SaveChangesAsync();


            return course.EnrollmentKey;
        }

        // GET ALL STUDENTS GRADES AT COURES
        public async Task<Dictionary<string, Dictionary<string, object>>> GetAllCourseStudentsAssignmentGrades(long courseId)
        {
            // Fetch required data from the database
            var enrollments = await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Join(
                    _context.Students,
                    enrollment => enrollment.StudentId,
                    student => student.Id,
                    (enrollment, student) => new { enrollment, student }
                )
                .Join(
                    _context.Assignments.Where(a => a.CourseId == courseId),
                    enrollmentStudent => true,
                    assignment => true,
                    (enrollmentStudent, assignment) => new { enrollmentStudent, assignment }
                )
                .ToListAsync();

            // Get distinct assignment IDs and their weights
            var assignments = _context.Assignments
                .Where(a => a.CourseId == courseId)
                .Select(a => new { a.Id, a.Weight })
                .OrderBy(a => a.Id)
                .ToList();

            var assignmentIds = assignments.Select(a => a.Id).ToList();

            // Perform the grouping operation client-side
            var groupedGrades = enrollments
                .GroupJoin(
                    _context.Grades,
                    joinResult => new { StudentId = joinResult.enrollmentStudent.student.Id, AssignmentId = joinResult.assignment.Id },
                    grade => new { grade.StudentId, grade.AssignmentId },
                    (joinResult, grades) => new
                    {
                        StudentId = joinResult.enrollmentStudent.student.Id,
                        StudentName = joinResult.enrollmentStudent.student.Name,
                        UniqueIdentificationCode = joinResult.enrollmentStudent.student.UniqueIdentificationCode,
                        AssignmentId = joinResult.assignment.Id,
                        Grades = grades.OrderBy(g => g.AssignmentId).ToList() // Order grades by assignment
                    }
                )
                .ToList(); // Materialize the query here

            // Create a dictionary to store the student data
            var studentsData = groupedGrades.GroupBy(
                result => new { result.StudentId, result.StudentName, result.UniqueIdentificationCode },
                (key, group) =>
                {
                    var studentData = new Dictionary<string, object>
                    {
                { "StudentId", key.StudentId },
                { "StudentName", key.StudentName },
                { "UniqueIdentificationCode", key.UniqueIdentificationCode }
                    };

                    double finalGradeSum = 0;
                    double totalWeight = 0;

                    // Populate scores and dates received based on the actual assignments in the course
                    foreach (var assignment in assignments)
                    {
                        var assignmentId = assignment.Id;
                        var weight = assignment.Weight;
                        var grade = group.FirstOrDefault(g => g.AssignmentId == assignmentId)?.Grades.FirstOrDefault();

                        studentData[$"assignment{assignmentId}"] = grade?.Score;
                        studentData[$"dateReceived{assignmentId}"] = grade?.DateReceived.ToLocalTime();

                        if (grade?.Score != null)
                        {
                            finalGradeSum += grade.Score * weight;
                            totalWeight += weight;
                        }
                        else totalWeight += weight;
                    }

                    // Calculate the final grade
                    var finalGrade = totalWeight > 0 ? finalGradeSum / totalWeight : 0;
                    studentData["FinalGrade"] = Math.Round(finalGrade, 2);

                    return studentData;
                })
                .ToDictionary(item => $"{item["StudentId"]}");

            return studentsData;
        }

        // CREATE COURSE
        public async Task<OperationResult<Course>> CreateCourse(CourseDTO courseDTO, long teacherId)
        {
            // valid teacher id
            if (!_context.Teachers.Any(t => t.Id == teacherId))
            {
                return OperationResult<Course>.FailResult("User is not a registered teacher.");
            }

            Course course = new Course
            {
                Name = courseDTO.Name,
                EnrollmentKey = await GenerateUniqueEnrollmentKey(8),
                Image = courseDTO.Image
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            CourseTeacher courseTeacher = new CourseTeacher
            {
                CourseId = course.Id,
                TeacherId = teacherId,
            };


            _context.CourseTeachers.Add(courseTeacher);
            await _context.SaveChangesAsync();

            return OperationResult<Course>.SuccessResult(course);
        }

        // PUT COURSE
        public async Task<OperationResult> PutCourse(CourseDTO courseDTO, long teacherId)
        {
            var courseId = courseDTO.Id;

            // make sure the person updating the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == courseId))
            {
                return OperationResult.FailResult("You can't update courses that you aren't a teacher for");
            }

            var course = await _context.Courses.FindAsync(courseId);

            if (course == null)
            {
                return OperationResult.FailResult("");
            }

            course.Name = courseDTO.Name;

            if (courseDTO.Image != null)
                course.Image = courseDTO.Image;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(courseId))
                {
                    return OperationResult.FailResult("");
                }
                else
                {
                    throw;
                }
            }

            return OperationResult.SuccessResult();
        }

        // DELETE COURSE
        public async Task<OperationResult> DeleteCourse(long courseId, long teacherId)
        {
            if (_context.Courses == null)
            {
                return OperationResult.FailResult("No courses found.");
            }

            // make sure the person deleting the course is a teacher at that course
            if (!_context.CourseTeachers.Any(t => t.TeacherId == teacherId && t.CourseId == courseId))
            {
                return OperationResult.FailResult("You can't delete courses that you aren't a teacher for");
            }

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return OperationResult.FailResult("No course found with that id.");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return OperationResult.SuccessResult();
        }

        private bool CourseExists(long id)
        {
            return (_context.Courses?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private async Task<string> GenerateUniqueEnrollmentKey(int length)
        {
            string enrollmentKey;
            do
            {
                enrollmentKey = GenerateRandomString(length);
            } while (await _context.Courses.AnyAsync(course => course.EnrollmentKey == enrollmentKey));

            return enrollmentKey;
        }

        private static string GenerateRandomString(int length)
        {
            Random random = new Random();
            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            StringBuilder randomString = new StringBuilder(length);

            for (int i = 0; i < length; i++)
            {
                randomString.Append(alphabet[random.Next(alphabet.Length)]);
            }

            return randomString.ToString();
        }

        private static CourseDTO CourseToDTO(Course course)
        {
            return new CourseDTO
            {
                Id = course.Id,
                Name = course.Name,
                EnrollmentKey = course.EnrollmentKey,
                Image = course.Image
            };
        }

        private static EnrolledStudentDTO StudentToEnrolledStudentDTO(Student student)
        {
            return new EnrolledStudentDTO
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                UniqueIdentificationCode = student.UniqueIdentificationCode,
            };
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
