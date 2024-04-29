namespace app_server.Models.DTOs
{
    public class AssignmentDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }

        public long CourseId { get; set; }
    }
}
