using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
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
