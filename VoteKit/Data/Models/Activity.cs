using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models
{
  public enum ActivityType
  {
    None,
    EntryCreate,
    EntrySave,
    EntryUpvote,
  }

  [Table("activities")]
  public class Activity
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("type")]
    public ActivityType Type { get; set; } = ActivityType.None;

    [Column("entry_id")]
    [ForeignKey("Entry")]
    public Guid? EntryId { get; set; }
    public Entry? Entry { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    //TODO: Find a solution for SQLite
    [NotMapped]
    public Dictionary<string, string> Metadata { get; set; } = new Dictionary<string, string>();
  }

  public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
  {
    public void Configure(EntityTypeBuilder<Activity> builder)
    {
      builder.HasOne(x => x.Entry).WithMany().HasForeignKey(x => x.EntryId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
      builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);

      builder.Property(x => x.Type).HasConversion<string>();
    }
  }
}
