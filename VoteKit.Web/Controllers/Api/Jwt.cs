using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using VoteKit.Auth;
using VoteKit.Data;
using VoteKit.Services;

namespace VoteKit.Web.Controllers.Api;

public class Jwt : Controller
{
  [HttpGet("/api/jwt-login")]
  public async Task<IActionResult> UploadAsync(
    [FromServices] VotekitCtx db,
    [FromServices] ISsoService ssoService,
    [FromQuery] [Url] string? returnUrl
  )
  {
    var project = HttpContext.GetProject();

    if (project == null)
      return NotFound();

    var sso = await ssoService.GetSsoConfig(project);

    if (sso.LoginUrl == null)
      return NotFound();

    returnUrl ??= Request.Scheme + Uri.SchemeDelimiter + Request.Host;

    var loginUrl = QueryHelpers.AddQueryString(sso.LoginUrl, "returnUrl", returnUrl);

    return Redirect(loginUrl);
  }
}
