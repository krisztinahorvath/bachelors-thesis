namespace app_server.Models
{
    public class Teacher : User
    {
        public override UserPreference CreateUserPreference()
        {
            throw new NotImplementedException();
        }
    }
}
