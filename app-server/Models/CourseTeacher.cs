namespace app_server.Models
{
    public class CourseTeacher
    {
        public long TeacherId { get; set; }
        public virtual Teacher Teacher { get; set; }
        
        public long CourseId { get; set; }
        public virtual Course Course { get; set; }
    }
}
