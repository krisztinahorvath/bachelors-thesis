namespace app_server.Models.DTOs
{
    public class RegisterDTO
    {
        public long StudentId { get; set; }
        public string StudentName { get; set; }

        public long GradeId { get; set; }
        public string Score { get; set; }

        public long AssignmentId { get; set; }
        public string AssignmentName { get; set; }
    }
}
