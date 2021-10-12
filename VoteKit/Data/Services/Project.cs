using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Services;

namespace VoteKit.Data.Services
{
  public interface IProjectService
  {
    Task<Image?> LogoImageAsync(Project project);
    Task<Image?> FaviconImageAsync(Project project);
    Task<string> LogoUrlAsync(Project project);
    Task<string> FaviconUrlAsync(Project project);
  }
  
  public class ProjectService : IProjectService
  {
    private readonly IDbContextFactory<VotekitCtx> _db;
    private readonly IImageService _images;

    public ProjectService(IDbContextFactory<VotekitCtx> db, IImageService images)
    {
      this._db = db;
      this._images = images;
    }

    public async Task<Image?> LogoImageAsync(Project project)
    {
      if (!project.LogoImageId.HasValue)
        return null;

      await using var db = await _db.CreateDbContextAsync();
      return await db.Images.FirstOrDefaultAsync(x => x.Id == project.LogoImageId.Value);
    }

    public async Task<Image?> FaviconImageAsync(Project project)
    {
      if (!project.FaviconImageId.HasValue)
        return null;

      await using var db = await _db.CreateDbContextAsync();
      return await db.Images.FirstOrDefaultAsync(x => x.Id == project.FaviconImageId.Value);
    }

    public async Task<string> LogoUrlAsync(Project project)
    {
      var image = await LogoImageAsync(project);

      if (image != null)
        return _images.Url(image, new NameValueCollection { { "width", "200" }, {"rmode", "crop"} });

      if (project.Website != null)
      {
        var url = new Uri(project.Website);
        return $"https://logo.clearbit.com/{url.Host}?size=200";
      }

      return "/images/logo-placeholder.jpg";
    }

    public async Task<string> FaviconUrlAsync(Project project)
    {
      var image = await FaviconImageAsync(project) ?? await this.LogoImageAsync(project);

      if (image != null)
        return _images.Url(image, new NameValueCollection
        {
          {"width", "200"},
          {"height", "200"},
          {"rmode", "crop"}
        });

      if (project.Website != null)
      {
        var url = new Uri(project.Website);
        return $"https://logo.clearbit.com/{url.Host}?size=100";
      }

      return "/images/logo-placeholder.jpg";
    }
  }
}
