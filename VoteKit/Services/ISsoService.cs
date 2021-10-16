using System.Collections.Generic;
using System.Threading.Tasks;
using VoteKit.Data.Models;

namespace VoteKit.Services;

public interface ISsoService
{
  public record UserInfo(
    string Id,
    string Email,
    string? DisplayName,
    Dictionary<string, string>? Data
  );

  UserInfo? DecodeSsoToken(string secret, string token);
}
