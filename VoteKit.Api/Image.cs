using System;
using System.Collections.Specialized;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Data.Services;
using VoteKit.Services;

namespace VoteKit.Api;

[ExtendObjectType(typeof(Query))]
public class QueryResolversForImage
{
  [UseVotekitCtx]
  public async Task<Image?> Image([ScopedService] VotekitCtx db, Guid id)
  {
    return await db.Images.FindAsync(id);
  }
}
  
[ExtendObjectType(typeof(Image))]
public class ImageResolvers
{
  public string Url([Parent] Image image, [Service] IImageService images, int width = 256)
  {
    return images.Url(image, new NameValueCollection
    {
      { "width", width.ToString() }
    });
  }
}
  
public class ImageType : ExplicitObjectType<Image>
{
  protected override void Configure(IObjectTypeDescriptor<Image> descriptor)
  {
    base.Configure(descriptor);

    descriptor.Field(x => x.Id);
    descriptor.Field(x => x.Format);
    descriptor.Field(x => x.Width);
    descriptor.Field(x => x.Height);
  }
}
