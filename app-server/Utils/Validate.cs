using app_server.Models;
using app_server.Models.DTOs;

namespace app_server.Utils
{
    public class Validate
    {
        public Validate() { }

        public string ValidateUserFields(UserRegisterDTO user, in StudentsRegisterContext _context) 
        {
            if (user == null)
                return "Invalid user data";

            // name
            if (user.Name == "" || user.Name == null)
                return "The name field must not be null.";

            // email
            if (!IsEmailValid(user.Email))
                return "Invalid email provided.";

            if (!IsEmailUnique(_context, user.Email))
                return "The email must be unique.";

            // password
            if (user.Password == "" || user.Password == null || !IsPasswordValid(user.Password))
                return "The password must have at " +
                    "least 8 characters and must contain at least one upper letter and a digit.";

            // if user is student
            // nickname
            if (user.UserType == UserType.Student && !IsNicknameUnique(_context, user.Nickname!))
                return "Nickname must be unique.";


            return ""; // empty string for no errors
        }

        public bool ValidateCourseFields()
        {
            return true;
        }

        public bool ValidateAssignmentFields()
        {
            return true;
        }

        public bool ValidateGradeFields()
        {
            return true;
        }

        public bool ValidateEnrollment()
        {
            return true;
        }

        public bool IsEmailUnique(in StudentsRegisterContext _context, string email)
        {
            return !_context.Users.Any(a => a.Email == email);
        }

        private bool IsNicknameUnique(in StudentsRegisterContext _context, string nickname)
        {
            return !_context.Students.Any(a => a.Nickname == nickname);
        }

        private bool IsEmailValid(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsPasswordValid(string password)
        {
            return password.Length >= 8 && password.Any(char.IsUpper) && password.Any(char.IsDigit);
        }

    }
}
