
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VoteKit.Util;

namespace VoteKit.Data.Models
{
  public enum UserRole : int
  {
    Visitor = 0,
    User = 1,
    Editor = 2,
    Admin = 3,
  }
  
  [Table("users")]
  public class User
  {
    private string _email = null!;

    [Key]
    [Column("id")]
    public Guid Id { get; set; }
    
    [Column("role")]
    public UserRole Role { get; set; } = UserRole.User;

    [Column("email", TypeName = "varchar(250)")]
    [EmailAddress]
    public string Email { get => _email; set => _email = value.Trim().ToLower(); }
    
    [Column("password_hash", TypeName = "char(64)")]
    public string? PasswordHash { get; set; }

    [Column("password_salt", TypeName = "char(32)")]
    public string PasswordSalt { get; set; } = null!;

    [Column("display_name", TypeName = "varchar(120)")]
    public string? DisplayName { get; set; }

    [Column("project_id")]
    [ForeignKey("Project")]
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("seen_at")]
    public DateTime SeenAt { get; set; } = DateTime.UtcNow;

    [Column("is_banned")]
    public bool IsBanned { get; set; } = false;

    [InverseProperty("User")]
    public List<Entry> Entries { get; set; } = null!;

    [InverseProperty("User")]
    public List<Comment> Comments { get; set; } = null!;

    [InverseProperty("User")]
    public List<EntryVote> EntryVotes { get; set; } = null!;

    [NotMapped]
    public string Password
    {
      set
      {
        var salt = new byte[128 / 8];

        using (var rng = RandomNumberGenerator.Create())
        {
          rng.GetBytes(salt);
        }

        PasswordSalt = Hex.ToHex(salt);
        PasswordHash = value != "" ? Hash.HashPassword(value, salt) : null;
      }
    }

    public bool CheckPassword(string password)
    {
      if (string.IsNullOrWhiteSpace(password))
        return false;
      
      return Hash.HashPassword(password, Hex.FromHex(PasswordSalt)).Equals(PasswordHash);
    }

    [NotMapped]
    public string Avatar => $"https://www.gravatar.com/avatar/{Hash.MD5Hash(Email)}";
  }

  public class UserConfiguration : IEntityTypeConfiguration<User>
  {
    public void Configure(EntityTypeBuilder<User> builder)
    {
      builder.HasIndex(x => new { x.ProjectId, x.Email }).IsUnique();

      builder.Property(b => b.Role).HasConversion<string>();
    }
  }
}
