namespace app_server.Models
{
    public class UserPreferences
    {
        public long Id { get; set; }

        public long StudentId { get; set; }
        public Student Student { get; set; } = null!;
    }
}
