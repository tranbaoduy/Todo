using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Todo.Model.Migrations
{
    public partial class ChangeKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_InformationList",
                table: "InformationList");

            migrationBuilder.AlterColumn<string>(
                name: "NameTodo",
                table: "InformationList",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "InformationList",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_InformationList",
                table: "InformationList",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_InformationList",
                table: "InformationList");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "InformationList");

            migrationBuilder.AlterColumn<string>(
                name: "NameTodo",
                table: "InformationList",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_InformationList",
                table: "InformationList",
                column: "NameTodo");
        }
    }
}
