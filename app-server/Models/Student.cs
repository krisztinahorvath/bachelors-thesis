﻿namespace app_server.Models
{
    public class Student : User
    {
        // unique 
        public string Nickname { get; set; }
        public string UniqueIdentificationCode { get; set; }

        public virtual UserPreference UserPreferences {get; set; } = null!;

        // 1:n with grades
        public virtual ICollection<Grade> Grades { get; set; }

        public override UserPreference CreateUserPreference()
        {
            return new UserPreference
            {
                StudentId = this.Id,
                ShowPoints = true,
                ShowLevels = true,
                ShowBadges = true,
                ShowProgressBars = true,
                ShowLeaderboards = true,
            };
        }
    }
}
