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
using VoteKit.Services;

namespace VoteKit.Web.Services;

public class ImageProvider : IImageProvider
{
  public class ImageResolver : IImageResolver
  {
    private readonly IFileStore _fileStore;
    private readonly IFileMetadata _metadata;

    public ImageResolver(IFileStore fileStore, IFileMetadata metadata)
    {
      _fileStore = fileStore;
      _metadata = metadata;
    }

    public Task<ImageMetadata> GetMetaDataAsync()
    {
      return Task.FromResult(new ImageMetadata(_metadata.LastModification ?? DateTime.Now, _metadata.Size));
    }

    public Task<Stream> OpenReadAsync()
    {
      return _fileStore.GetAsync(_metadata.FullPath);
    }
  }

  private readonly IFileStore _fileStore;

  public ImageProvider(IFileStore fileStore)
  {
    _fileStore = fileStore;
  }

  public bool IsValidRequest(HttpContext context)
  {
    return context.Request.Path.Value?.StartsWith("/img/") ?? false;
  }

  public async Task<IImageResolver?> GetAsync(HttpContext context)
  {
    try
    {
      var fi = await _fileStore.GetMetadataAsync(context.Request.Path.Value!);
      return new ImageResolver(_fileStore, fi);
    }
    catch (FileNotFoundException)
    {
    }

    return null;
  }

  public ProcessingBehavior ProcessingBehavior => ProcessingBehavior.All;
  public Func<HttpContext, bool> Match { get; set; } = _ => true;
}
