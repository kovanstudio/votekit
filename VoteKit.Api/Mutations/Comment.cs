using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Services;

namespace VoteKit.Api.Mutations;

public partial class Mutation
{
  public class AddCommentInput
  {
    [Required]
    public Guid EntryId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public bool? IsPrivate { get; set; }
    public Guid? ReplyToCommentId { get; set; }
  }
    
  [Authorize]
  [UseVotekitCtx]
  public async Task<Comment> AddComment(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] AddCommentInput input
  )
  {
    var comment = new Comment()
    {
      Id = Guid.NewGuid(),
      EntryId = input.EntryId,
      Content = input.Content,
      IsPrivate = input.IsPrivate ?? false
    };

    if (input.ReplyToCommentId != null)
    {
      var parent = await db.Comments.FirstOrDefaultAsync(c => c.EntryId == input.EntryId && c.Id == input.ReplyToCommentId.Value);

      if (parent == null)
        throw VoteKitException.NotFound;

      comment.ReplyToId = parent.Id;
      comment.ReplyToRootId = parent.ReplyToRootId ?? parent.Id;
    }

    comment.UserId = (await accessor.GetUserAsync())!.Id;

    await db.Comments.AddAsync(comment);
    await db.SaveChangesWithValidationAsync();

    return comment;
  }
    
  public class VoteCommentInput
  {
    [Required]
    public Guid CommentId { get; set; }
    public VoteDelta? Delta { get; set; }
  }
    
  [Authorize]
  [UseVotekitCtx]
  public async Task<Comment> VoteComment(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] VoteCommentInput input
  )
  {
    var comment = await db.Comments.FirstOrDefaultAsync(c => c.Id == input.CommentId && c.Entry.Board.ProjectId == project.Id);

    if (comment == null)
      throw VoteKitException.NotFound;

    var user = (await accessor.GetUserAsync())!;

    var currentVote = await db.CommentLikes
      .FirstOrDefaultAsync(c => c.CommentId == comment.Id && c.UserId == user.Id);

    if (currentVote != null && input.Delta == null)
      input.Delta = VoteDelta.Down;
      
    if (currentVote != null && input.Delta == VoteDelta.Down)
    {
      db.CommentLikes.Remove(currentVote);
    }
    else if (currentVote == null && input.Delta != VoteDelta.Down)
    {
      await db.CommentLikes.AddAsync(new()
      {
        UserId = user.Id,
        CommentId = comment.Id
      });
    }

    await db.SaveChangesAsync();

    return comment;
  }
    
  public class SaveCommentInput
  {
    [Required]
    public Guid CommentId { get; set; }
    public string? Content { get; set; }
    public bool? IsPrivate { get; set; }
  }

  [Authorize]
  [UseVotekitCtx]
  public async Task<Comment> SaveComment(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] SaveCommentInput input
  )
  {
    var comment = await db.Comments.FirstOrDefaultAsync(c => c.Id == input.CommentId && c.Entry.Board.ProjectId == project.Id);

    if (comment == null)
      throw VoteKitException.NotFound;

    if (!await accessor.AuthorizeAsync("Editor") && comment.UserId != accessor.UserId)
      throw VoteKitException.AccessDenied;

    comment.Content = input.Content ?? comment.Content;
    comment.IsPrivate = input.IsPrivate ?? comment.IsPrivate;

    await db.SaveChangesWithValidationAsync();

    return comment;
  }

  public class RemoveCommentInput
  {
    [Required]
    public Guid CommentId { get; set; }
  }
    
  [Authorize]
  [UseVotekitCtx]
  public async Task<OperationResult> RemoveComment(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] RemoveCommentInput input
  )
  {
    var comment = await db.Comments.FirstOrDefaultAsync(c => c.Id == input.CommentId && c.Entry.Board.ProjectId == project.Id);

    if (comment == null)
      throw VoteKitException.NotFound;

    if (!await accessor.AuthorizeAsync("Editor") && comment.UserId != accessor.UserId)
      throw VoteKitException.AccessDenied;

    db.Comments.Remove(comment);

    await db.SaveChangesWithValidationAsync();

    return OperationResult.Success;
  }
}
