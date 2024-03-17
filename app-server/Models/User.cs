namespace app_server.Models
{
    public enum UserType
    {
        Teacher,
        Student
    }

    public class User
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public virtual UserType UserType { get; set; }
    }
}
