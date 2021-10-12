using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Auth
{
  public class UserAuthenticationEvents: CookieAuthenticationEvents
  {
    private readonly IDbContextFactory<VotekitCtx> _db;

    public UserAuthenticationEvents(IDbContextFactory<VotekitCtx> db)
    {
      _db = db;
    }

    public override async Task ValidatePrincipal(CookieValidatePrincipalContext context)
    {
      var principal = context.Principal;
      var project = context.HttpContext.GetProject();

      if (project == null || principal == null)
        return;
      
      if (principal.TryGetIdClaim(ClaimTypes.Name, out var id))
      {
        await using var db = await _db.CreateDbContextAsync();
        
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id && u.ProjectId == project.Id);

        if (user != null)
        {
          var claims = new List<Claim> { new(ClaimTypes.Role, user.Role.ToString()) };
          principal.AddIdentity(new ClaimsIdentity(claims));
          return;
        }
      }

      context.RejectPrincipal();
      await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    }
  }
}
