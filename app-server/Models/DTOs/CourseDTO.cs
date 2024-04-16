namespace app_server.Models.DTOs
{
    public class CourseDTO
    {
        public long? Id { get; set; }
        public string Name { get; set; }
        public string? EnrollmentKey { get; set; }
        public byte[]? Image { get; set; }
    }
}
