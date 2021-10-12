using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Data.Services;

namespace VoteKit.Api;

[ExtendObjectType(typeof(Query))]
public class InviteResolversOnQuery
{
  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<IEnumerable<Invite>> Invites([Project] Project project, [ScopedService] VotekitCtx db)
  {
    return await db.Invites
      .Where(x => x.ProjectId == project.Id && x.Status != InviteStatus.Deleted)
      .OrderByDescending(x => x.CreatedAt)
      .ToListAsync();
  }
  
  [UseVotekitCtx]
  public async Task<Invite> LookupInvite(
    [Project] Project project, 
    [ScopedService] VotekitCtx db,
    [Service] IInviteService inviteService,
    string token
    )
  {
    var data = inviteService.DecodeToken(token);

    if (!data.HasValue)
      throw VoteKitException.NotFound;

    var (id, createdAt) = data.Value;
    var invite = await db.Invites.FirstOrDefaultAsync(i => i.ProjectId == project.Id && i.Id == id);
    
    if (invite == null)
      throw VoteKitException.NotFound;

    return invite;
  }
}

public class InviteType : ExplicitObjectType<Invite>
{
  protected override void Configure(IObjectTypeDescriptor<Invite> descriptor)
  {
    base.Configure(descriptor);

    descriptor.Field(x => x.Id);
    descriptor.Field(x => x.Email);
    descriptor.Field(x => x.CreatedAt);

    descriptor.Field("token").Authorize("Admin").Resolve(x => x.Service<IInviteService>().EncodeToken(x.Parent<Invite>()));
  }
}
