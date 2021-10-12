using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Services;

namespace VoteKit.Api;

[ExtendObjectType(typeof(Entry))]
public class CommentResolversOnEntry
{
  [UseVotekitCtx]
  [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10, MaxPageSize = 100)]
  public async Task<IQueryable<Comment>> Comments(
    [Parent] Entry entry,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    bool includeReplies = false
  )
  {
    var qry = db.Comments.Where(v => v.EntryId == entry.Id);

    if (!includeReplies)
      qry = qry.Where(c => c.ReplyToId == null);

    if (!await accessor.AuthorizeAsync("Editor"))
      qry = qry.Where(c => !c.IsPrivate);

    return qry.OrderByDescending(v => v.CreatedAt);
  }
}

[ExtendObjectType(typeof(Comment))]
public class CommentResolvers
{
  public record CommentStats(int Likes, int Replies);
    
  [UseVotekitCtx]
  public async Task<User?> User([Parent] Comment comment, [ScopedService] VotekitCtx db)
  {
    return comment.UserId switch
    {
      null => null,
      var id => await db.Users.FindAsync(id),
    };
  }
    
  [UseVotekitCtx]
  public async Task<Comment?> ReplyTo([Parent] Comment comment, [ScopedService] VotekitCtx db)
  {
    return comment.ReplyToId switch
    {
      null => null,
      var id => await db.Comments.FindAsync(id),
    };
  }
    
  [UseVotekitCtx]
  public async Task<CommentStats> Stats([Parent] Comment comment, [ScopedService] VotekitCtx db)
  {
    return new CommentStats(
      Likes: await db.CommentLikes.CountAsync(c => c.CommentId == comment.Id),
      Replies: await db.Comments.CountAsync(c => c.ReplyToId == comment.Id)
    );
  }
    
  [UseVotekitCtx]
  public async Task<bool> LikedByMe([Parent] Comment comment, [Service] IAccessor accessor,  [ScopedService] VotekitCtx db)
  {
    var user = await accessor.GetUserAsync();

    if (user is null)
      return false;
      
    return await db.CommentLikes.AnyAsync(v => v.CommentId == comment.Id && v.UserId == comment.UserId);
  }
}
  
public class CommentType: ExplicitObjectType<Comment>
{
  protected override void Configure(IObjectTypeDescriptor<Comment> descriptor)
  {
    base.Configure(descriptor);
      
    descriptor.Field(p => p.Id);
    descriptor.Field(p => p.Content);
    descriptor.Field(p => p.EntryId);
    descriptor.Field(p => p.CreatedAt);
    descriptor.Field(p => p.UserId);
    descriptor.Field(p => p.ReplyToId);
    descriptor.Field(p => p.ReplyToRootId);
    descriptor.Field(p => p.IsPrivate);
  }
}
