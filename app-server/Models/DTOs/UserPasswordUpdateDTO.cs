namespace app_server.Models.DTOs
{
    public class UserPasswordUpdateDTO
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
