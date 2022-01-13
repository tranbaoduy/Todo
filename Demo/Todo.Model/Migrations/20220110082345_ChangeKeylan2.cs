using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo.Model.Migrations
{
    public partial class ChangeKeylan2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NameTodo",
                table: "Job",
                newName: "IdTodo");

            migrationBuilder.AddColumn<string>(
                name: "GuiId",
                table: "InformationList",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GuiId",
                table: "InformationList");

            migrationBuilder.RenameColumn(
                name: "IdTodo",
                table: "Job",
                newName: "NameTodo");
        }
    }
}
