using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Data.Services;

namespace VoteKit.Api.Mutations;

public partial class Mutation
{
  public class AddInviteInput
  {
    [Required] [EmailAddress] public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Editor;
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<Invite> AddInvite(
    [Project] Project project,
    [Service] IInviteService inviteService,
    [ScopedService] VotekitCtx db,
    [Validatable] AddInviteInput input
  )
  {
    var invite = await db.Invites.FirstOrDefaultAsync(x => x.ProjectId == project.Id && x.Email == input.Email);

    if (invite != null)
    {
      if (DateTimeOffset.Now - invite.CreatedAt < TimeSpan.FromHours(1))
        throw new GqlException("An invitiation sent recently to this address. Please wait in order to invite again.");
    }
    else
    {
      invite = new Invite
      {
        Id = Guid.NewGuid(),
        ProjectId = project.Id,
        Email = input.Email,
        Role = input.Role,
      };

      await db.Invites.AddAsync(invite);
    }

    invite.CreatedAt = DateTime.UtcNow;
    await db.SaveChangesWithValidationAsync();

    //TODO: Send mail

    var token = inviteService.EncodeToken(invite);

    return invite;
  }

  public class RemoveInviteInput
  {
    [Required]
    public Guid InviteId { get; set; }
  }
    
  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<OperationResult> RemoveInvite([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] RemoveInviteInput input)
  {
    var invite = await db.Invites.FirstOrDefaultAsync(x => x.ProjectId == project.Id && x.Id == input.InviteId);

    if (invite == null)
      throw VoteKitException.NotFound;

    db.Invites.Remove(invite);

    await db.SaveChangesAsync();

    return OperationResult.Success;
  }
}
