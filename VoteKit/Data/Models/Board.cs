
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models
{
  [Table("boards")]
  public class Board
  {
    private string? _slug;

    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("project_id")]
    [ForeignKey("Project")]
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("name", TypeName = "varchar(250)")]
    [Required(ErrorMessage = "Board name is required")]
    [MinLength(1, ErrorMessage = "Board Name is required")]
    [MaxLength(250, ErrorMessage = "Board Name can not be longer than 250 characters")]
    public string Name { get; set; } = null!;

    [Column("slug", TypeName = "varchar(250)")]
    [Required(ErrorMessage = "Board URL path is required")]
    public string Slug { get => _slug ?? string.Empty; set => _slug = Util.Slug.Slugify(value); }

    [Column("is_private")]
    public bool IsPrivate { get; set; }

    [Column("is_listed")]
    public bool IsListed { get; set; } = true;

    [Column("is_seo_indexed")]
    public bool IsSeoIndexed { get; set; }

    [RegularExpression(@"^[0-9a-fA-F]{6,8}$")]
    [Column("accent_color", TypeName = "varchar(8)")]
    public string Color { get; set; } = "7e37ffff";
    
    [InverseProperty("Board")]
    public List<Entry> Entries { get; set; } = null!;
    
    public static Board Create(Guid projectId, string name)
    {
      return new Board
      {
        Id = Guid.NewGuid(),
        ProjectId = projectId,
        Name = name,
        Slug = name
      };
    }
  }

  public class BoardConfiguration : IEntityTypeConfiguration<Board>
  {
    public void Configure(EntityTypeBuilder<Board> builder)
    {
      builder.HasIndex(x => new { x.ProjectId, x.Slug }).IsUnique();

      builder
        .HasOne(x => x.Project)
        .WithMany(x => x.Boards)
        .HasForeignKey(x => x.ProjectId)
        .IsRequired()
        .OnDelete(DeleteBehavior.Cascade);
    }
  }
}
