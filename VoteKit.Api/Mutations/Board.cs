using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Api.Mutations;

public partial class Mutation
{
  public class AddBoardInput
  {
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public string Slug { get; set; } = string.Empty;
    [Required] public bool IsPrivate { get; set; }
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<Board> AddBoard([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] AddBoardInput input)
  {
    var board = Board.Create(project.Id, input.Name);

    board.Slug = input.Slug;
    board.IsPrivate = input.IsPrivate;

    await db.Boards.AddAsync(board);

    try
    {
      await db.SaveChangesWithValidationAsync();
    }
    catch (Exception e) when (e.InnerException is PostgresException { SqlState: "23505" })
    {
      throw new GqlException("Board URL already in use. Please try another one.", "DUPLICATE_SLUG");
    }
    catch (Exception e) when (e.InnerException is SqliteException { SqliteErrorCode: 19 })
    {
      throw new GqlException("Board URL already in use. Please try another one.", "DUPLICATE_SLUG");
    }

    return board;
  }

  public class SaveBoardInput
  {
    [Required] public Guid BoardId { get; set; }
    public string? Name { get; set; }
    public string? Slug { get; set; }
    public bool? IsListed { get; set; }
    public bool? IsPrivate { get; set; }
    public bool? IsSeoIndexed { get; set; }
    public string? Color { get; set; }
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<Board> SaveBoard([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] SaveBoardInput input)
  {
    var board = await db.Boards.FirstOrDefaultAsync(b => b.Id == input.BoardId && b.ProjectId == project.Id);

    if (board == null)
      throw VoteKitException.NotFound;

    board.Name = input.Name ?? board.Name;
    board.Slug = input.Slug ?? board.Slug;
    board.IsPrivate = input.IsPrivate ?? board.IsPrivate;
    board.IsListed = input.IsListed ?? board.IsListed;
    board.IsSeoIndexed = input.IsSeoIndexed ?? board.IsSeoIndexed;
    board.Color = input.Color ?? board.Color;

    if (await db.Boards.Where(x => x.ProjectId == board.ProjectId).AnyAsync(x => x.Slug == board.Slug && x.Id != board.Id))
      throw new GqlException("Board URL already in use. Please try another one.", "DUPLICATE_SLUG");

    try
    {
      await db.SaveChangesWithValidationAsync();
    }
    catch (Exception e) when (e.InnerException is PostgresException { SqlState: "23505" })
    {
      throw new GqlException("Board URL already in use. Please try another one.", "DUPLICATE_SLUG");
    }
    catch (Exception e) when (e.InnerException is SqliteException { SqliteErrorCode: 19 })
    {
      throw new GqlException("Board URL already in use. Please try another one.", "DUPLICATE_SLUG");
    }

    return board;
  }

  public class RemoveBoardInput
  {
    [Required] public Guid BoardId { get; set; }
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<OperationResult> RemoveBoard([Project] Project project, [ScopedService] VotekitCtx db, [Validatable] RemoveBoardInput input)
  {
    var board = await db.Boards.FirstOrDefaultAsync(b => b.Id == input.BoardId && b.ProjectId == project.Id);

    if (board == null)
      throw VoteKitException.NotFound;

    db.Boards.Remove(board);
    await db.SaveChangesWithValidationAsync();

    return OperationResult.Success;
  }
}
