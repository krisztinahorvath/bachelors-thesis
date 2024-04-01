using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace app_server.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentUniqueIdCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UniqueIdentificationCode",
                table: "Students",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Students_UniqueIdentificationCode",
                table: "Students",
                column: "UniqueIdentificationCode",
                unique: true,
                filter: "[UniqueIdentificationCode] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Students_UniqueIdentificationCode",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "UniqueIdentificationCode",
                table: "Students");
        }
    }
}
