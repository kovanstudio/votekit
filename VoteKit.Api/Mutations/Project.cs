using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Api.Mutations;

public partial class Mutation
{
  public class SaveProjectInput
  {
    public string? Name { get; set; }
    public string? Website { get; set; }

    public Guid? LogoImageId { get; set; }
    public Guid? FaviconImageId { get; set; }
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<Project> SaveProject([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] SaveProjectInput input)
  {
    db.Attach(project);

    if (input.Name != null)
      project.Name = input.Name;

    if (input.Website != null)
      project.Website = input.Website;

    if (input.LogoImageId != null)
      project.LogoImageId = input.LogoImageId;

    if (input.FaviconImageId != null)
      project.FaviconImageId = input.FaviconImageId;

    await db.SaveChangesWithValidationAsync();

    return project;
  }
}
