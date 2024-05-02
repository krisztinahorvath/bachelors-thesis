using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace app_server.Migrations
{
    /// <inheritdoc />
    public partial class AddedAllUserPreferenceGameElements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowBadges",
                table: "UserPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowLevels",
                table: "UserPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowPoints",
                table: "UserPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowProgressBar",
                table: "UserPreferences",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowBadges",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "ShowLevels",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "ShowPoints",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "ShowProgressBar",
                table: "UserPreferences");
        }
    }
}
