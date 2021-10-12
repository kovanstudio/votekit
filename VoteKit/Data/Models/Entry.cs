
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models
{
  [Table("entries")]
  public class Entry
  {
    private string? _slug;
    private string _title = null!;

    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("board_id")]
    [ForeignKey("Board")]
    public Guid BoardId { get; set; }
    public Board Board { get; set; } = null!;

    [Column("status_id")]
    [ForeignKey("Status")]
    public Guid StatusId { get; set; }
    public Status Status { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("title", TypeName = "varchar(2048)")]
    [Required(ErrorMessage = "Entry Title is required")]
    [MaxLength(2048, ErrorMessage = "Entry Title is too large")]
    public string Title
    {
      get => _title;
      set
      {
        _title = value.Trim();

        if (string.IsNullOrEmpty(_slug))
          this.Slug = _title;
      }
    }

    [Column("content")]
    [MaxLength(1024 * 256, ErrorMessage = "Entry Content is too large")]
    public string? Content { get; set; }

    [Column("is_private")]
    public bool IsPrivate { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; } = false;

    [Column("is_archived")]
    public bool IsArchived { get; set; } = false;

    [Column("is_locked")]
    public bool IsLocked { get; set; } = false;

    [Column("user_id")]
    [ForeignKey("User")]
    public Guid? UserId { get; set; }
    public User? User { get; set; } = null!;

    [Column("assigned_user_id")]
    [ForeignKey("AssignedUser")]
    public Guid? AssignedUserId { get; set; }
    public User? AssignedUser { get; set; } = null!;

    [Column("slug", TypeName = "varchar(250)")]
    public string Slug { get => _slug ?? string.Empty; set => _slug = Util.Slug.Slugify(value, 250); }

    [InverseProperty("Entry")]
    public List<EntryField> Fields { get; set; } = null!;

    [InverseProperty("Entry")]
    public List<EntryVote> Votes { get; set; } = null!;

    [InverseProperty("Entry")]
    public List<EntrySubscription> Subscriptions { get; set; } = null!;
  }

  internal class EntrySaveChangesInterceptor : SaveChangesInterceptor
  {
    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = new CancellationToken())
    {
      if (eventData.Context is VotekitCtx ctx)
      {
        var entries = ctx.ChangeTracker.Entries<Entry>().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified).ToList();

        foreach (var entry in entries)
        {
          await FixEntrySlugAsync(ctx, entry.Entity);
          await EnsureEntrySlugAsync(ctx, entry.Entity);
        }
      }

      return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public async Task EnsureEntrySlugAsync(VotekitCtx db, Entry entry)
    {
      if (!await db.EntrySlugs.AnyAsync(x => x.BoardId == entry.BoardId && x.Slug == entry.Slug))
      {
        await db.EntrySlugs.AddAsync(new EntrySlug
        {
          EntryId = entry.Id,
          BoardId = entry.BoardId,
          Slug = entry.Slug
        });
      }
    }

    public async Task FixEntrySlugAsync(VotekitCtx db, Entry entry)
    {
      var slugindex = 1;
      var orgslug = entry.Slug;

      while (slugindex < 250)
      {
        if (await db.Entries.AnyAsync(x => x.BoardId == entry.BoardId && x.Slug == entry.Slug && x.Id != entry.Id) ||
            await db.EntrySlugs.AnyAsync(x => x.BoardId == entry.BoardId && x.Slug == entry.Slug && x.EntryId != entry.Id))
        {
          var suffix = $"-{slugindex++}";

          if (orgslug.Length + suffix.Length <= 250)
            entry.Slug = orgslug + suffix;
          else
            entry.Slug = orgslug.Substring(0, 250 - suffix.Length) + suffix;
        }
        else
        {
          break;
        }
      }
    }
  }

  internal class EntryConfiguration : IEntityTypeConfiguration<Entry>
  {
    public void Configure(EntityTypeBuilder<Entry> builder)
    {
      builder.HasIndex(x => new { x.Slug, x.BoardId }).IsUnique();
      builder.HasOne(e => e.User).WithMany(u => u!.Entries).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.SetNull);
    }
  }

  [Table("entry_slugs")]
  public class EntrySlug
  {
    private string? _slug;

    [Column("entry_id")]
    public Guid EntryId { get; set; }
    public Entry Entry { get; set; } = null!;

    [Column("board_id")]
    public Guid BoardId { get; set; }
    public Board Board { get; set; } = null!;

    [Column("slug", TypeName = "varchar(250)")]
    public string Slug { get => _slug ?? string.Empty; set => _slug = Util.Slug.Slugify(value, 250); }
  }

  internal class EntrySlugConfiguration : IEntityTypeConfiguration<EntrySlug>
  {
    public void Configure(EntityTypeBuilder<EntrySlug> builder)
    {
      builder.HasKey(x => new { x.Slug, x.BoardId });

      builder.HasOne(x => x.Entry).WithMany().IsRequired().HasForeignKey(x => x.EntryId).OnDelete(DeleteBehavior.Cascade);
      builder.HasOne(x => x.Board).WithMany().IsRequired().HasForeignKey(x => x.BoardId).OnDelete(DeleteBehavior.Cascade);
    }
  }

  [Table("entry_fields")]
  public class EntryField
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("entry_id")]
    [ForeignKey("Entry")]
    public Guid EntryId { get; set; }
    public Entry Entry { get; set; } = null!;

    [Column("field_option_id")]
    [ForeignKey("FieldOption")]
    public Guid FieldOptionId { get; set; }
    public FieldOption FieldOption { get; set; } = null!;
  }

  internal class EntryFieldConfiguration : IEntityTypeConfiguration<EntryField>
  {
    public void Configure(EntityTypeBuilder<EntryField> builder)
    {
      builder.HasOne(b => b.FieldOption).WithMany().OnDelete(DeleteBehavior.Cascade);
    }
  }

  [Table("entry_votes")]
  public class EntryVote
  {
    [Column("entry_id")]
    [ForeignKey("Entry")]
    public Guid EntryId { get; set; }
    public Entry Entry { get; set; } = null!;

    [Column("user_id")]
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("delta")]
    public byte Delta { get; set; } = 1;
  }

  internal class EntryVoteConfiguration : IEntityTypeConfiguration<EntryVote>
  {
    public void Configure(EntityTypeBuilder<EntryVote> builder)
    {
      builder.HasKey(x => new { x.EntryId, x.UserId });
      builder.HasIndex(x => new { x.EntryId, x.CreatedAt });
    }
  }

  [Table("entry_subscriptions")]
  public class EntrySubscription
  {
    [Column("entry_id")]
    [ForeignKey("Entry")]
    public Guid EntryId { get; set; }
    public Entry Entry { get; set; } = null!;

    [Column("user_id")]
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }

  internal class EntrySubscriptionConfiguration : IEntityTypeConfiguration<EntrySubscription>
  {
    public void Configure(EntityTypeBuilder<EntrySubscription> builder)
    {
      builder.HasKey(x => new { x.EntryId, x.UserId });
      builder.HasIndex(x => new { x.EntryId, x.CreatedAt });
    }
  }
}
