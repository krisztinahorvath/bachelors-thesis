using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace app_server.Migrations
{
    /// <inheritdoc />
    public partial class ChangedUserPreferenceModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_UserPreferences_UserPreferencesId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_UserPreferencesId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "UserPreferencesId",
                table: "Students");

            migrationBuilder.AddColumn<long>(
                name: "StudentId",
                table: "UserPreferences",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_StudentId",
                table: "UserPreferences",
                column: "StudentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserPreferences_Students_StudentId",
                table: "UserPreferences",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPreferences_Students_StudentId",
                table: "UserPreferences");

            migrationBuilder.DropIndex(
                name: "IX_UserPreferences_StudentId",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "UserPreferences");

            migrationBuilder.AddColumn<long>(
                name: "UserPreferencesId",
                table: "Students",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserPreferencesId",
                table: "Students",
                column: "UserPreferencesId",
                unique: true,
                filter: "[UserPreferencesId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_UserPreferences_UserPreferencesId",
                table: "Students",
                column: "UserPreferencesId",
                principalTable: "UserPreferences",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
