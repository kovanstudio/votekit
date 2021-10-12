using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;

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
}

public class InviteType : ExplicitObjectType<Invite>
{
  protected override void Configure(IObjectTypeDescriptor<Invite> descriptor)
  {
    base.Configure(descriptor);
      
    descriptor.Field(x => x.Id);
    descriptor.Field(x => x.Email);
    descriptor.Field(x => x.CreatedAt);
  }
}
