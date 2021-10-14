using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Text.Unicode;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using VoteKit.Auth;
using VoteKit.Data.Models;

namespace VoteKit.Web.Controllers;

public class FeedController : Controller
{
  public record IndexModel(Project Project);

  [HttpGet("/")]
  public IActionResult Index()
  {
    var project = HttpContext.GetProject();

    if (project == null)
      return Redirect("/dashboard/setup");

    return View("Index", new IndexModel(project));
  }

  [HttpGet("/{**all}")]
  public IActionResult CatchAll()
  {
    var project = HttpContext.GetProject();

    if (project == null)
      return NotFound();

    return View("Index", new IndexModel(project));
  }
}
