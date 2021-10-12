using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Api.Mutations;

public partial class Mutation
{
  public class AddStatusInput
  {
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string Color { get; set; } = null!;
      
    public int? SortIndex { get; set; }
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<Status> AddStatus([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] AddStatusInput input)
  {
    var status = new Status
    {
      Id = Guid.NewGuid(),
      ProjectId = project.Id,
      Name = input.Name,
      Color = input.Color,
      SortIndex = input.SortIndex ?? 0
    };

    await db.Statuses.AddAsync(status);
    await db.SaveChangesWithValidationAsync();

    return status;
  }
    
  public class SaveStatusInput
  {
    [Required]
    public Guid StatusId { get; set; }
    public string? Name { get; set; }
    public string? Color { get; set; }
    public int? SortIndex { get; set; }
      
    public bool? IsDefault { get; set; }
    public bool? IsInRoadmap { get; set; }
  }
    
  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<Status> SaveStatus([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] SaveStatusInput input)
  {
    await using var trans = await db.Database.BeginTransactionAsync();
      
    var status = await db.Statuses.FirstOrDefaultAsync(s => s.Id == input.StatusId && s.ProjectId == project.Id);

    if (status == null)
      throw VoteKitException.NotFound;

    status.Name = input.Name ?? status.Name;
    status.Color = input.Color ?? status.Color;
    status.SortIndex = input.SortIndex ?? status.SortIndex;

    if (input.IsDefault != null)
    {
      if (!input.IsDefault.Value)
        throw new GqlException("Unable to turn off default status, promote another status to default", "SET_DEFAULT_FALSE");
        
      var currentDefault = await db.Statuses.FirstOrDefaultAsync(s => s.ProjectId == project.Id && s.IsDefault);

      if (currentDefault != null)
        currentDefault.IsDefault = false;

      status.IsDefault = true;
    }

    if (input.IsInRoadmap != null)
      status.IsInRoadmap = input.IsInRoadmap.Value;

    await db.SaveChangesWithValidationAsync();
    await trans.CommitAsync();

    return status;
  }
    
  public class RemoveStatusInput
  {
    [Required]
    public Guid StatusId { get; set; }
  }
    
  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<OperationResult> RemoveStatus([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] RemoveStatusInput input)
  {
    await using var trans = await db.Database.BeginTransactionAsync();
      
    var status = await db.Statuses.FirstOrDefaultAsync(s => s.Id == input.StatusId && s.ProjectId == project.Id);

    if (status == null)
      throw VoteKitException.NotFound;
      
    if (status.IsDefault)
      throw new GqlException("Can not remove the default status", "REMOVE_DEFAULT_STATUS");

    if (await db.Statuses.CountAsync(x => x.ProjectId == status.ProjectId) <= 1)
      throw new GqlException("Can not remove the last available status", "REMOVE_LAST_STATUS");

    var defaultStatus = await db.Statuses.FirstOrDefaultAsync(s => s.ProjectId == project.Id && s.IsDefault);
        
    if (defaultStatus == null)
      throw VoteKitException.NotFound;

    foreach (var entry in db.Entries.Where(e => e.StatusId == status.Id))
      entry.StatusId = defaultStatus.Id;

    db.Statuses.Remove(status);
      
    await db.SaveChangesWithValidationAsync();
    await trans.CommitAsync();

    return OperationResult.Success;
  }
}
