using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace app_server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserPrefNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShowProgressBar",
                table: "UserPreferences",
                newName: "ShowProgressBars");

            migrationBuilder.RenameColumn(
                name: "ShowLeaderboard",
                table: "UserPreferences",
                newName: "ShowLeaderboards");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShowProgressBars",
                table: "UserPreferences",
                newName: "ShowProgressBar");

            migrationBuilder.RenameColumn(
                name: "ShowLeaderboards",
                table: "UserPreferences",
                newName: "ShowLeaderboard");
        }
    }
}
