namespace app_server.Models.DTOs
{
    public class UserDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string? Nickname { get; set; }
        public string? UniqueIdentificationCode { get; set; }
        public byte[] Image { get; set; }
    }
}
