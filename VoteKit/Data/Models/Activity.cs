using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models;

public enum ActivityType
{
  None,
  EntryCreate,
  EntrySave,
  EntryUpvote,
  EntryRemove,
}

[Table("activities")]
public class Activity
{
  [Key] [Column("id")] public Guid Id { get; set; } = Guid.NewGuid();

  [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  [Column("type")] public ActivityType Type { get; set; } = ActivityType.None;

  [Column("entry_id")]
  [ForeignKey("Entry")]
  public Guid? EntryId { get; set; }

  public Entry? Entry { get; set; }

  [Column("user_id")]
  [ForeignKey("User")]
  public Guid? UserId { get; set; }

  public User? User { get; set; }

  [Column("metadata")] public Dictionary<string, string> Metadata { get; set; } = new();
}

public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
{
  public void Configure(EntityTypeBuilder<Activity> builder)
  {
    builder.HasOne(x => x.Entry).WithMany().HasForeignKey(x => x.EntryId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
    builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);

    builder.Property(x => x.Type).HasConversion<string>();

    builder.Property(x => x.Metadata)
      .HasConversion(
        x => JsonSerializer.Serialize(x, (JsonSerializerOptions?)null),
        x => JsonSerializer.Deserialize<Dictionary<string, string>>(x, (JsonSerializerOptions?)null) ?? new Dictionary<string, string>(),
        new ValueComparer<Dictionary<string, string>>(
          (x, y) => ReferenceEquals(x, y) || x != null && y != null && x.SequenceEqual(y),
          x => x.Aggregate(0, (a, v) => HashCode.Combine(a, v.Key.GetHashCode(), v.Value.GetHashCode())),
          x => x.ToArray().ToDictionary(y => y.Key, y => y.Value)
        )
      );
  }
}
