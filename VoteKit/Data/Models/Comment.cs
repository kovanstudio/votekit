using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VoteKit.Data.Models
{
  [Table("comments")]
  public class Comment
  {
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("entry_id")]
    [ForeignKey("Entry")]
    public Guid EntryId { get; set; }
    public Entry Entry { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("content")]
    [Required]
    [MaxLength(3000, ErrorMessage = "Comment text can not be longer than 3000 characters.")]
    public string Content { get; set; } = null!;

    [Column("is_private")]
    public bool IsPrivate { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    [Column("reply_to_id")]
    public Guid? ReplyToId { get; set; }
    public Comment? ReplyTo { get; set; }

    [Column("reply_to_root_id")]
    public Guid? ReplyToRootId { get; set; }
    public Comment? ReplyToRoot { get; set; }

    [InverseProperty("Comment")]
    public List<CommentLike> Likes { get; set; } = null!;

    public List<Comment> Replies { get; set; } = null!;
    public List<Comment> Descendants { get; set; } = null!;
  }

  public class CommentConfiguration : IEntityTypeConfiguration<Comment>
  {
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
      builder.HasOne(c => c.ReplyTo).WithMany(c => c!.Replies).HasForeignKey(c => c.ReplyToId);
      builder.HasOne(c => c.ReplyToRoot).WithMany(c => c!.Descendants).HasForeignKey(c => c.ReplyToRootId);

      builder.HasOne(c => c.User!).WithMany(u => u.Comments).HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.SetNull);
    }
  }

  [Table("comment_likes")]
  public class CommentLike
  {
    [Column("comment_id")]
    [ForeignKey("Comment")]
    public Guid CommentId { get; set; }
    public Comment Comment { get; set; } = null!;
    
    [Column("user_id")]
    [ForeignKey("User")]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
  
  internal class CommentLikeConfiguration : IEntityTypeConfiguration<CommentLike>
  {
    public void Configure(EntityTypeBuilder<CommentLike> builder)
    {
      builder.HasKey(x => new { x.CommentId, x.UserId });
    }
  }
}
