namespace app_server.Models.DTOs
{
    public class LeaderboardDTO
    {
        public byte[]? Image { get; set; }
        public string Nickname { get; set; }
        public float FinalGrade { get; set; }
        public int ExperiencePoints { get; set; }
        public int? Rank { get; set; }
    }
}
