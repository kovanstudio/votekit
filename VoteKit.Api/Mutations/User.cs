using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Data.Services;
using VoteKit.Services;
using VoteKit.Util;

namespace VoteKit.Api.Mutations;

public partial class Mutation
{
  public class LoginInput
  {
    [DefaultValue(false)] public bool Remember { get; set; } = false;

    [Required]
    [EmailAddress(ErrorMessage = "A valid email address is required")]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(4, ErrorMessage = "Password should be at least 4 characters long")]
    public string Password { get; set; } = null!;
  }

  [UseVotekitCtx]
  public async Task<OperationResult> LoginAsync(
    [Service] IAccessor accessor,
    [ScopedService] VotekitCtx db,
    [Project] Project project,
    [Validatable] LoginInput input
  )
  {
    var user = await db.Users.Where(m => m.Email == input.Email && m.ProjectId == project.Id).FirstOrDefaultAsync();

    if (user == null || !user.CheckPassword(input.Password))
      throw new GqlException("Email or password not valid", "ACCESS_DENIED");

    await accessor.SetUserAsync(user);

    return OperationResult.Success;
  }

  public async Task<OperationResult> LogoutAsync([Service] IAccessor accessor)
  {
    await accessor.ClearUserAsync();
    return OperationResult.Success;
  }

  public class RegisterInput
  {
    [MaxLength(250, ErrorMessage = "Display name is too long")]
    public string? DisplayName { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "A valid email address is required")]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(4, ErrorMessage = "Password should be at least 4 characters long")]
    public string Password { get; set; } = null!;

    public string? InviteToken { get; set; }
  }

  [UseVotekitCtx]
  public async Task<User> RegisterAsync(
    [Service] IAccessor accessor,
    [Service] IInviteService inviteService,
    [ScopedService] VotekitCtx db,
    [Project] Project project,
    [Validatable] RegisterInput input
  )
  {
    var user = new User
    {
      Id = Guid.NewGuid(),
      Email = input.Email,
      Password = input.Password,
      DisplayName = input.DisplayName,
      ProjectId = project.Id,
      Role = UserRole.User
    };

    if (input.InviteToken != null)
    {
      var data = inviteService.DecodeToken(input.InviteToken);

      if (!data.HasValue)
        throw new VoteKitException("Invalid invite token", "INVALID_INVITE_TOKEN");

      var (id, createdAt) = data.Value;
      var invite = await db.Invites.FirstOrDefaultAsync(i => i.ProjectId == project.Id && i.Id == id);

      if (invite == null)
        throw new VoteKitException("Invalid invite token", "INVALID_INVITE_TOKEN");

      user.Role = invite.Role;
      db.Invites.Remove(invite);
    }

    await db.Users.AddAsync(user);

    try
    {
      await db.SaveChangesWithValidationAsync();
    }
    catch (Exception e) when (e.InnerException is PostgresException { SqlState: "23505" })
    {
      throw new GqlException("Email address already in use", "DUPLICATE_EMAIL");
    }

    await accessor.SetUserAsync(user);

    return user;
  }

  public class SavePasswordInput
  {
    public string? CurrentPassword { get; set; }

    [Required]
    [MinLength(4, ErrorMessage = "New Password should be at least 4 characters long")]
    public string Password { get; set; } = null!;
  }

  [Authorize(Policy = "User")]
  [UseVotekitCtx]
  public async Task<OperationResult> SavePasswordAsync(
    [ScopedService] VotekitCtx db,
    [Service] IAccessor access,
    [Project] Project project,
    [Validatable] SavePasswordInput input
  )
  {
    var user = (await access.GetUserAsync())!;

    if (string.IsNullOrEmpty(input.CurrentPassword))
    {
      if (user.PasswordHash != null)
        throw new GqlException("Current password is not valid", "INVALID_PASSWORD");
    }
    else
    {
      if (!user.CheckPassword(input.CurrentPassword))
        throw new GqlException("Current password is not valid", "INVALID_PASSWORD");
    }

    db.Attach(user);

    user.Password = input.Password;

    await db.SaveChangesWithValidationAsync();
    await access.SetUserAsync(user);

    return OperationResult.Success;
  }

  public record SaveUserInput(
    [Required] [EmailAddress(ErrorMessage = "A valid email address is required")]
    string Email,
    [Required(ErrorMessage = "Display name is required.")]
    string DisplayName
  );

  [Authorize(Policy = "User")]
  [UseVotekitCtx]
  public async Task<User> SaveUserAsync(
    [ScopedService] VotekitCtx db,
    [Service] IAccessor access,
    [Project] Project project,
    [Validatable] SaveUserInput input
  )
  {
    var user = (await access.GetUserAsync())!;

    db.Attach(user);

    user.Email = input.Email;
    user.DisplayName = input.DisplayName;

    try
    {
      await db.SaveChangesWithValidationAsync();
    }
    catch (Exception e) when (e.InnerException is PostgresException { SqlState: "23505" })
    {
      throw new GqlException("Email address already in use", "DUPLICATE_EMAIL");
    }

    return user;
  }

  public class RemoveUserInput
  {
    [Required] public Guid UserId { get; set; }
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<OperationResult> RemoveUserAsync(
    [ScopedService] VotekitCtx db,
    [Service] IAccessor access,
    [Project] Project project,
    [Validatable] RemoveUserInput input
  )
  {
    if (access.UserId == input.UserId)
      throw new GqlException("You can not remove yourself from the project", "NO_REMOVE_SELF");

    var user = await db.Users
      .FirstOrDefaultAsync(x => x.ProjectId == project.Id && x.Id == input.UserId);

    if (user == null)
      throw VoteKitException.NotFound;

    db.Users.Remove(user);

    await db.SaveChangesAsync();

    return OperationResult.Success;
  }

  public class BeginPasswordlessLoginInput
  {
    [Required]
    [EmailAddress(ErrorMessage = "A valid email address is required")]
    public string Email { get; set; } = null!;
  }

  public async Task<string> BeginPasswordlessLogin(
    [Service] IDataProtectionProvider protectorProvider,
    [Service] IEmailService emailService,
    [Project] Project project,
    [Validatable] BeginPasswordlessLoginInput input
  )
  {
    var protector = protectorProvider.CreateProtector("VoteKit.Public.MutationUserResolvers");

    var secret = RandomLoginToken();
    var projectid = project.Id.ToByteArray();
    var mail = Encoding.UTF8.GetBytes(input.Email);
    var now = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());

    var tokenBytes = now.Concat(projectid).Concat(secret).Concat(mail).ToArray();
    var secretString = string.Join("", secret.Select(x => x.ToString()));

    await emailService.SendEmailAsync(new MailMessage
    {
      Subject = $"{project.Name} - Complete Login",
      ToEmails = new List<string> { input.Email },
      TextContent = string.Join("\r\n",
        $"Hi there!",
        $"",
        $"You have left your email address for logging in to {project.Name}",
        $"Please use the following token:",
        $"{secretString}",
        $"",
        $"Thank you!"
      )
    });

    return Base62.Encoding.Encode(protector.Protect(tokenBytes));
  }

  private byte[] RandomLoginToken()
  {
    var secret = new byte[6];
    using var rnd = RandomNumberGenerator.Create();
    rnd.GetBytes(secret);
    return secret.Select(x => (byte)(x % 10)).ToArray();
  }

  public class CompletePasswordlessLoginInput
  {
    [Required] public string Token { get; set; } = null!;
    [Required] public string Code { get; set; } = null!;
  }

  [UseVotekitCtx]
  public async Task<User> CompletePasswordlessLogin(
    [ScopedService] VotekitCtx db,
    [Service] IAccessor access,
    [Service] IDataProtectionProvider protectorProvider,
    [Service] IEmailService emailService,
    [Project] Project project,
    [Validatable] CompletePasswordlessLoginInput input
  )
  {
    var protector = protectorProvider.CreateProtector("VoteKit.Public.MutationUserResolvers");
    var token = protector.Unprotect(Base62.Encoding.Decode(input.Token));

    var date = DateTime.FromBinary(BitConverter.ToInt64(token[0..8]));
    var projectid = new Guid(token[8..24]);
    var secret = token[24..30];
    var email = Encoding.UTF8.GetString(token[30..]);

    if (project.Id != projectid)
      throw VoteKitException.NotFound;

    var secretString = string.Join("", secret.Select(x => x.ToString()));

    if (secretString != input.Code.Trim())
      throw new VoteKitException("Unable to verify code. Please try again", "INVALID_CODE");

    if (DateTime.UtcNow - date > TimeSpan.FromMinutes(20))
      throw new VoteKitException("Code expired. Please try again", "EXPIRED_CODE");

    var user = await db.Users.FirstOrDefaultAsync(u => u.ProjectId == project.Id && u.Email == email);

    if (user == null)
    {
      user = new User
      {
        ProjectId = project.Id,
        Email = email,
        Password = ""
      };

      await db.Users.AddAsync(user);
      await db.SaveChangesWithValidationAsync();
    }

    await access.SetUserAsync(user);
    return user;
  }
}
