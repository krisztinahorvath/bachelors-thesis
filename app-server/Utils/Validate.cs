using app_server.Models;

namespace app_server.Utils
{
    public class Validate
    {
        public Validate() { }

        public bool IsEmailUnique(in StudentsRegisterContext _context, string email)
        {
            return !_context.Users.Any(a => a.Email == email);
        }

        public bool IsNicknameUnique(in StudentsRegisterContext _context, string nickname)
        {
            return !_context.Students.Any(a => a.Nickname == nickname);
        }

        public bool IsValidEmail(string email)
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

        public bool IsPasswordValid(string password)
        {
            return password.Length >= 8 && password.Any(char.IsUpper) && password.Any(char.IsDigit);
        }

    }
}
