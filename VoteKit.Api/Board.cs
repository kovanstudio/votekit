using System;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Api;

public partial class Query
{
  [UseVotekitCtx]
  public IQueryable<Board> Boards([Project] Project project, [ScopedService] VotekitCtx db)
  {
    return db.Boards.Where(s => s.ProjectId == project.Id).OrderBy(b => b.CreatedAt);
  }
    
  [UseVotekitCtx]
  public async Task<Board?> Board([Project] Project project, [ScopedService] VotekitCtx db, Guid? id, string? slug)
  {
    var query = db.Boards.Where(b => b.ProjectId == project.Id);
      
    if (id.HasValue)
      query = query.Where(b => b.Id == id);
    else if (slug != null)
      query = query.Where(b => b.Slug == slug);
    else
      throw new GqlException("Either id or slug is required", "INVALID_ARGUMENTS");

    return await query.FirstOrDefaultAsync();
  }
}
  
public class BoardType : ExplicitObjectType<Board>
{
  protected override void Configure(IObjectTypeDescriptor<Board> descriptor)
  {
    base.Configure(descriptor);
      
    descriptor.Field(p => p.Id);
    descriptor.Field(p => p.Name);
    descriptor.Field(p => p.Slug);
    descriptor.Field(p => p.Color);
    descriptor.Field(p => p.ProjectId);
    descriptor.Field(p => p.CreatedAt);
    descriptor.Field(p => p.IsPrivate).Authorize("Editor");;
    descriptor.Field(p => p.IsSeoIndexed).Authorize("Editor");;
    descriptor.Field(p => p.IsListed).Authorize("Editor");
  }
}
