using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo.Model.Migrations
{
    public partial class addColumnIsImportan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IsImportan",
                table: "Job",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsImportan",
                table: "Job");
        }
    }
}
