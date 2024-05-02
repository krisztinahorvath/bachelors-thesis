namespace app_server.Models
{
    public class Assignment
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Weight { get; set; }
        public DateTime DueDate { get; set; }

        public long CourseId { get; set; } // FK
        public virtual Course Course { get; set; } = null!;

        // 1:n with grade
        public virtual ICollection<Grade> Grades { get; set; }
    }
}
