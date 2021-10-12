
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models
{
  public enum FieldType
  {
    String,
    Boolean,
    Select,
    MultiSelect
  }

  [Table("fields")]
  public class Field
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("project_id")]
    [ForeignKey("Project")]
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [Column("name", TypeName = "varchar(100)")]
    public string Name { get; set; } = null!;

    [Column("type", TypeName = "varchar(50)")]
    public FieldType Type { get; set; } = FieldType.String;

    [Column("is_listed")]
    public bool IsListed { get; set; }

    [Column("is_private")]
    public bool IsPrivate { get; set; }

    [InverseProperty("Field")]
    public List<FieldOption> Options { get; set; } = null!;
  }
  
  public class FieldConfiguration : IEntityTypeConfiguration<Field>
  {
    public void Configure(EntityTypeBuilder<Field> builder)
    {
      builder.Property(x => x.Type).HasConversion<string>();
    }
  }

  [Table("field_options")]
  public class FieldOption
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("field_id")]
    [ForeignKey("Field")]
    public Guid FieldId { get; set; }
    public Field Field { get; set; } = null!;

    [Column("value", TypeName = "varchar(100)")]
    public string Value { get; set; } = null!;

    [RegularExpression(@"^[0-9a-fA-F]{6,8}$")]
    [Column("color", TypeName = "varchar(8)")]
    public string? Color { get; set; }
  }
}
