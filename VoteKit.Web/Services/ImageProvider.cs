using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Web;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Resolvers;

namespace VoteKit.Web.Services
{
  public class ImageProvider : IImageProvider
  {
    private readonly string _rootPath;

    public ImageProvider(IConfiguration configuration, IWebHostEnvironment host)
    {
      _rootPath = Path.Combine(configuration["DataDir"] ?? Path.Combine(host.ContentRootPath, "data"), "img");
    }

    public bool IsValidRequest(HttpContext context)
    {
      return context.Request.Path.Value?.StartsWith("/img") ?? false;
    }

    public Task<IImageResolver> GetAsync(HttpContext context)
    {
      var fp = new PhysicalFileProvider(_rootPath);
      var fi = fp.GetFileInfo(context.Request.Path.Value!.Substring("/img".Length));

      if (!fi.Exists)
        return Task.FromResult<IImageResolver>(null!);

      var metadata = new ImageMetadata(fi.LastModified.UtcDateTime, fi.Length);
      return Task.FromResult<IImageResolver>(new PhysicalFileSystemResolver(fi, metadata));
    }

    public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;
    public Func<HttpContext, bool> Match { get; set; } = _ => true;
  }
}
