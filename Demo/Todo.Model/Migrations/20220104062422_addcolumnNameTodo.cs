using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo.Model.Migrations
{
    public partial class addcolumnNameTodo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateFinish",
                table: "Job",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "NameTodo",
                table: "InformationList",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateFinish",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "NameTodo",
                table: "InformationList");
        }
    }
}
