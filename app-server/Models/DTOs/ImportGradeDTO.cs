namespace app_server.Models.DTOs
{
    public class ImportGradeDTO
    {
        public string UniqueIdCode { get; set; }
        //public long CourseId { get; set; }
        public List<AssignmentGradeDTO> Assignments { get; set; }
    }

    public class AssignmentGradeDTO
    {
        public long AssignmentId { get; set; }
        public float? Score { get; set; }
        public DateTime? DateReceived { get; set; }
    }

}
