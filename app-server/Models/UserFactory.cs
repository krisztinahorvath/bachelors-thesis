using app_server.Models.DTOs;

namespace app_server.Models
{
    public class UserFactory // TODO: change to have a separate factory for Student and another for Teacher 
    { 
        public static User CreateUser(UserRegisterDTO user)
        {
            return user.UserType switch
            {
                UserType.Teacher => new Teacher {Name = user.Name, Email = user.Email, Password = user.Password, UserType = user.UserType},
                UserType.Student => new Student {Name = user.Name, Email = user.Email, Password = user.Password, UserType = user.UserType, Nickname = user.Nickname!},
                _ => throw new ArgumentException("Invalid user type!"),
            };
        }
    }
}
