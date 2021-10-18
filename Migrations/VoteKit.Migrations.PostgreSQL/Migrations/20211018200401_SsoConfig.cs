using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoteKit.Migrations.PostgreSQL.Migrations
{
    public partial class SsoConfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "sso_key",
                table: "projects");

            migrationBuilder.CreateTable(
                name: "sso_configs",
                columns: table => new
                {
                    project_id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<Guid>(type: "uuid", nullable: false),
                    login_url = table.Column<string>(type: "text", nullable: true),
                    logout_url = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sso_configs", x => x.project_id);
                    table.ForeignKey(
                        name: "FK_sso_configs_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id");
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "sso_configs");

            migrationBuilder.AddColumn<Guid>(
                name: "sso_key",
                table: "projects",
                type: "uuid",
                nullable: true);
        }
    }
}
