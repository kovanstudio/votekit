using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Text.Unicode;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VoteKit.Auth;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Services;

namespace VoteKit.Web.Controllers;

public class FeedController : Controller
{
  public enum FeedMode
  {
    Standalone,
    Widget
  }

  public record FeedParameters(
    string? Mode,
    string? SsoToken
  );

  public record IndexModel(
    Project Project,
    FeedMode Mode = FeedMode.Standalone
  );

  [HttpGet("/{**all}")]
  public async Task<IActionResult> CatchAll(
    [FromQuery] FeedParameters? parameters,
    [FromServices] ISsoService ssoService,
    [FromServices] IAccessor accessor,
    [FromServices] IDbContextFactory<VotekitCtx> _db
  )
  {
    var project = HttpContext.GetProject();

    if (project == null)
    {
      if (Request.Path == "/")
        return Redirect("/dashboard/setup");
      else
        return NotFound();
    }

    if (parameters?.SsoToken != null)
    {
      var ssoConfig = await ssoService.GetSsoConfig(project);
      var userInfo = ssoService.DecodeSsoToken(ssoConfig.SsoKeyString, parameters.SsoToken);

      if (userInfo != null)
        await using (var db = await _db.CreateDbContextAsync())
        {
          var user = await db.Users.FirstOrDefaultAsync(u => u.ProjectId == project.Id && u.Email == userInfo.Email);

          if (user == null)
          {
            user = new User
            {
              Id = Guid.NewGuid(),
              Email = userInfo.Email,
              DisplayName = userInfo.DisplayName,
              ProjectId = project.Id,
              Role = UserRole.User,
              Password = ""
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesWithValidationAsync();
          }

          await accessor.SetUserAsync(user);
        }
    }

    return View("Index", new IndexModel(project, parameters?.Mode == "widget" ? FeedMode.Widget : FeedMode.Standalone));
  }
}
