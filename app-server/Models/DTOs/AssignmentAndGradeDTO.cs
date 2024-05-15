namespace app_server.Models.DTOs
{
    public class AssignmentAndGradeDTO
    {
        public long AssignmentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int Weight { get; set; }
        public float Score { get; set; }
        public DateTime DateReceived { get; set; }
    }
}
