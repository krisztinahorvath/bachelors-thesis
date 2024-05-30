namespace app_server.Models.DTOs
{
    public class StudentAchievementDTO
    {
        public long StudentId { get; set; }
        public float FinalGrade { get; set; }
        public int ExperiencePoints { get; set; }
        public bool OnTimeBadgeUnlocked { get; set; }
        public int Level { get; set; }
    }
}
