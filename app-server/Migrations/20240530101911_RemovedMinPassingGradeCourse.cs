using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace app_server.Migrations
{
    /// <inheritdoc />
    public partial class RemovedMinPassingGradeCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinimumPassingGrade",
                table: "Courses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "MinimumPassingGrade",
                table: "Courses",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
