using System.Linq;
using HotChocolate;
using HotChocolate.Types;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Api;

public partial class Query
{
  [UseVotekitCtx]
  public IQueryable<Status> Statuses([Project] Project project, [ScopedService] VotekitCtx db)
  {
    return db.Statuses.Where(s => s.ProjectId == project.Id).OrderBy(s => s.SortIndex);
  }
}
  
public class StatusType : ExplicitObjectType<Status>
{
  protected override void Configure(IObjectTypeDescriptor<Status> descriptor)
  {
    base.Configure(descriptor);
      
    descriptor.Field(p => p.Id);
    descriptor.Field(p => p.Name);
    descriptor.Field(p => p.Color);
    descriptor.Field(p => p.SortIndex);
    descriptor.Field(p => p.ProjectId);
    descriptor.Field(p => p.IsDefault);
    descriptor.Field(p => p.IsInRoadmap);
  }
}
