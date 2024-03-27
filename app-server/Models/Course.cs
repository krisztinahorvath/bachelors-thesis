namespace app_server.Models
{
    public class Course
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string EnrollmentKey { get; set; }

        // 1:n with Assignment
        public virtual ICollection<Assignment> Assignments { get; set; }
    }
}
