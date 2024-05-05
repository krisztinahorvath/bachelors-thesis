namespace app_server.Models.DTOs
{
    public class LeaderboardDTO
    {
        // TODO: add profile pic too
        public string Nickname { get; set; }
        public float FinalGrade { get; set; }
        public int ExperiencePoints { get; set; }
    }
}
