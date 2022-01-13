using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo.Model.Migrations
{
    public partial class dropColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "InformationList");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "InformationList",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
