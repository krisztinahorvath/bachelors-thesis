using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace app_server.Models
{
    public class StudentsRegisterContext: DbContext
    {
        public StudentsRegisterContext() { }

        public StudentsRegisterContext(DbContextOptions<StudentsRegisterContext> options) : base(options)
        {

        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<Teacher> Teachers { get; set; }
        public virtual DbSet<Enrollment> Enrollments { get; set; }
        public virtual DbSet<CourseTeacher> CourseTeachers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Teacher>().ToTable("Teachers");
            modelBuilder.Entity<Student>().ToTable("Students");

            modelBuilder.Entity<Student>()
            .HasOne(e => e.UserPreferences)
            .WithOne(e => e.Student)
            .HasForeignKey<UserPreferences>(e => e.StudentId)
            .IsRequired();

            modelBuilder.Entity<Enrollment>()
                .HasKey(t => new { t.StudentId, t.CourseId });

            modelBuilder.Entity<CourseTeacher>()
                .HasKey(t => new { t.TeacherId, t.CourseId });
        }
    }
}
