using System;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Data.Sorting;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Services;

namespace VoteKit.Api;

public partial class Query
{
  [UseVotekitCtx]
  public async Task<User?> Me([Service] IAccessor accessor)
  {
    return await accessor.GetUserAsync();
  }
    
  [Authorize(Policy = "Editor")]
  [UseVotekitCtx]
  public async Task<User?> User([Project] Project project, [ScopedService] VotekitCtx db, Guid id)
  {
    return await db.Users.FirstOrDefaultAsync(u => u.Id == id && u.ProjectId == project.Id);
  }
    
  public class UsersInput
  {
    public string? Query { get; set; }
    public bool? HasEntry { get; set; }
    public bool? HasComment { get; set; }
  }
    
  public class UsersOrderByInput
  {
    public OrderBy? SeenAt { get; set; }
    public OrderBy? Entries { get; set; }
    public OrderBy? Votes { get; set; }
  }
    
  [Authorize(Policy = "Editor")]
  [UseVotekitCtx]
  [UsePaging(DefaultPageSize = 10, IncludeTotalCount = true, MaxPageSize = 50)]
  public IQueryable<User> Users(
    [ScopedService] VotekitCtx db,
    [Project] Project project,
    UsersInput? input,
    UsersOrderByInput? orderBy
  )
  {
    var query = db.Users.Where(u => u.ProjectId == project.Id);
      
    if (!string.IsNullOrWhiteSpace(input?.Query))
      query = query.Where(e => e.Email.Contains(input.Query) || (e.DisplayName != null && e.DisplayName.Contains(input.Query)));

    if (input?.HasEntry == true)
      query = query.Where(e => e.Entries.Count > 0);

    if (input?.HasComment == true)
      query = query.Where(e => e.Comments.Count > 0);

    query = orderBy switch
    {
      { Entries: OrderBy.Asc } => query.OrderBy(c => c.Entries.Count),
      { Entries: OrderBy.Desc } => query.OrderByDescending(c => c.Entries.Count),
      { Votes: OrderBy.Asc } => query.OrderBy(c => c.EntryVotes.Count),
      { Votes: OrderBy.Desc } => query.OrderByDescending(c => c.EntryVotes.Count),
      { SeenAt: OrderBy.Asc } => query.OrderBy(c => c.SeenAt),
      _ => query.OrderByDescending(c => c.SeenAt)
    };

    return query;
  }
    
  [Authorize(Policy = "Editor")]
  [UseVotekitCtx]
  public IQueryable<User> Members(
    [ScopedService] VotekitCtx db,
    [Project] Project project,
    UsersInput? input,
    UsersOrderByInput? orderBy
  )
  {
    return db.Users
      .Where(u => u.ProjectId == project.Id && (u.Role == UserRole.Admin || u.Role == UserRole.Editor))
      .OrderBy(u => u.CreatedAt);
  }
}

[ExtendObjectType(typeof(User))]
public class UserResolvers
{
  public record UserStats(int Votes, int Comments, int Entries);
    
  [UseVotekitCtx]
  public async Task<Project> Project(
    [Parent] User user,
    [ScopedService] VotekitCtx db
  )
  {
    db.Attach(user);
      
    await db.Entry(user).Reference(e => e.Project).LoadAsync();
    return user.Project;
  }
    
  [UseVotekitCtx]
  public async Task<UserStats> Stats(
    [Parent] User user,
    [ScopedService] VotekitCtx db
  )
  {
    return new UserStats(
      Entries: await db.Entries.CountAsync(v => v.UserId == user.Id),
      Votes: await db.EntryVotes.CountAsync(v => v.UserId == user.Id),
      Comments: await db.Comments.CountAsync(v => v.UserId == user.Id)
    );
  }
    
  [Authorize]
  public async Task<bool> HasPassword(
    [Parent] User user,
    [Service] IAccessor accessor
  )
  {
    if (user.Id.Equals(accessor.UserId) || await accessor.AuthorizeAsync("Editor"))
      return user.PasswordHash != null;
      
    throw VoteKitException.NotAuthorized;
  }
}
  
public class UserType : ExplicitObjectType<User>
{
  protected override void Configure(IObjectTypeDescriptor<User> descriptor)
  {
    base.Configure(descriptor);
      
    descriptor.Field(x => x.Id);
    descriptor.Field(x => x.Email);
    descriptor.Field(x => x.Avatar);
    descriptor.Field(x => x.ProjectId);
    descriptor.Field(x => x.CreatedAt);
    descriptor.Field(x => x.SeenAt).Authorize("Editor");
    descriptor.Field(x => x.Role).Authorize("Admin");

    descriptor.Field("displayName").Resolve(ctx =>
    {
      var user = ctx.Parent<User>();
      return user.DisplayName ?? user.Email.Substring(0, user.Email.IndexOf("@", StringComparison.Ordinal));
    });
  }
}
