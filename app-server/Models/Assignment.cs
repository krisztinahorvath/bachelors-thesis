using Microsoft.VisualBasic;

namespace app_server.Models
{
    public class Assignment
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }

        // 1:n with grade
        public virtual ICollection<Grade> Grades { get; set; }
    }
}
