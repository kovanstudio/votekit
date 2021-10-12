using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models
{
  [Table("images")]
  public class Image
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    [Column("project_id")]
    [ForeignKey("Project")]
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("file_size")]
    public int FileSize { get; set; }

    [Column("format")]
    public string Format { get; set; } = null!;

    [Column("width")]
    public int Width { get; set; }

    [Column("height")]
    public int Height { get; set; }
  }

  public class ImageConfiguration : IEntityTypeConfiguration<Image>
  {
    public void Configure(EntityTypeBuilder<Image> builder)
    {
      builder.HasOne(i => i.User).WithMany().OnDelete(DeleteBehavior.SetNull);
      builder.HasOne(i => i.Project).WithMany().OnDelete(DeleteBehavior.Cascade);
    }
  }
}
