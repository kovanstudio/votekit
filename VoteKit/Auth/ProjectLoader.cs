using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Data.Services;

namespace VoteKit.Auth
{
  public class ProjectLoaderMiddleware : IMiddleware
  {
    private readonly IDbContextFactory<VotekitCtx> _db;

    public ProjectLoaderMiddleware(IDbContextFactory<VotekitCtx> db)
    {
      _db = db;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
      await using (var db = await _db.CreateDbContextAsync())
      {
        var proj = await db.Projects.OrderBy(p => p.Id).FirstOrDefaultAsync();

        if (proj != null)
        {
          context.Items[nameof(Project)] = proj!;
        }
      }
      
      await next(context);
    }
  }

  public static class ProjectLoaderMiddlewareExtensions
  {
    public static Project? GetProject(this HttpContext ctx)
    {
      if (ctx.Items.TryGetValue(nameof(Project), out var project) && project is Project p)
        return p;

      return null;
    }
  }
}
