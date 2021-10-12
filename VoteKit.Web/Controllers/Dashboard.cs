
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VoteKit.Auth;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Web.Controllers;

[Route("/dashboard")]
public class Dashboard : Controller
{
  [Route("{**all}")]
  [HttpGet]
  public IActionResult Index()
  {
    if (HttpContext.GetProject() == null)
      return Redirect("/dashboard/setup");
    
    return View("Index");
  }

  [Route("setup")]
  [HttpGet]
  public IActionResult GetSetup()
  {
    return View("Setup");
  }

  public class SetupData
  {
    [Required(ErrorMessage = "Project Name is required")]
    [MaxLength(250, ErrorMessage = "Project Name can not be longer than 250 characters")]
    public string ProjectName { get; set; } = null!;
    
    [DisplayName("Email")]
    [EmailAddress]
    [Required]
    public string Email { get; set; } = null!;
    
    [Required]
    [StringLength(1000, MinimumLength = 3, ErrorMessage = "Password should be longer than 3 characters")]
    public string Password { get; set; } = null!;
    
    [DisplayName("Password (Repeat)")]
    [Compare("Password", ErrorMessage = "Password (Repeat) does not match the Password")]
    public string PasswordRepeat { get; set; } = null!;
  }

  [Route("setup")]
  [HttpPost]
  public async Task<IActionResult> PostSetup([FromForm] SetupData data, [FromServices] IDbContextFactory<VotekitCtx> dbFactory)
  {
    if (!ModelState.IsValid)
      return View("Setup", data);
    
    await using (var db = await dbFactory.CreateDbContextAsync())
    {
      var proj = await db.Projects.OrderBy(p => p.Id).FirstOrDefaultAsync();

      if (proj == null)
      {
        await using (var trans = await db.Database.BeginTransactionAsync())
        {
          proj = await db.Projects.OrderBy(p => p.Id).FirstOrDefaultAsync();

          if (proj == null)
          {
            proj = Project.Create(data.ProjectName);
          
            await db.Projects.AddAsync(proj);

            var admin = new User
            {
              Id = Guid.NewGuid(),
              ProjectId = proj.Id,
              Email = data.Email,
              Password = data.Password,
              Role = UserRole.Admin
            };

            await db.Users.AddAsync(admin);
            await db.SaveChangesWithValidationAsync();
          }

          await trans.CommitAsync();
        }
      }
    }

    return Redirect("/dashboard/login");
  }
}
