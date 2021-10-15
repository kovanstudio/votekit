using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoteKit.Migrations.PostgreSQL.Migrations
{
    public partial class Project_SsoKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "sso_key",
                table: "projects",
                type: "uuid",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "sso_key",
                table: "projects");
        }
    }
}
