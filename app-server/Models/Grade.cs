namespace app_server.Models
{
    public class Grade
    {
        public long Id { get; set; } // grade id
       
        public float Score { get; set; }
        public DateTime DateReceived { get; set; }

        public long StudentId { get; set; } // FK
        public virtual Student Student { get; set; }

        public long AssignmentId { get; set; } // FK
        public virtual Assignment Assignment { get; set; }
    }
}
