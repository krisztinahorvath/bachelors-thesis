﻿namespace app_server.Models
{
    public class UserPreference
    {
        public long Id { get; set; }

        public long StudentId { get; set; }
        public virtual Student Student { get; set; } = null!;

        public bool ShowPoints { get; set; }
        public bool ShowLevels { get; set; }
        public bool ShowBadges { get; set; }
        public bool ShowProgressBars { get; set; }
        public bool ShowLeaderboards { get; set; }
    }
}
