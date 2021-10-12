using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoteKit.Migrations.SQLite.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "data_protection_keys",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    owner = table.Column<string>(type: "TEXT", nullable: false),
                    friendly_name = table.Column<string>(type: "TEXT", nullable: true),
                    xml = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_data_protection_keys", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "entries",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    board_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    status_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    title = table.Column<string>(type: "varchar(2048)", maxLength: 2048, nullable: false),
                    content = table.Column<string>(type: "TEXT", maxLength: 262144, nullable: true),
                    is_private = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_archived = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_locked = table.Column<bool>(type: "INTEGER", nullable: false),
                    user_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    assigned_user_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    slug = table.Column<string>(type: "varchar(250)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "entry_slugs",
                columns: table => new
                {
                    board_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    slug = table.Column<string>(type: "varchar(250)", nullable: false),
                    entry_id = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entry_slugs", x => new { x.slug, x.board_id });
                    table.ForeignKey(
                        name: "FK_entry_slugs_entries_entry_id",
                        column: x => x.entry_id,
                        principalTable: "entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "comment_likes",
                columns: table => new
                {
                    comment_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    user_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comment_likes", x => new { x.comment_id, x.user_id });
                });

            migrationBuilder.CreateTable(
                name: "activities",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    type = table.Column<string>(type: "TEXT", nullable: false),
                    entry_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    user_id = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activities", x => x.id);
                    table.ForeignKey(
                        name: "FK_activities_entries_entry_id",
                        column: x => x.entry_id,
                        principalTable: "entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "comments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    entry_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    content = table.Column<string>(type: "TEXT", maxLength: 3000, nullable: false),
                    is_private = table.Column<bool>(type: "INTEGER", nullable: false),
                    user_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    reply_to_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    reply_to_root_id = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comments", x => x.id);
                    table.ForeignKey(
                        name: "FK_comments_comments_reply_to_id",
                        column: x => x.reply_to_id,
                        principalTable: "comments",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_comments_comments_reply_to_root_id",
                        column: x => x.reply_to_root_id,
                        principalTable: "comments",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_comments_entries_entry_id",
                        column: x => x.entry_id,
                        principalTable: "entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "entry_fields",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    entry_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    field_option_id = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entry_fields", x => x.id);
                    table.ForeignKey(
                        name: "FK_entry_fields_entries_entry_id",
                        column: x => x.entry_id,
                        principalTable: "entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "entry_subscriptions",
                columns: table => new
                {
                    entry_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    user_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entry_subscriptions", x => new { x.entry_id, x.user_id });
                    table.ForeignKey(
                        name: "FK_entry_subscriptions_entries_entry_id",
                        column: x => x.entry_id,
                        principalTable: "entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "entry_votes",
                columns: table => new
                {
                    entry_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    user_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    delta = table.Column<byte>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entry_votes", x => new { x.entry_id, x.user_id });
                    table.ForeignKey(
                        name: "FK_entry_votes_entries_entry_id",
                        column: x => x.entry_id,
                        principalTable: "entries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "field_options",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    field_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    value = table.Column<string>(type: "varchar(100)", nullable: false),
                    color = table.Column<string>(type: "varchar(8)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_field_options", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "projects",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: false),
                    website = table.Column<string>(type: "varchar(250)", nullable: true),
                    logo_image_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    favicon_image_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_projects", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "boards",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    project_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "varchar(250)", maxLength: 250, nullable: false),
                    slug = table.Column<string>(type: "varchar(250)", nullable: false),
                    is_private = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_listed = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_seo_indexed = table.Column<bool>(type: "INTEGER", nullable: false),
                    accent_color = table.Column<string>(type: "varchar(8)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_boards", x => x.id);
                    table.ForeignKey(
                        name: "FK_boards_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fields",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    project_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "varchar(100)", nullable: false),
                    type = table.Column<string>(type: "varchar(50)", nullable: false),
                    is_listed = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_private = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fields", x => x.id);
                    table.ForeignKey(
                        name: "FK_fields_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invites",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    project_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    email = table.Column<string>(type: "varchar(250)", nullable: false),
                    role = table.Column<string>(type: "TEXT", nullable: false, defaultValue: "Admin"),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invites", x => x.id);
                    table.ForeignKey(
                        name: "FK_invites_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "statuses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    project_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "varchar(250)", nullable: false),
                    color = table.Column<string>(type: "varchar(8)", nullable: false),
                    sort_index = table.Column<int>(type: "INTEGER", nullable: false),
                    is_default = table.Column<bool>(type: "INTEGER", nullable: false),
                    is_in_roadmap = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_statuses", x => x.id);
                    table.ForeignKey(
                        name: "FK_statuses_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    role = table.Column<string>(type: "TEXT", nullable: false),
                    email = table.Column<string>(type: "varchar(250)", nullable: false),
                    password_hash = table.Column<string>(type: "char(64)", nullable: true),
                    password_salt = table.Column<string>(type: "char(32)", nullable: false),
                    display_name = table.Column<string>(type: "varchar(120)", nullable: true),
                    project_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    seen_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    is_banned = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                    table.ForeignKey(
                        name: "FK_users_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "images",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    user_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    project_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false),
                    file_size = table.Column<int>(type: "INTEGER", nullable: false),
                    format = table.Column<string>(type: "TEXT", nullable: false),
                    width = table.Column<int>(type: "INTEGER", nullable: false),
                    height = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_images", x => x.id);
                    table.ForeignKey(
                        name: "FK_images_projects_project_id",
                        column: x => x.project_id,
                        principalTable: "projects",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_images_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_activities_entry_id",
                table: "activities",
                column: "entry_id");

            migrationBuilder.CreateIndex(
                name: "IX_activities_user_id",
                table: "activities",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_boards_project_id_slug",
                table: "boards",
                columns: new[] { "project_id", "slug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_comment_likes_user_id",
                table: "comment_likes",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_comments_entry_id",
                table: "comments",
                column: "entry_id");

            migrationBuilder.CreateIndex(
                name: "IX_comments_reply_to_id",
                table: "comments",
                column: "reply_to_id");

            migrationBuilder.CreateIndex(
                name: "IX_comments_reply_to_root_id",
                table: "comments",
                column: "reply_to_root_id");

            migrationBuilder.CreateIndex(
                name: "IX_comments_user_id",
                table: "comments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_entries_assigned_user_id",
                table: "entries",
                column: "assigned_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_entries_board_id",
                table: "entries",
                column: "board_id");

            migrationBuilder.CreateIndex(
                name: "IX_entries_slug_board_id",
                table: "entries",
                columns: new[] { "slug", "board_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_entries_status_id",
                table: "entries",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "IX_entries_user_id",
                table: "entries",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_entry_fields_entry_id",
                table: "entry_fields",
                column: "entry_id");

            migrationBuilder.CreateIndex(
                name: "IX_entry_fields_field_option_id",
                table: "entry_fields",
                column: "field_option_id");

            migrationBuilder.CreateIndex(
                name: "IX_entry_slugs_board_id",
                table: "entry_slugs",
                column: "board_id");

            migrationBuilder.CreateIndex(
                name: "IX_entry_slugs_entry_id",
                table: "entry_slugs",
                column: "entry_id");

            migrationBuilder.CreateIndex(
                name: "IX_entry_subscriptions_entry_id_created_at",
                table: "entry_subscriptions",
                columns: new[] { "entry_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "IX_entry_subscriptions_user_id",
                table: "entry_subscriptions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_entry_votes_entry_id_created_at",
                table: "entry_votes",
                columns: new[] { "entry_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "IX_entry_votes_user_id",
                table: "entry_votes",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_field_options_field_id",
                table: "field_options",
                column: "field_id");

            migrationBuilder.CreateIndex(
                name: "IX_fields_project_id",
                table: "fields",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_images_project_id",
                table: "images",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_images_user_id",
                table: "images",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_invites_project_id_email",
                table: "invites",
                columns: new[] { "project_id", "email" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_projects_favicon_image_id",
                table: "projects",
                column: "favicon_image_id");

            migrationBuilder.CreateIndex(
                name: "IX_projects_logo_image_id",
                table: "projects",
                column: "logo_image_id");

            migrationBuilder.CreateIndex(
                name: "IX_statuses_project_id",
                table: "statuses",
                column: "project_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_project_id_email",
                table: "users",
                columns: new[] { "project_id", "email" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_entries_boards_board_id",
                table: "entries",
                column: "board_id",
                principalTable: "boards",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_entries_statuses_status_id",
                table: "entries",
                column: "status_id",
                principalTable: "statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_entries_users_assigned_user_id",
                table: "entries",
                column: "assigned_user_id",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_entries_users_user_id",
                table: "entries",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_entry_slugs_boards_board_id",
                table: "entry_slugs",
                column: "board_id",
                principalTable: "boards",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_comment_likes_comments_comment_id",
                table: "comment_likes",
                column: "comment_id",
                principalTable: "comments",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_comment_likes_users_user_id",
                table: "comment_likes",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_activities_users_user_id",
                table: "activities",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_comments_users_user_id",
                table: "comments",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_entry_fields_field_options_field_option_id",
                table: "entry_fields",
                column: "field_option_id",
                principalTable: "field_options",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_entry_subscriptions_users_user_id",
                table: "entry_subscriptions",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_entry_votes_users_user_id",
                table: "entry_votes",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_field_options_fields_field_id",
                table: "field_options",
                column: "field_id",
                principalTable: "fields",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_projects_images_favicon_image_id",
                table: "projects",
                column: "favicon_image_id",
                principalTable: "images",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_projects_images_logo_image_id",
                table: "projects",
                column: "logo_image_id",
                principalTable: "images",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_images_users_user_id",
                table: "images");

            migrationBuilder.DropForeignKey(
                name: "FK_images_projects_project_id",
                table: "images");

            migrationBuilder.DropTable(
                name: "activities");

            migrationBuilder.DropTable(
                name: "comment_likes");

            migrationBuilder.DropTable(
                name: "data_protection_keys");

            migrationBuilder.DropTable(
                name: "entry_fields");

            migrationBuilder.DropTable(
                name: "entry_slugs");

            migrationBuilder.DropTable(
                name: "entry_subscriptions");

            migrationBuilder.DropTable(
                name: "entry_votes");

            migrationBuilder.DropTable(
                name: "invites");

            migrationBuilder.DropTable(
                name: "comments");

            migrationBuilder.DropTable(
                name: "field_options");

            migrationBuilder.DropTable(
                name: "entries");

            migrationBuilder.DropTable(
                name: "fields");

            migrationBuilder.DropTable(
                name: "boards");

            migrationBuilder.DropTable(
                name: "statuses");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "projects");

            migrationBuilder.DropTable(
                name: "images");
        }
    }
}
