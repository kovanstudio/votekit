using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using VoteKit.Data.Models;
using VoteKit.Services;

namespace VoteKit.Data.Services
{
  public interface IImageService
  {
    string Url(Image image, NameValueCollection? options = null);
    Task<Image> SaveFromAsync(Stream input);
  }

  public class ImageService : IImageService
  {
    private readonly IFileStore _store;

    public ImageService(IFileStore store)
    {
      _store = store;
    }

    public string Url(Image image, NameValueCollection? options = null)
    {
      var path = "/img/" + image.Id.ToString();

      if (options?.Count > 0)
      {
        path += "?" + string.Join("&",
          options.AllKeys.OrderBy(k => k).Select(k => $"{HttpUtility.UrlEncode(k)}={HttpUtility.UrlEncode(options[k])}"));
      }

      return path;
    }

    public async Task<Image> SaveFromAsync(Stream input)
    {
      var ms = new MemoryStream();
      await input.CopyToAsync(ms);
      ms.Seek(0, SeekOrigin.Begin);

      var slImage = await SixLabors.ImageSharp.Image.IdentifyWithFormatAsync(ms);

      var image = new Image
      {
        Id = Guid.NewGuid(),
        FileSize = (int)ms.Length,
        Format = slImage.Format.DefaultMimeType,
        Width = slImage.ImageInfo.Width,
        Height = slImage.ImageInfo.Height
      };
      
      ms.Seek(0, SeekOrigin.Begin);
      await _store.Write($"img/{image.Id.ToString()}", ms);

      return image;
    }
  }
}
