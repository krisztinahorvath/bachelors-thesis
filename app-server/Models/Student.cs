namespace app_server.Models
{
    public class Student : User
    {
        public string Nickname { get; set; }
        public virtual UserPreferences? UserPreferences {get; set;}
    }
}
