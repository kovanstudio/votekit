using HotChocolate.Types;
using VoteKit.Data.Models;

namespace VoteKit.Api;

public class SsoConfigType : ExplicitObjectType<SsoConfig>
{
  protected override void Configure(IObjectTypeDescriptor<SsoConfig> descriptor)
  {
    base.Configure(descriptor);

    descriptor.Authorize("Admin");

    descriptor.Field("id").Resolve(x => x.Parent<SsoConfig>().ProjectId);
    descriptor.Field(x => x.LoginUrl);
    descriptor.Field(x => x.LogoutUrl);
    descriptor.Field("ssoKey").Resolve(x => x.Parent<SsoConfig>().SsoKeyString);
  }
}
