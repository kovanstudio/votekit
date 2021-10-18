using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoteKit.Migrations.SQLite.Migrations
{
    public partial class Activity_Metadata : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "metadata",
                table: "activities",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "metadata",
                table: "activities");
        }
    }
}
