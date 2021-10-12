
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models
{
  [Table("statuses")]
  public class Status
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("project_id")]
    [ForeignKey("Project")]
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [Column("name", TypeName = "varchar(250)")]
    public string Name { get; set; } = null!;

    [Column("color", TypeName = "varchar(8)")]
    public string Color { get; set; } = null!;

    [Column("sort_index")]
    public int SortIndex { get; set; }
    
    [Column("is_default")]
    public bool IsDefault { get; set; }
    
    [Column("is_in_roadmap")]
    public bool IsInRoadmap { get; set; }
  }

  public class StatusConfiguration : IEntityTypeConfiguration<Status>
  {
    public void Configure(EntityTypeBuilder<Status> builder)
    {
      builder
        .HasOne(x => x.Project)
        .WithMany(x => x.Statuses)
        .HasForeignKey(x => x.ProjectId)
        .OnDelete(DeleteBehavior.Cascade)
        .IsRequired();
    }
  }
}
