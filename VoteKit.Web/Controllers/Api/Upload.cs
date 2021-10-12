using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using VoteKit.Auth;
using VoteKit.Data;
using VoteKit.Data.Services;
using VoteKit.Services;

namespace VoteKit.Web.Controllers.Api;

public class Upload : Controller
{
  private readonly IDbContextFactory<VotekitCtx> _db;
  private readonly IAccessor _accessor;
  private readonly IConfiguration _config;
  private readonly IImageService _images;

  public Upload(IDbContextFactory<VotekitCtx> db, IAccessor accessor, IConfiguration config, IImageService images)
  {
    _db = db;
    _accessor = accessor;
    _config = config;
    _images = images;
  }

  public class UploadRequest
  {
    [Required] public IFormFile File { get; set; } = null!;
    [Required]
    public Guid ProjectId { get; set; } = Guid.Empty;
  }

  [HttpPost("/api/upload")]
  [Authorize]
  public async Task<IActionResult> UploadAsync([FromForm] UploadRequest req)
  {
    if (!ModelState.IsValid)
      throw new VoteKitException("Invalid input", "UPLOAD_ERROR");

    var project = HttpContext.GetProject();

    if (project == null)
      throw new VoteKitException("Invalid project", "UPLOAD_ERROR");

    var file = req.File!;

    if (file.Length > 20 * 1024 * 1024)
      throw new VoteKitException("File too large. Max upload size is 20MB", "UPLOAD_ERROR");

    if (!file.ContentType.StartsWith("image/"))
      throw new VoteKitException("Only images are allowed", "UPLOAD_ERROR");

    await using var readStream = file.OpenReadStream();
    var image = await _images.SaveFromAsync(readStream);

    image.ProjectId = project.Id;
    image.UserId = _accessor.UserId;

    await using var db = _db.CreateDbContext(); 

    await db.Images.AddAsync(image);
    await db.SaveChangesWithValidationAsync();

    return Json(new
    {
      image.Id,
      image.Format,
      image.Width,
      image.Height
    });
  }
}
