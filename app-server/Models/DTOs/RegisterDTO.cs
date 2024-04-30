using System.Globalization;

namespace app_server.Models.DTOs
{
    //public class RegisterDTO
    //{
    //    public long StudentId { get; set; }
    //    public string StudentName { get; set; }
    //    public string UniqueIdentificationCode { get; set; }

    //    public long AssignmentId { get; set; }
    //    public string AssignmentName { get; set; }

    //    public string Score { get; set; }
    //    public DateTime? DateReceived { get; set; }
    //}
    public class RegisterDTO
    {
        public long StudentId { get; set; }
        public string StudentName { get; set; }
        public string UniqueIdentificationCode { get; set; }

        //public List<long> AssignmentIds { get; set; }
        //public List<string> AssignmentNames { get; set; }
        public List<float?> Scores { get; set; }
        public List<DateTime?> DatesReceived { get; set; }
    }

}
