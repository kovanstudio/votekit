using System;
using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using VoteKit.Data.Models;

namespace VoteKit.Data.Services;

public interface IInviteService
{
  string EncodeToken(Invite invite);
  (Guid, DateTime)? DecodeToken(string token);
}

public class InviteService : IInviteService
{
  public record TokenData(Guid InviteId, DateTime CreatedAt);

  private readonly IDataProtectionProvider _dataProtectionProvider;

  public InviteService(IDataProtectionProvider dataProtectionProvider)
  {
    _dataProtectionProvider = dataProtectionProvider;
  }

  public string EncodeToken(Invite invite)
  {
    var protector = _dataProtectionProvider.CreateProtector("VoteKit.Data.Services.InviteService");
    var data = JsonSerializer.Serialize(new TokenData(invite.Id, DateTime.Now));
    var token = protector.Protect(data);

    return token;
  }

  public (Guid, DateTime)? DecodeToken(string token)
  {
    var protector = _dataProtectionProvider.CreateProtector("VoteKit.Data.Services.InviteService");
    var data = protector.Unprotect(token);
    var tokenData = JsonSerializer.Deserialize<TokenData>(data);

    if (tokenData == null)
      return null;

    return (tokenData.InviteId, tokenData.CreatedAt);
  }
}
