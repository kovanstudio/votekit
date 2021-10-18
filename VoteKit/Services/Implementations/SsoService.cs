using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Services.Implementations;

public class SsoService : ISsoService
{
  private readonly IDbContextFactory<VotekitCtx> _db;

  public SsoService(IDbContextFactory<VotekitCtx> db)
  {
    _db = db;
  }

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
        ValidateLifetime = false,
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

  public async Task<SsoConfig> GetSsoConfig(Project project)
  {
    await using var db = await _db.CreateDbContextAsync();
    var config = await db.SsoConfigs.FindAsync(project.Id);

    if (config == null)
    {
      config = new SsoConfig
      {
        ProjectId = project.Id,
        SsoKey = Guid.NewGuid()
      };

      await db.SsoConfigs.AddAsync(config);
      await db.SaveChangesWithValidationAsync();
    }

    return config;
  }
}
