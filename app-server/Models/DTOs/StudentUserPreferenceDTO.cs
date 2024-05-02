namespace app_server.Models.DTOs
{
    public class StudentUserPreferenceDTO
    {
        public bool ShowPoints { get; set; }
        public bool ShowLevels { get; set; }
        public bool ShowBadges { get; set; }
        public bool ShowProgressBars { get; set; }
        public bool ShowLeaderboards { get; set; }
    }
}
