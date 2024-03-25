namespace app_server.Models.DTOs
{
    public class UserRegisterDTO
    {
        // common to all user types
        public long Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public virtual UserType UserType { get; set; }

        // student fields
        public string? Nickname { get; set; }

        // teacher fields - do not exist now
    }
}
