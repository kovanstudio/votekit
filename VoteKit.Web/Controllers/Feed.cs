using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Text.Unicode;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using VoteKit.Auth;
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
  public IActionResult CatchAll([FromQuery] FeedParameters? parameters, [FromServices] ISsoService ssoService)
  {
    var project = HttpContext.GetProject();

    if (project == null)
    {
      if (Request.Path == "/")
        return Redirect("/dashboard/setup");
      else
        return NotFound();
    }

    return View("Index", new IndexModel(project, parameters?.Mode == "widget" ? FeedMode.Widget : FeedMode.Standalone));
  }
}
