using app_server.Controllers;
using app_server.Models;
using Bogus;
using Microsoft.EntityFrameworkCore;

namespace app_server.Utils
{
    public static class SeedData
    {
        private const int NO_TEACHERS = 20;
        private const int NO_STUDENTS = 200;
        private const int NO_COURSES = 5;
        private const int NO_ASSIGNMENTS = 5;

        private static readonly string PASSWORD = UserController.HashPassword("test");

        public static async Task Start(IServiceProvider serviceProvider) 
        {
            using (var context = new StudentsRegisterContext(serviceProvider.GetRequiredService<DbContextOptions<StudentsRegisterContext>>()))
            {
                if (!await context.Teachers.AnyAsync())
                    await SeedTeachers(context, NO_TEACHERS);

                if (!await context.Students.AnyAsync())
                    await SeedStudentsAndUserPreferences(context, NO_STUDENTS);

                if (!await context.Courses.AnyAsync())
                    await SeedCourses(context, NO_COURSES);

                if (!await context.CourseTeachers.AnyAsync())
                    await SeedCourseTeachers(context);

                if (!await context.Enrollments.AnyAsync())
                    await SeedEnrollments(context);


                // TODO: SeedAssignment

                // TODO: SeedGrade
            }
        }

        private static async Task SeedTeachers(StudentsRegisterContext context, int noTeachers)
        {
            var teachers = new List<Teacher>();
            var faker = new Faker("en");

            for(int i = 0; i < noTeachers; i++)
            {
                var teacher = new Teacher
                {
                    Name = faker.Name.FullName(),
                    Email = faker.Internet.Email(),
                    Password = PASSWORD,
                    UserType = UserType.Teacher
                };

                teachers.Add(teacher);
            }

            await context.Teachers.AddRangeAsync(teachers);
            await context.SaveChangesAsync();
        }

        private static async Task SeedStudentsAndUserPreferences(StudentsRegisterContext context, int noStudents)
        {
            var students = new List<Student>();
            var faker = new Faker("en");

            var existingNicknames = new List<string>();
            var existingUniqueIdentificationCodes = new List<string>();

            for (int i = 0; i < noStudents; i++)
            {
                var userPreference = new UserPreference
                {
                    // TO BE ADDED
                };

                context.UserPreferences.Add(userPreference);
                await context.SaveChangesAsync();

                var student = new Student
                {
                    // user data
                    Name = faker.Name.FullName(),
                    Email = faker.Internet.Email(),
                    Password = PASSWORD,
                    UserType = UserType.Student,

                    // student data
                    Nickname = GenerateUniqueNickname(existingNicknames, faker),
                    UniqueIdentificationCode = GenerateUniqueAlphaNumeric(existingUniqueIdentificationCodes, faker),
                    UserPreferencesId = userPreference.Id,

                }; // end student creation

                existingNicknames.Add(student.Nickname);
                existingUniqueIdentificationCodes.Add(student.UniqueIdentificationCode);
            } // end for

            await context.Students.AddRangeAsync(students);
            await context.SaveChangesAsync();
        }

        private static async Task SeedCourses(StudentsRegisterContext context, int noCourses)
        {
            var courses = new List<Course>();
            var faker = new Faker("en");


            var existingEnrollmentKeys = new List<string>();

            for (int i = 0; i < noCourses; i++)
            {
                var course = new Course
                {
                    Name = faker.Commerce.ProductName(),
                    EnrollmentKey = GenerateUniqueAlphaNumeric(existingEnrollmentKeys, faker),
                };

                existingEnrollmentKeys.Add(course.EnrollmentKey);
            }

            await context.Courses.AddRangeAsync(courses);
            await context.SaveChangesAsync();
        }

        private static async Task SeedCourseTeachers(StudentsRegisterContext context)
        {
            var courseTeachers = new List<CourseTeacher>();

            var teacherIds = await context.Teachers.Select(t => t.Id).ToListAsync();
            var courseIds = await context.Courses.Select(c => c.Id).ToListAsync();

            Random random = new Random();
            teacherIds = teacherIds.OrderBy(t => random.Next()).ToList();
            courseIds = courseIds.OrderBy(c => random.Next()).ToList();

            HashSet<Tuple<long, long>> existingIds = new HashSet<Tuple<long, long>>();

            for (int i = 0; i < teacherIds.Count * courseIds.Count; i++)
            {
                var newIdTuple = GenerateUniqueIdTuples(existingIds, teacherIds, courseIds);
                var courseTeacher = new CourseTeacher
                {
                    TeacherId = newIdTuple.Item1,
                    CourseId = newIdTuple.Item2,
                };

                courseTeachers.Add(courseTeacher);
                existingIds.Add(newIdTuple);
            }

            await context.CourseTeachers.AddRangeAsync(courseTeachers);
            await context.SaveChangesAsync();
        }

        private static async Task SeedEnrollments(StudentsRegisterContext context)
        {
            var enrollments = new List<Enrollment>();

            var studentIds = await context.Students.Select(t => t.Id).ToListAsync();
            var courseIds = await context.Courses.Select(c => c.Id).ToListAsync();

            Random random = new Random();
            studentIds = studentIds.OrderBy(t => random.Next()).ToList();
            courseIds = courseIds.OrderBy(c => random.Next()).ToList();

            HashSet<Tuple<long, long>> existingIds = new HashSet<Tuple<long, long>>();

            for (int i = 0; i < studentIds.Count * courseIds.Count; i++)
            {
                var newIdTuple = GenerateUniqueIdTuples(existingIds, studentIds, courseIds);
                var enrollment = new Enrollment
                {
                    StudentId = newIdTuple.Item1,
                    CourseId = newIdTuple.Item2,
                };

                enrollments.Add(enrollment);
                existingIds.Add(newIdTuple);
            }

            await context.Enrollments.AddRangeAsync(enrollments);
            await context.SaveChangesAsync();
        }

        private static async Task SeedAssignments(StudentsRegisterContext context, int noAssignments)
        {

        }

        private static async Task ClearAllTables(StudentsRegisterContext context)
        {
            context.CourseTeachers.RemoveRange(context.CourseTeachers);
            context.Grades.RemoveRange(context.Grades);
            context.Assignments.RemoveRange(context.Assignments);
            context.Enrollments.RemoveRange(context.Enrollments);
            context.Teachers.RemoveRange(context.Teachers);
            context.UserPreferences.RemoveRange(context.UserPreferences);
            context.Students.RemoveRange(context.Students);
            context.Courses.RemoveRange(context.Courses);
            
            await context.SaveChangesAsync();
        }

        private static string GenerateUniqueNickname(List<string> uniqueNicknames, Faker faker)
        {
            string nickname = faker.Internet.UserName();

            while (uniqueNicknames.Contains(nickname))
                nickname = faker.Internet.UserName();

            return nickname;
        }

        private static string GenerateUniqueAlphaNumeric(List<string> list, Faker faker)
        {
            string uniqueField = faker.Random.AlphaNumeric(8);

            while (list.Contains(uniqueField))
                uniqueField = faker.Random.AlphaNumeric(8);

            return uniqueField;
        }

        private static Tuple<long, long> GenerateUniqueIdTuples(HashSet<Tuple<long, long>> ids, List<long> type1Ids, List<long> type2Ids)
        {
            Random random = new Random();

            int type1Index = (int)type1Ids[random.Next(type1Ids.Count)];
            int type2Index = (int)type2Ids[random.Next(type2Ids.Count)];
            Tuple<long, long> newIdTuple = Tuple.Create(type1Ids[type1Index], type2Ids[type2Index]);

            while (ids.Contains(newIdTuple))
            {
                type1Index = (int)type1Ids[random.Next(type1Ids.Count)];
                type2Index = (int)type2Ids[random.Next(type2Ids.Count)];

                newIdTuple = Tuple.Create(type1Ids[type1Index], type2Ids[type2Index]);
            }

            return newIdTuple;
        }
    }
}
