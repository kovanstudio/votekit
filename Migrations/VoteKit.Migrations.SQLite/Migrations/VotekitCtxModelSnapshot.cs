﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using VoteKit.Data;

#nullable disable

namespace VoteKit.Migrations.SQLite.Migrations
{
    [DbContext(typeof(VotekitCtx))]
    partial class VotekitCtxModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.0-rc.1.21452.10");

            modelBuilder.Entity("VoteKit.Data.Models.Activity", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<Guid?>("EntryId")
                        .HasColumnType("TEXT")
                        .HasColumnName("entry_id");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasColumnName("type");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("EntryId");

                    b.HasIndex("UserId");

                    b.ToTable("activities");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Board", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("varchar(8)")
                        .HasColumnName("accent_color");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<bool>("IsListed")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_listed");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_private");

                    b.Property<bool>("IsSeoIndexed")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_seo_indexed");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("varchar(250)")
                        .HasColumnName("name");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("TEXT")
                        .HasColumnName("project_id");

                    b.Property<string>("Slug")
                        .IsRequired()
                        .HasColumnType("varchar(250)")
                        .HasColumnName("slug");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId", "Slug")
                        .IsUnique();

                    b.ToTable("boards");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(3000)
                        .HasColumnType("TEXT")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<Guid>("EntryId")
                        .HasColumnType("TEXT")
                        .HasColumnName("entry_id");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_private");

                    b.Property<Guid?>("ReplyToId")
                        .HasColumnType("TEXT")
                        .HasColumnName("reply_to_id");

                    b.Property<Guid?>("ReplyToRootId")
                        .HasColumnType("TEXT")
                        .HasColumnName("reply_to_root_id");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("EntryId");

                    b.HasIndex("ReplyToId");

                    b.HasIndex("ReplyToRootId");

                    b.HasIndex("UserId");

                    b.ToTable("comments");
                });

            modelBuilder.Entity("VoteKit.Data.Models.CommentLike", b =>
                {
                    b.Property<Guid>("CommentId")
                        .HasColumnType("TEXT")
                        .HasColumnName("comment_id");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("user_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.HasKey("CommentId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("comment_likes");
                });

            modelBuilder.Entity("VoteKit.Data.Models.DataProtectionKey", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<string>("FriendlyName")
                        .HasColumnType("TEXT")
                        .HasColumnName("friendly_name");

                    b.Property<string>("Owner")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasColumnName("owner");

                    b.Property<string>("Xml")
                        .HasColumnType("TEXT")
                        .HasColumnName("xml");

                    b.HasKey("Id");

                    b.ToTable("data_protection_keys");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Entry", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<Guid?>("AssignedUserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("assigned_user_id");

                    b.Property<Guid>("BoardId")
                        .HasColumnType("TEXT")
                        .HasColumnName("board_id");

                    b.Property<string>("Content")
                        .HasMaxLength(262144)
                        .HasColumnType("TEXT")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<bool>("IsArchived")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_archived");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_deleted");

                    b.Property<bool>("IsLocked")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_locked");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_private");

                    b.Property<string>("Slug")
                        .IsRequired()
                        .HasColumnType("varchar(250)")
                        .HasColumnName("slug");

                    b.Property<Guid>("StatusId")
                        .HasColumnType("TEXT")
                        .HasColumnName("status_id");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(2048)
                        .HasColumnType("varchar(2048)")
                        .HasColumnName("title");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("AssignedUserId");

                    b.HasIndex("BoardId");

                    b.HasIndex("StatusId");

                    b.HasIndex("UserId");

                    b.HasIndex("Slug", "BoardId")
                        .IsUnique();

                    b.ToTable("entries");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntryField", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<Guid>("EntryId")
                        .HasColumnType("TEXT")
                        .HasColumnName("entry_id");

                    b.Property<Guid>("FieldOptionId")
                        .HasColumnType("TEXT")
                        .HasColumnName("field_option_id");

                    b.HasKey("Id");

                    b.HasIndex("EntryId");

                    b.HasIndex("FieldOptionId");

                    b.ToTable("entry_fields");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntrySlug", b =>
                {
                    b.Property<string>("Slug")
                        .HasColumnType("varchar(250)")
                        .HasColumnName("slug");

                    b.Property<Guid>("BoardId")
                        .HasColumnType("TEXT")
                        .HasColumnName("board_id");

                    b.Property<Guid>("EntryId")
                        .HasColumnType("TEXT")
                        .HasColumnName("entry_id");

                    b.HasKey("Slug", "BoardId");

                    b.HasIndex("BoardId");

                    b.HasIndex("EntryId");

                    b.ToTable("entry_slugs");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntrySubscription", b =>
                {
                    b.Property<Guid>("EntryId")
                        .HasColumnType("TEXT")
                        .HasColumnName("entry_id");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("user_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.HasKey("EntryId", "UserId");

                    b.HasIndex("UserId");

                    b.HasIndex("EntryId", "CreatedAt");

                    b.ToTable("entry_subscriptions");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntryVote", b =>
                {
                    b.Property<Guid>("EntryId")
                        .HasColumnType("TEXT")
                        .HasColumnName("entry_id");

                    b.Property<Guid>("UserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("user_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<byte>("Delta")
                        .HasColumnType("INTEGER")
                        .HasColumnName("delta");

                    b.HasKey("EntryId", "UserId");

                    b.HasIndex("UserId");

                    b.HasIndex("EntryId", "CreatedAt");

                    b.ToTable("entry_votes");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Field", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<bool>("IsListed")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_listed");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_private");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(100)")
                        .HasColumnName("name");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("TEXT")
                        .HasColumnName("project_id");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("varchar(50)")
                        .HasColumnName("type");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("fields");
                });

            modelBuilder.Entity("VoteKit.Data.Models.FieldOption", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<string>("Color")
                        .HasColumnType("varchar(8)")
                        .HasColumnName("color");

                    b.Property<Guid>("FieldId")
                        .HasColumnType("TEXT")
                        .HasColumnName("field_id");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("varchar(100)")
                        .HasColumnName("value");

                    b.HasKey("Id");

                    b.HasIndex("FieldId");

                    b.ToTable("field_options");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Image", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<int>("FileSize")
                        .HasColumnType("INTEGER")
                        .HasColumnName("file_size");

                    b.Property<string>("Format")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasColumnName("format");

                    b.Property<int>("Height")
                        .HasColumnType("INTEGER")
                        .HasColumnName("height");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("TEXT")
                        .HasColumnName("project_id");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("TEXT")
                        .HasColumnName("user_id");

                    b.Property<int>("Width")
                        .HasColumnType("INTEGER")
                        .HasColumnName("width");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("images");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Invite", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(250)")
                        .HasColumnName("email");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("TEXT")
                        .HasColumnName("project_id");

                    b.Property<string>("Role")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasDefaultValue("Admin")
                        .HasColumnName("role");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasColumnName("status");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId", "Email")
                        .IsUnique();

                    b.ToTable("invites");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<Guid?>("FaviconImageId")
                        .HasColumnType("TEXT")
                        .HasColumnName("favicon_image_id");

                    b.Property<Guid?>("LogoImageId")
                        .HasColumnType("TEXT")
                        .HasColumnName("logo_image_id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("varchar(250)")
                        .HasColumnName("name");

                    b.Property<string>("Website")
                        .HasColumnType("varchar(250)")
                        .HasColumnName("website");

                    b.HasKey("Id");

                    b.HasIndex("FaviconImageId");

                    b.HasIndex("LogoImageId");

                    b.ToTable("projects");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Status", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("varchar(8)")
                        .HasColumnName("color");

                    b.Property<bool>("IsDefault")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_default");

                    b.Property<bool>("IsInRoadmap")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_in_roadmap");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(250)")
                        .HasColumnName("name");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("TEXT")
                        .HasColumnName("project_id");

                    b.Property<int>("SortIndex")
                        .HasColumnType("INTEGER")
                        .HasColumnName("sort_index");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("statuses");
                });

            modelBuilder.Entity("VoteKit.Data.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("created_at");

                    b.Property<string>("DisplayName")
                        .HasColumnType("varchar(120)")
                        .HasColumnName("display_name");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(250)")
                        .HasColumnName("email");

                    b.Property<bool>("IsBanned")
                        .HasColumnType("INTEGER")
                        .HasColumnName("is_banned");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("char(64)")
                        .HasColumnName("password_hash");

                    b.Property<string>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("char(32)")
                        .HasColumnName("password_salt");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("TEXT")
                        .HasColumnName("project_id");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasColumnName("role");

                    b.Property<DateTime>("SeenAt")
                        .HasColumnType("TEXT")
                        .HasColumnName("seen_at");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId", "Email")
                        .IsUnique();

                    b.ToTable("users");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Activity", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Entry", "Entry")
                        .WithMany()
                        .HasForeignKey("EntryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("VoteKit.Data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Entry");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Board", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Project", "Project")
                        .WithMany("Boards")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Comment", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Entry", "Entry")
                        .WithMany()
                        .HasForeignKey("EntryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.Comment", "ReplyTo")
                        .WithMany("Replies")
                        .HasForeignKey("ReplyToId");

                    b.HasOne("VoteKit.Data.Models.Comment", "ReplyToRoot")
                        .WithMany("Descendants")
                        .HasForeignKey("ReplyToRootId");

                    b.HasOne("VoteKit.Data.Models.User", "User")
                        .WithMany("Comments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Entry");

                    b.Navigation("ReplyTo");

                    b.Navigation("ReplyToRoot");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VoteKit.Data.Models.CommentLike", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Comment", "Comment")
                        .WithMany("Likes")
                        .HasForeignKey("CommentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Comment");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Entry", b =>
                {
                    b.HasOne("VoteKit.Data.Models.User", "AssignedUser")
                        .WithMany()
                        .HasForeignKey("AssignedUserId");

                    b.HasOne("VoteKit.Data.Models.Board", "Board")
                        .WithMany("Entries")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.Status", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.User", "User")
                        .WithMany("Entries")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("AssignedUser");

                    b.Navigation("Board");

                    b.Navigation("Status");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntryField", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Entry", "Entry")
                        .WithMany("Fields")
                        .HasForeignKey("EntryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.FieldOption", "FieldOption")
                        .WithMany()
                        .HasForeignKey("FieldOptionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Entry");

                    b.Navigation("FieldOption");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntrySlug", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Board", "Board")
                        .WithMany()
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.Entry", "Entry")
                        .WithMany()
                        .HasForeignKey("EntryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Board");

                    b.Navigation("Entry");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntrySubscription", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Entry", "Entry")
                        .WithMany("Subscriptions")
                        .HasForeignKey("EntryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Entry");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VoteKit.Data.Models.EntryVote", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Entry", "Entry")
                        .WithMany("Votes")
                        .HasForeignKey("EntryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.User", "User")
                        .WithMany("EntryVotes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Entry");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Field", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("VoteKit.Data.Models.FieldOption", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Field", "Field")
                        .WithMany("Options")
                        .HasForeignKey("FieldId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Field");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Image", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VoteKit.Data.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Project");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Invite", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Project", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Image", "FaviconImage")
                        .WithMany()
                        .HasForeignKey("FaviconImageId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("VoteKit.Data.Models.Image", "LogoImage")
                        .WithMany()
                        .HasForeignKey("LogoImageId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("FaviconImage");

                    b.Navigation("LogoImage");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Status", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Project", "Project")
                        .WithMany("Statuses")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("VoteKit.Data.Models.User", b =>
                {
                    b.HasOne("VoteKit.Data.Models.Project", "Project")
                        .WithMany("Users")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Board", b =>
                {
                    b.Navigation("Entries");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Comment", b =>
                {
                    b.Navigation("Descendants");

                    b.Navigation("Likes");

                    b.Navigation("Replies");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Entry", b =>
                {
                    b.Navigation("Fields");

                    b.Navigation("Subscriptions");

                    b.Navigation("Votes");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Field", b =>
                {
                    b.Navigation("Options");
                });

            modelBuilder.Entity("VoteKit.Data.Models.Project", b =>
                {
                    b.Navigation("Boards");

                    b.Navigation("Statuses");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("VoteKit.Data.Models.User", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Entries");

                    b.Navigation("EntryVotes");
                });
#pragma warning restore 612, 618
        }
    }
}
