using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models;

[Table("projects")]
public class Project
{
  [Key]
  [Column("id")]
  public Guid Id { get; set; }

  [Required(ErrorMessage = "Project name is required")]
  [MaxLength(250, ErrorMessage = "Project name can not be longer than 250 characters")]
  [Column("name", TypeName = "varchar(250)")]
  public string Name { get; set; } = null!;

  [Url(ErrorMessage = "Website address is not a valid URL")]
  [Column("website", TypeName = "varchar(250)")]
  public string? Website { get; set; }

  [Column("logo_image_id")]
  [ForeignKey("LogoImage")]
  public Guid? LogoImageId { get; set; }
  public Image? LogoImage { get; set; }

  [Column("favicon_image_id")]
  [ForeignKey("FaviconImage")]
  public Guid? FaviconImageId { get; set; }
  public Image? FaviconImage { get; set; }

  [Column("created_at")]
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  [InverseProperty("Project")]
  public List<User> Users { get; set; } = null!;

  [InverseProperty("Project")]
  public List<Board> Boards { get; set; } = null!;

  [InverseProperty("Project")]
  public List<Status> Statuses { get; set; } = null!;

  public static Project Create(string name)
  {
    var project = new Project
    {
      Id = Guid.NewGuid(),
      Name = name
    };

    project.Statuses = new List<Status>
    {
      new Status { Id = Guid.NewGuid(), ProjectId = project.Id, Name = "Open", SortIndex = 0, Color = "666666", IsDefault = true },
      new Status { Id = Guid.NewGuid(), ProjectId = project.Id, Name = "Under Review", SortIndex = 1, Color = "FCC400", IsInRoadmap = true },
      new Status { Id = Guid.NewGuid(), ProjectId = project.Id, Name = "Planned", SortIndex = 2, Color = "9900EF", IsInRoadmap = true },
      new Status { Id = Guid.NewGuid(), ProjectId = project.Id, Name = "In Progress", SortIndex = 3, Color = "3778FF", IsInRoadmap = true },
      new Status { Id = Guid.NewGuid(), ProjectId = project.Id, Name = "Complete", SortIndex = 4, Color = "00831E" },
      new Status { Id = Guid.NewGuid(), ProjectId = project.Id, Name = "Closed", SortIndex = 5, Color = "FF4772" },
    };

    var board = Board.Create(project.Id, "Feature Requests");

    board.Entries = new List<Entry>
    {
      new Entry
      {
        Id = Guid.NewGuid(),
        BoardId = board.Id,
        Title = "Implement VoteKit",
        Content = "This is a sample feeback entry.",
        StatusId = project.Statuses[2].Id
      }
    };

    project.Boards = new List<Board> { board };

    return project;
  }
}

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
  public void Configure(EntityTypeBuilder<Project> builder)
  {
    builder.HasOne(i => i.LogoImage).WithMany().IsRequired(false).HasForeignKey(x => x.LogoImageId).OnDelete(DeleteBehavior.Restrict);
    builder.HasOne(i => i.FaviconImage).WithMany().IsRequired(false).HasForeignKey(x => x.FaviconImageId).OnDelete(DeleteBehavior.Restrict);
  }
}
