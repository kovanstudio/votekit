using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models;

[Table("sso_configs")]
public class SsoConfig
{
  [Column("project_id")] public Guid ProjectId { get; set; }
  [Column("key")] public Guid SsoKey { get; set; } = Guid.NewGuid();
  [Column("login_url")] public string? LoginUrl { get; set; }
  [Column("logout_url")] public string? LogoutUrl { get; set; }

  public Project Project { get; set; } = null!;

  [NotMapped] public string SsoKeyString => SsoKey.ToString().ToLowerInvariant();
}

public class SsoConfigConfiguration : IEntityTypeConfiguration<SsoConfig>
{
  public void Configure(EntityTypeBuilder<SsoConfig> builder)
  {
    builder.HasKey(x => x.ProjectId);
    builder.HasOne(x => x.Project).WithOne(x => x.SsoConfig).IsRequired(false).HasForeignKey<SsoConfig>(x => x.ProjectId);
  }
}
