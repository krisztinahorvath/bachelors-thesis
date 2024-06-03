namespace app_server.Models.DTOs
{
    public class StudentFinalGradeDTO
    {
        public float FinalGrade { get; set; }
        public int ExperiencePoints { get; set; }
        public int Level { get; set; }
        public int ExperiecenPointsUntilNextLevel { get; set; }
        public float GradeUntilNextLevel { get; set; }
    }
}
