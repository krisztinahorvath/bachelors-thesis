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

        // a random number is chose between 0 and 5 to add that number of assignments to each course
        private const int NO_ASSIGNMENTS = 10; 

        private const int NO_GRADES = 100; 

        private static readonly string PASSWORD = UserController.HashPassword("test");

        private static readonly List<string> COURSE_NAMES = new List<string>
        {
            "Fundamentals of Programming",
            "Algorithms and Data Structures",
            "Computer Networks",
            "Operating Systems",
            "Database Management Systems",
            "Software Engineering",
            "Artificial Intelligence",
            "Machine Learning",
            "Computer Graphics",
            "Cybersecurity",
            "Web Development",
            "Mobile Applications",
            "Computer Vision",
            "Natural Language Processing",
            "Parallel and Distributed Programming",
            "Cloud Computing",
            "Human-Computer Interaction",
            "Game Development",
            "Data Mining and Analysis",
            "Internet of Things (IoT)"
        };

        public static async Task Start(IServiceProvider serviceProvider) 
        {
            using (var context = new StudentsRegisterContext(serviceProvider.GetRequiredService<DbContextOptions<StudentsRegisterContext>>()))
            {
                //await ClearAllTables(context);

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

                if (!await context.Assignments.AnyAsync())
                    await SeedAssignments(context, NO_ASSIGNMENTS);

                if (!await context.Grades.AnyAsync())
                    await SeedGrades(context, NO_GRADES);
            }
        }

        private static async Task SeedTeachers(StudentsRegisterContext context, int noTeachers)
        {
            var teachers = new List<Teacher>();
            var faker = new Faker("en");

            for (int i = 0; i < noTeachers; i++)
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

            //var generateTeachers = new Faker<Teacher>()
            //    .RuleFor(t => t.Name, f => f.Name.FullName())
            //    .RuleFor(t => t.Email, f => f.Internet.Email())
            //    .RuleFor(t => t.Password, PASSWORD)
            //    .RuleFor(t => t.UserType, UserType.Teacher);

            //var teachers = generateTeachers.Generate(noTeachers);

            await context.Teachers.AddRangeAsync(teachers);
            await context.SaveChangesAsync();
        }

        private static async Task SeedStudentsAndUserPreferences(StudentsRegisterContext context, int noStudents)
        {
            var faker = new Faker("en");
            Random random = new Random();

            var existingNicknames = new List<string>();
            var existingUniqueIdentificationCodes = new List<string>();

            for (int i = 0; i < noStudents; i++)
            {
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

                }; // end student creation
                existingNicknames.Add(student.Nickname);
                existingUniqueIdentificationCodes.Add(student.UniqueIdentificationCode);

                context.Students.Add(student);
                await context.SaveChangesAsync();

                var userPreference = new UserPreference
                {
                    StudentId = student.Id,

                    ShowPoints = (random.Next(0, 2) == 0),
                    ShowLevels = (random.Next(0, 2) == 0),
                    ShowBadges = (random.Next(0, 2) == 0),
                    ShowProgressBars = (random.Next(0, 2) == 0),
                    ShowLeaderboards = (random.Next(0, 2) == 0),
                };

                context.UserPreferences.Add(userPreference);
                await context.SaveChangesAsync();                
            } // end for
        }

        private static async Task SeedCourses(StudentsRegisterContext context, int noCourses)
        {
            var courses = new List<Course>();
            var faker = new Faker("en");
            Random random = new Random();

            var existingEnrollmentKeys = new List<string>();

            for (int i = 0; i < noCourses; i++)
            {
                var course = new Course
                {
                    Name = COURSE_NAMES[random.Next(COURSE_NAMES.Count)],
                    EnrollmentKey = GenerateUniqueAlphaNumeric(existingEnrollmentKeys, faker),
                    MinimumPassingGrade = 5
                };

                existingEnrollmentKeys.Add(course.EnrollmentKey);
                courses.Add(course);
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
            var assignments = new List<Assignment>();
            var courseIds = await context.Courses.Select(c => c.Id).ToListAsync();
            
            var faker = new Faker("en");
            Random random = new Random();
            courseIds = courseIds.OrderBy(c => random.Next()).ToList();

            for (int i = 0; i < courseIds.Count; i++)
            {
                int randomNoAssignemnts = random.Next(0, noAssignments);
                int totalWeights = 0;

                for (int j = 0; j < randomNoAssignemnts; j++)
                {
                    var description = new Bogus.DataSets.Lorem(locale: "en");

                    int assignmentWeight = random.Next(1, 101 - totalWeights);
                    totalWeights += assignmentWeight;

                    var assignment = new Assignment
                    {
                        Name = "A" + j,
                        Description = description.Sentence(5),
                        DueDate = faker.Date.Between(DateTime.Now.AddMonths(-3), DateTime.Now),
                        CourseId = courseIds[i], // random.Next(courseIds.Count)]
                        Weight = assignmentWeight,
                    };

                    assignments.Add(assignment);

                    if (totalWeights == 100)
                        break;
                }
            }

            await context.Assignments.AddRangeAsync(assignments);
            await context.SaveChangesAsync();
        }

        private static async Task SeedGrades(StudentsRegisterContext context, int noGrades)
        {
            var grades = new List<Grade>();

            var studentIds = await context.Students.Select(t => t.Id).ToListAsync();
            var assignmentIds = await context.Assignments.Select(c => c.Id).ToListAsync();

            var faker = new Faker("en");
            Random random = new Random();
            studentIds = studentIds.OrderBy(t => random.Next()).ToList();
            assignmentIds = assignmentIds.OrderBy(c => random.Next()).ToList();

            HashSet<Tuple<long, long>> existingIds = new HashSet<Tuple<long, long>>();

            for (int i = 0; i < noGrades; i++)
            {
                var newIdTuple = GenerateUniqueIdTuples(existingIds, studentIds, assignmentIds);
                var assignmentDueDate = context.Assignments
                             .Where(a => a.Id == newIdTuple.Item2) 
                             .Select(a => a.DueDate) 
                             .SingleOrDefault();

                var grade = new Grade
                {
                    StudentId = newIdTuple.Item1,
                    AssignmentId = newIdTuple.Item2,
                    Score = (float)Math.Round((random.NextDouble() * 9) + 1, 2),
                    DateReceived = faker.Date.Between(DateTime.Now.AddMonths(-3), assignmentDueDate),
                };

                grades.Add(grade);
                existingIds.Add(newIdTuple);
            }

            await context.Grades.AddRangeAsync(grades);
            await context.SaveChangesAsync();
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

            int type1Index = random.Next(type1Ids.Count);
            int type2Index = random.Next(type2Ids.Count);
            Tuple<long, long> newIdTuple = Tuple.Create(type1Ids[type1Index], type2Ids[type2Index]);

            while (ids.Contains(newIdTuple))
            {
                type1Index = random.Next(type1Ids.Count);
                type2Index = random.Next(type2Ids.Count);

                newIdTuple = Tuple.Create(type1Ids[type1Index], type2Ids[type2Index]);
            }

            return newIdTuple;
        }
    }
}
