namespace app_server.Models
{
    public class UserPreference
    {
        public long Id { get; set; }
        public virtual Student? Student { get; set; }
    }
}
