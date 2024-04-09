using app_server.Models.DTOs;

namespace app_server.Models
{
    public abstract class UserFactory
    {
        public abstract User CreateUser(UserRegisterDTO user);
    }

    public class StudentFactory : UserFactory
    {
        public override User CreateUser(UserRegisterDTO user)
        {
            return new Student { Name = user.Name, Email = user.Email, Password = user.Password, UserType = user.UserType, Nickname = user.Nickname!, UniqueIdentificationCode = user.UniqueIdentificationCode!};
        }
    }

    public class TeacherFactory : UserFactory
    {
        public override User CreateUser(UserRegisterDTO user)
        {
            return new Teacher { Name = user.Name, Email = user.Email, Password = user.Password, UserType = user.UserType };
        }
    }
}


