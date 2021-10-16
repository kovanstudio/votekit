using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace VoteKit.Services.Implementations;

public class SsoService : ISsoService
{
  public ISsoService.UserInfo? DecodeSsoToken(string secret, string token)
  {
    var key = Encoding.ASCII.GetBytes(secret);
    var handler = new JwtSecurityTokenHandler();

    SecurityToken validatedToken;

    try
    {
      handler.ValidateToken(token, new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        ValidateActor = false,
        IssuerSigningKey = new SymmetricSecurityKey(key)
      }, out validatedToken);
    }
    catch
    {
      return null;
    }

    if (validatedToken is JwtSecurityToken jwtToken)
    {
      var id = jwtToken.Claims.FirstOrDefault(x => x.Type.ToLowerInvariant() == "id")?.Value;
      var email = jwtToken.Claims.FirstOrDefault(x => x.Type.ToLowerInvariant() == "email")?.Value;

      if (id == null || email == null)
        return null;

      var name = jwtToken.Claims.FirstOrDefault(x => x.Type.ToLowerInvariant() == "name")?.Value;
      var data = jwtToken.Claims
        .Where(x => !new string[]
        {
          "iss",
          "sub",
          "aud",
          "exp",
          "nbf",
          "iat",
          "jti"
        }.Contains(x.Type))
        .ToDictionary(x => x.Type, x => x.Value);

      return new ISsoService.UserInfo(id, email, name, data);
    }

    return null;
  }
}
