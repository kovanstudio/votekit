using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models;

public enum InviteStatus
{
  Waiting,
  Accepted,
  Rejected
}

[Table("invites")]
public class Invite
{
  private string? _email;

  [Key] [Column("id")] public Guid Id { get; set; }

  [Column("project_id")]
  [ForeignKey("Project")]
  public Guid ProjectId { get; set; }

  public Project Project { get; set; } = null!;

  [Column("email", TypeName = "varchar(250)")]
  [EmailAddress]
  public string Email
  {
    get => _email ?? string.Empty;
    set => _email = value.Trim().ToLower();
  }

  [Column("role")] public UserRole Role { get; set; } = UserRole.Admin;

  [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  [Column("status")] public InviteStatus Status { get; set; } = InviteStatus.Waiting;
}

public class InviteConfiguration : IEntityTypeConfiguration<Invite>
{
  public void Configure(EntityTypeBuilder<Invite> builder)
  {
    builder.HasIndex(x => new { x.ProjectId, x.Email }).IsUnique();
    builder.Property(x => x.Role).HasDefaultValue(UserRole.Admin).HasConversion<string>();
    builder.Property(x => x.Status).HasConversion<string>();
  }
}
