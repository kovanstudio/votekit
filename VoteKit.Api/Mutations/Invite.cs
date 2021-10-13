using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.EntityFrameworkCore;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Data.Services;
using VoteKit.Services;

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
    [Service] IEmailService emailService,
    [Service] IHttpContextAccessor contextAccessor,
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
        Role = input.Role
      };

      await db.Invites.AddAsync(invite);
    }

    invite.CreatedAt = DateTime.UtcNow;
    await db.SaveChangesWithValidationAsync();

    var httpContext = contextAccessor.HttpContext!;
    var req = httpContext.Request;
    var baseUrl = req.Scheme + Uri.SchemeDelimiter + req.Host;

    await emailService.SendEmailAsync(new MailMessage
    {
      Subject = $"{project.Name} - Complete Login",
      ToEmails = new List<string> { invite.Email },
      TextContent = string.Join("\r\n",
        $"Hi there!",
        $"",
        $"You have been invited to join {project.Name}",
        $"Please click the following link to create your account:",
        $"",
        $"{baseUrl}{Uri.SchemeDelimiter}/dashboard/register/{inviteService.EncodeToken(invite)}",
        $"",
        $"Thank you!"
      ),
      HtmlContent = string.Join("\r\n",
        $"<p>Hi there!</p>",
        $"<br />",
        $"<p>You have been invited to join <a href=\"{baseUrl}\">{project.Name}</a></p>",
        $"<p>Please click the following link to create your account:</p>",
        $"<br />",
        $"<p><a href=\"{baseUrl}/dashboard/register/{inviteService.EncodeToken(invite)}\">Register</a></p>",
        $"<br />",
        $"<p>Thank you!</p>"
      )
    });

    return invite;
  }

  public class RemoveInviteInput
  {
    [Required] public Guid InviteId { get; set; }
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
