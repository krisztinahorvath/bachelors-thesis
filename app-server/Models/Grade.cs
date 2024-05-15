namespace app_server.Models
{
    public class Grade
    {
        public long StudentId { get; set; } // FK
        public virtual Student Student { get; set; }

        public long AssignmentId { get; set; } // FK
        public virtual Assignment Assignment { get; set; }
       
        public float Score { get; set; }
        public DateTime DateReceived { get; set; }
    }
}
