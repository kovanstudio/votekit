using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Extensions;
using VoteKit.Services;

namespace VoteKit.Api;

[ExtendObjectType(typeof(Query))]
public class EntryResolversOnQuery
{
  [UseVotekitCtx]
  public async Task<Entry?> Entry(
    [Project] Project project,
    [ScopedService] VotekitCtx db,
    [Service] IAccessor access,
    Guid id
  )
  {
    var set = db.Entries.AsQueryable();

    if (!await access.AuthorizeAsync("Editor"))
      set = set.WherePubliclyVisible();

    return await set.FirstOrDefaultAsync(x => x.Id == id && x.Board.ProjectId == project.Id);
  }

  [UseVotekitCtx]
  public async Task<Entry?> LookupEntry(
    [Project] Project project,
    [ScopedService] VotekitCtx db,
    [Service] IAccessor access,
    string boardSlug,
    string entrySlug
  )
  {
    var set = db.Entries.AsQueryable();

    if (!await access.AuthorizeAsync("Editor"))
      set = set.WherePubliclyVisible();

    return await set.FirstOrDefaultAsync(x => x.Slug == entrySlug && x.Board.Slug == boardSlug && x.Board.ProjectId == project.Id);
  }

  [UseVotekitCtx]
  [UsePaging(IncludeTotalCount = true, MaxPageSize = 100, DefaultPageSize = 10)]
  public async Task<IQueryable<Entry>> Entries(
    [Project] Project project,
    [ScopedService] VotekitCtx db,
    [Service] IAccessor access,
    EntriesInput? input,
    EntriesOrderBy? orderBy
  )
  {
    var query = db.Entries.AsQueryable();

    if (!await access.AuthorizeAsync("Editor"))
      query = query.WherePubliclyVisible();
    else if (input?.IsPrivate != null)
      query = query.Where(e => e.IsPrivate == input.IsPrivate);

    query = query.Where(e => e.Board!.ProjectId == project.Id);

    if (input?.BoardIds?.Count > 0)
      query = query.Where(e => input.BoardIds.Contains(e.BoardId));

    if (input?.StatusIds?.Count > 0)
      query = query.Where(e => input.StatusIds.Contains(e.StatusId));

    if (input?.UserIds?.Count > 0)
      query = query.Where(e => e.UserId != null && input.UserIds.Contains(e.UserId.Value));

    if (input?.VoterUserIds?.Count > 0)
      query = query.Where(e => e.Votes.Any(v => input.VoterUserIds.Contains(v.UserId)));

    if (input?.Query != null && !string.IsNullOrWhiteSpace(input.Query))
      query = query.Where(e => e.Title.Contains(input.Query) || e.Content != null && e.Content.Contains(input.Query));

    query = orderBy switch
    {
      { Votes: OrderBy.Asc } => query.OrderBy(x => x.Votes.Count),
      { Votes: OrderBy.Desc } => query.OrderByDescending(x => x.Votes.Count),
      { Watchers: OrderBy.Asc } => query.OrderBy(x => x.Subscriptions.Count),
      { Watchers: OrderBy.Desc } => query.OrderByDescending(x => x.Subscriptions.Count),
      { CreatedAt: OrderBy.Asc } => query.OrderBy(x => x.CreatedAt),
      _ => query.OrderByDescending(x => x.CreatedAt)
    };

    return query;
  }

  public class EntriesInput
  {
    public string? Query { get; set; }

    public List<Guid>? BoardIds { get; set; }
    public List<Guid>? StatusIds { get; set; }
    public List<Guid>? UserIds { get; set; }
    public List<Guid>? VoterUserIds { get; set; }

    public bool? IsPrivate { get; set; }
  }

  public class EntriesOrderBy
  {
    public OrderBy? CreatedAt { get; set; }
    public OrderBy? Votes { get; set; }
    public OrderBy? Watchers { get; set; }
  }
}

[ExtendObjectType(typeof(Entry))]
public class EntryResolvers
{
  [UseVotekitCtx]
  public async Task<EntryStats> Stats([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    return new EntryStats(
      await db.Comments.CountAsync(c => c.EntryId == entry.Id),
      await db.EntryVotes.CountAsync(c => c.EntryId == entry.Id),
      await db.EntrySubscriptions.CountAsync(c => c.EntryId == entry.Id)
    );
  }

  [UseVotekitCtx]
  public async Task<User?> User([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    return entry.UserId switch
    {
      null => null,
      var id => await db.Users.FindAsync(id)
    };
  }

  [UseVotekitCtx]
  public async Task<User?> AssignedUser([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    return entry.AssignedUserId switch
    {
      null => null,
      var id => await db.Users.FindAsync(id)
    };
  }

  [UseVotekitCtx]
  public async Task<Status> Status([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    return (await db.Statuses.FindAsync(entry.StatusId))!;
  }

  [UseVotekitCtx]
  public async Task<Board> Board([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    return (await db.Boards.FindAsync(entry.BoardId))!;
  }

  [UseVotekitCtx]
  [UsePaging(IncludeTotalCount = true, MaxPageSize = 100, DefaultPageSize = 10)]
  public IQueryable<User> Upvoters([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    return db.EntryVotes.Where(v => v.EntryId == entry.Id).OrderByDescending(v => v.CreatedAt).Select(v => v.User);
  }

  [UseVotekitCtx]
  [UsePaging(IncludeTotalCount = true, MaxPageSize = 100, DefaultPageSize = 10)]
  public IQueryable<User> Subscribers([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    return db.EntrySubscriptions.Where(v => v.EntryId == entry.Id).OrderByDescending(s => s.CreatedAt).Select(v => v.User);
  }

  [UseVotekitCtx]
  public async Task<bool> UpvotedByMe([Service] IAccessor accessor, [Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    var user = await accessor.GetUserAsync();

    if (user is null)
      return false;

    return await db.EntryVotes.AnyAsync(v => v.EntryId == entry.Id && v.User.Id == user.Id);
  }

  [UseVotekitCtx]
  public async Task<bool> SubscribedByMe([Service] IAccessor accessor, [Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    var user = await accessor.GetUserAsync();

    if (user is null)
      return false;

    return await db.EntrySubscriptions.AnyAsync(v => v.EntryId == entry.Id && v.User.Id == user.Id);
  }

  [UseVotekitCtx]
  public async Task<string> Pathname([Parent] Entry entry, [ScopedService] VotekitCtx db)
  {
    var boardSlug = await db.Boards.Where(x => x.Id == entry.BoardId).Select(x => x.Slug).FirstOrDefaultAsync();

    if (boardSlug == null)
      throw new VoteKitException("Entry board could not be located");

    return $"/{boardSlug}/{entry.Slug}";
  }

  public record EntryStats(int Comments, int Votes, int Subscriptions);
}

public class EntryType : ExplicitObjectType<Entry>
{
  protected override void Configure(IObjectTypeDescriptor<Entry> descriptor)
  {
    base.Configure(descriptor);

    descriptor.Field(x => x.Id);
    descriptor.Field(x => x.Title);
    descriptor.Field(x => x.Content);
    descriptor.Field(x => x.Slug);
    descriptor.Field(x => x.CreatedAt);
    descriptor.Field(x => x.BoardId);
    descriptor.Field(x => x.StatusId);
    descriptor.Field(x => x.UserId);
    descriptor.Field(x => x.AssignedUserId);
    descriptor.Field(x => x.IsLocked);
    descriptor.Field(x => x.IsPrivate).Authorize("Editor");
    descriptor.Field(x => x.IsArchived).Authorize("Editor");
    descriptor.Field(x => x.IsDeleted).Authorize("Editor");
  }
}
