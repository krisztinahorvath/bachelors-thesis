using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace app_server.Migrations
{
    /// <inheritdoc />
    public partial class RemovedIdFromGradeMovedFKToStudentForUserPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPreferences_Students_StudentId",
                table: "UserPreferences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Grades",
                table: "Grades");

            migrationBuilder.DropIndex(
                name: "IX_Grades_AssignmentId",
                table: "Grades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPreferences",
                table: "UserPreferences");

            migrationBuilder.DropIndex(
                name: "IX_UserPreferences_StudentId",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "UserPreferences");

            migrationBuilder.RenameTable(
                name: "UserPreferences",
                newName: "GetUserPreferences");

            migrationBuilder.AddColumn<long>(
                name: "UserPreferencesId",
                table: "Students",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Grades",
                table: "Grades",
                columns: new[] { "AssignmentId", "StudentId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_GetUserPreferences",
                table: "GetUserPreferences",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserPreferencesId",
                table: "Students",
                column: "UserPreferencesId",
                unique: true,
                filter: "[UserPreferencesId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_GetUserPreferences_UserPreferencesId",
                table: "Students",
                column: "UserPreferencesId",
                principalTable: "GetUserPreferences",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_GetUserPreferences_UserPreferencesId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_UserPreferencesId",
                table: "Students");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Grades",
                table: "Grades");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GetUserPreferences",
                table: "GetUserPreferences");

            migrationBuilder.DropColumn(
                name: "UserPreferencesId",
                table: "Students");

            migrationBuilder.RenameTable(
                name: "GetUserPreferences",
                newName: "UserPreferences");

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "Grades",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "StudentId",
                table: "UserPreferences",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Grades",
                table: "Grades",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPreferences",
                table: "UserPreferences",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Grades_AssignmentId",
                table: "Grades",
                column: "AssignmentId");

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
    }
}
