using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
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
  public class AddEntryInput
  {
    [Required] public Guid BoardId { get; set; }
    [Required] public string Title { get; set; } = null!;
    public Guid? StatusId { get; set; }
    public string? Content { get; set; }
    public Guid? AssigneeUserId { get; set; }
    public bool? IsPrivate { get; set; }
  }

  [Authorize(Policy = "User")]
  [UseVotekitCtx]
  public async Task<Entry> AddEntry(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] AddEntryInput input
  )
  {
    var board = await db.Boards.FirstOrDefaultAsync(b => b.Id == input.BoardId && b.ProjectId == project.Id);

    if (board == null)
      throw VoteKitException.NotFound;

    var user = await accessor.GetUserAsync();

    if (input.AssigneeUserId is not null)
    {
      var validUser = await db.Users.AnyAsync(u => u.Id == input.AssigneeUserId && u.ProjectId == project.Id);

      if (!validUser)
        throw new GqlException("Invalid assignee user", "INVALID_USER");
    }

    var entry = new Entry
    {
      Id = Guid.NewGuid(),
      BoardId = board.Id,
      Title = input.Title,
      Content = input.Content,
      UserId = user!.Id,
      Slug = input.Title,
      AssignedUserId = input.AssigneeUserId,
      IsPrivate = input.IsPrivate ?? false
    };

    if (input.StatusId != null)
      entry.StatusId = input.StatusId.Value;
    else
    {
      var defaultStatus = await db.Statuses.FirstOrDefaultAsync(s => s.ProjectId == project.Id && s.IsDefault);

      if (defaultStatus == null)
        throw new GqlException("Unable to determine the default status for entry", "NO_DEFAULT_STATUS");

      entry.StatusId = defaultStatus.Id;
    }

    await db.Entries.AddAsync(entry);

    await db.EntryVotes.AddAsync(new EntryVote
    {
      UserId = user.Id,
      EntryId = entry.Id,
      Delta = 1
    });

    await db.EntrySubscriptions.AddAsync(new EntrySubscription
    {
      UserId = user.Id,
      EntryId = entry.Id,
    });

    await db.Activities.AddAsync(new Activity
    {
      Type = ActivityType.EntryCreate,
      UserId = entry.UserId,
      EntryId = entry.Id,
    });

    await db.SaveChangesWithValidationAsync();

    return entry;
  }

  public class SaveEntryInput
  {
    [Required] public Guid EntryId { get; set; }

    public string? Title { get; set; } = null!;
    public string? Content { get; set; }

    public Guid? BoardId { get; set; }
    public Guid? StatusId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? AssignedUserId { get; set; }

    public bool? IsPrivate { get; set; }
    public bool? IsArchived { get; set; }
    public bool? IsLocked { get; set; }
  }

  [Authorize]
  [UseVotekitCtx]
  public async Task<Entry> SaveEntry(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] SaveEntryInput input
  )
  {
    var entry = await db.Entries.FirstOrDefaultAsync(x => x.Id == input.EntryId && x.Board.ProjectId == project.Id);

    if (entry == null)
      throw VoteKitException.NotFound;

    var user = await accessor.GetUserAsync();

    var activity = new Activity()
    {
      Type = ActivityType.EntrySave,
      UserId = user?.Id,
      EntryId = entry.Id,
    };

    entry.Content = input.Content ?? entry.Content;

    if (input.Title != null && input.Title != entry.Title)
    {
      activity.Metadata["OldTitle"] = entry.Title;
      activity.Metadata["NewTitle"] = input.Title;

      entry.Title = input.Title;
    }

    if (input.StatusId != null && input.StatusId != entry.StatusId)
    {
      if (!await db.Statuses.AnyAsync(m => m.Id == input.StatusId && m.ProjectId == project.Id))
        throw new GqlException("Status not valid", "NOTFOUND");

      activity.Metadata["OldStatusId"] = entry.StatusId.ToString();
      activity.Metadata["NewStatusId"] = input.StatusId.Value.ToString();

      entry.StatusId = input.StatusId.Value;
    }

    if (input.BoardId != null && input.BoardId != entry.BoardId)
    {
      if (!await db.Boards.AnyAsync(m => m.Id == input.BoardId && m.ProjectId == project.Id))
        throw new GqlException("Board not valid", "NOTFOUND");

      activity.Metadata["OldBoardId"] = entry.BoardId.ToString();
      activity.Metadata["NewBoardId"] = input.BoardId.Value.ToString();

      entry.BoardId = input.BoardId.Value;
    }

    if (input.UserId != null && input.UserId != entry.UserId)
    {
      if (input.UserId == Guid.Empty)
        input.UserId = null;

      if (input.UserId != null)
      {
        if (!await db.Users.AnyAsync(m => m.Id == input.UserId && m.ProjectId == project.Id))
          throw new GqlException("User not valid", "NOTFOUND");
      }

      if (entry.UserId != null)
        activity.Metadata["OldUserId"] = entry.UserId.Value.ToString();

      if (input.UserId != null)
        activity.Metadata["NewUserId"] = input.UserId.Value.ToString();

      entry.UserId = input.UserId;
    }
      
    if (input.AssignedUserId != entry.AssignedUserId)
    {
      if (input.AssignedUserId == Guid.Empty)
        input.AssignedUserId = null;

      if (input.AssignedUserId != null)
      {
        if (!await db.Users.AnyAsync(m =>
          m.Id == input.AssignedUserId && m.ProjectId == project.Id && (m.Role == UserRole.Editor || m.Role == UserRole.Admin)))
          throw new GqlException("Member not valid", "NOTFOUND");
      }

      if (entry.AssignedUserId != null)
        activity.Metadata["OldAssignedUserId"] = entry.AssignedUserId.Value.ToString();

      if (input.AssignedUserId != null)
        activity.Metadata["NewAssignedUserId"] = input.AssignedUserId.Value.ToString();

      entry.AssignedUserId = input.AssignedUserId;
    }

    if (input.IsPrivate.HasValue && entry.IsPrivate != input.IsPrivate.Value)
    {
      entry.IsPrivate = input.IsPrivate.Value;
      activity.Metadata["NewIsPrivate"] = entry.IsPrivate.ToString();
    }

    if (input.IsArchived.HasValue && entry.IsArchived != input.IsArchived.Value)
    {
      entry.IsArchived = input.IsArchived.Value;
      activity.Metadata["NewIsArchived"] = entry.IsArchived.ToString();
    }

    if (input.IsLocked.HasValue && entry.IsLocked != input.IsLocked.Value)
    {
      entry.IsLocked = input.IsLocked.Value;
      activity.Metadata["NewIsLocked"] = entry.IsLocked.ToString();
    }

    entry.Slug = entry.Title;

    await db.Activities.AddAsync(activity);

    await db.SaveChangesWithValidationAsync();

    return entry;
  }

  public class VoteEntryInput
  {
    [Required] public Guid EntryId { get; set; }
    public VoteDelta? Delta { get; set; }
  }

  [Authorize]
  [UseVotekitCtx]
  public async Task<Entry> VoteEntry(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] VoteEntryInput input
  )
  {
    var entry = await db.Entries.FirstOrDefaultAsync(x => x.Id == input.EntryId && x.Board.ProjectId == project.Id);

    if (entry == null)
      throw VoteKitException.NotFound;

    var user = (await accessor.GetUserAsync())!;

    var currentVote = await db.EntryVotes.FirstOrDefaultAsync(v => v.EntryId == entry.Id && v.UserId == user.Id);

    if (currentVote != null && input.Delta == VoteDelta.Down)
    {
      db.EntryVotes.Remove(currentVote);
    }
    else if (currentVote == null && input.Delta != VoteDelta.Down)
    {
      currentVote = new EntryVote
      {
        UserId = user.Id,
        EntryId = entry.Id,
        Delta = 1
      };

      await db.EntryVotes.AddAsync(currentVote);
    }

    if (input.Delta == VoteDelta.Up)
    {
      var currentSubs = await db.EntrySubscriptions.FirstOrDefaultAsync(s => s.EntryId == entry.Id && s.UserId == user.Id);
      
      if (currentSubs == null)
      {
        currentSubs = new EntrySubscription
        {
          EntryId = entry.Id,
          UserId = user.Id
        };

        await db.EntrySubscriptions.AddAsync(currentSubs);
      }
    }

    await db.SaveChangesAsync();

    return entry;
  }
    
  public class SubscribeEntryInput
  {
    [Required]
    public Guid EntryId { get; set; }
  }
    
  [Authorize]
  [UseVotekitCtx]
  public async Task<Entry> SubscribeEntry(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] SubscribeEntryInput input
  )
  {
    var entry = await db.Entries.FirstOrDefaultAsync(x => x.Id == input.EntryId && x.Board.ProjectId == project.Id);

    if (entry == null)
      throw VoteKitException.NotFound;

    var user = (await accessor.GetUserAsync())!;

    var currentSubs = await db.EntrySubscriptions.FirstOrDefaultAsync(s => s.EntryId == entry.Id && s.UserId == user.Id);

    if (currentSubs == null)
    {
      currentSubs = new EntrySubscription
      {
        EntryId = entry.Id,
        UserId = user.Id
      };

      await db.EntrySubscriptions.AddAsync(currentSubs);
    }

    await db.SaveChangesAsync();

    return entry;
  }
    
  public class UnSubscribeEntryInput
  {
    [Required]
    public Guid EntryId { get; set; }
  }
    
  [Authorize]
  [UseVotekitCtx]
  public async Task<Entry> UnSubscribeEntry(
    [Project] Project project,
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Validatable] UnSubscribeEntryInput input
  )
  {
    var entry = await db.Entries.FirstOrDefaultAsync(x => x.Id == input.EntryId && x.Board.ProjectId == project.Id);

    if (entry == null)
      throw VoteKitException.NotFound;

    var user = (await accessor.GetUserAsync())!;

    var currentSubs = await db.EntrySubscriptions.FirstOrDefaultAsync(s => s.EntryId == entry.Id && s.UserId == user.Id);

    if (currentSubs != null)
      db.EntrySubscriptions.Remove(currentSubs);

    await db.SaveChangesAsync();

    return entry;
  }
}
