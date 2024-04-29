namespace app_server.Models.DTOs
{
    public class GradeDTO
    {
        public long StudentId { get; set; }
        public long AssignmentId { get; set; }
        public float Score { get; set; }
        public DateTime DateReceived { get; set; }
    }
}
