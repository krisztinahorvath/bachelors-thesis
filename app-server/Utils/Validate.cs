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
            if (IsStringEmpty(user.Name))
                return "The name field must not be null.";

            // email
            if (!IsEmailValid(user.Email))
                return "Invalid email provided.";

            if (!IsEmailUnique(_context, user.Email))
                return "Email must be unique, another user is already using this email.";

            // password
            if (user.Password == "" || user.Password == null || !IsPasswordValid(user.Password))
                return "The password must have at " +
                    "least 8 characters and must contain at least one upper letter and a digit.";

            // if user is student
            // nickname
            if (user.UserType == UserType.Student && !IsNicknameUnique(_context, user.Nickname!))
                return "Nickname must be unique, another user is already using this nickname.";


            return ""; // empty string for no errors
        }

        public string ValidateCourseFields(CourseDTO course)
        {
            // name
            if (IsStringEmpty(course.Name))
                return "The name field must not be empty.";

            if (course.Image == null)
                return "The image is a required field.";

            return ""; // empty string for no errors
        }

        public string ValidateAssignmentFields(AssignmentDTO assignment)
        {
            if (IsStringEmpty(assignment.Name))
                return "Assignment name must not be empty.";

            if (IsStringEmpty(assignment.Description))
                return "Assignment description must not be empty.";

            if (!(assignment.Weight >= 0 && assignment.Weight <= 100))
                return "Assignment weight must be a number between 0 and 100.";

            return ""; // empty string for no errors
        }

        public string ValidateGradeFields(GradeDTO grade)
        {
            if (grade.Score < 0)
                return "Grade must be a positive number";

            return ""; // empty string for no errors
        }


        public bool IsEmailUnique(in StudentsRegisterContext _context, string email)
        {
            return !_context.Users.Any(a => a.Email == email);
        }

        public bool IsNicknameUnique(in StudentsRegisterContext _context, string nickname)
        {
            return !_context.Students.Any(a => a.Nickname == nickname);
        }

        public bool IsEmailValid(string email)
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

        public bool IsStringEmpty (string myString){
            if (myString == "" || myString == null)
                return true;

            return false;
        }

    }
}
