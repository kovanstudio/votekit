using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using VoteKit.Auth;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Services
{
  public interface IAccessor
  {
    UserRole Role { get; }
    Guid? UserId { get; }
    
    Task<User?> GetUserAsync();
    
    Task SetUserAsync(User user);
    Task ClearUserAsync();

    Task<bool> AuthorizeAsync(string policy);
  }
  
  public class Accessor : IAccessor
  {
    private readonly IHttpContextAccessor _ctx;
    private readonly IAuthorizationService _auth;
    private readonly IDbContextFactory<VotekitCtx> _db;

    public Accessor(IHttpContextAccessor ctx, IAuthorizationService auth, IDbContextFactory<VotekitCtx> db)
    {
      _ctx = ctx;
      _auth = auth;
      _db = db;
    }

    public UserRole Role
    {
      get
      {
        var ctx = _ctx.HttpContext;
        
        if (ctx?.User.Identity?.IsAuthenticated != true)
          return UserRole.Visitor;
        
        var role = ctx.User?.FindFirst(c => c.Type == ClaimTypes.Role);

        if (role is null)
          return UserRole.Visitor;

        if (Enum.TryParse(role.Value, out UserRole r))
          return r;

        return UserRole.Visitor;
      }
    }

    public Guid? UserId
    {
      get
      {
        var ctx = _ctx.HttpContext;
        
        if (ctx?.User.Identity?.IsAuthenticated != true)
          return null;

        if (ctx.User.TryGetIdClaim(ClaimTypes.Name, out var userId))
          return userId;

        return null;
      }
    }

    public async Task<User?> GetUserAsync()
    {
      var ctx = _ctx.HttpContext;
      var project = ctx?.GetProject();

      if (ctx?.User.Identity?.IsAuthenticated != true || project == null)
        return null;

      if (ctx.User.TryGetIdClaim(ClaimTypes.Name, out var userId))
      {
        await using var db = _db.CreateDbContext();
        return await db.Users.FirstOrDefaultAsync(u => u.Id == userId && u.ProjectId == project.Id);
      }

      return null;
    }

    public async Task SetUserAsync(User? user)
    {
      var ctx = _ctx.HttpContext;

      if (ctx == null)
        return;

      if (user == null)
      {
        await ClearUserAsync();
        return;
      }

      var claims = new List<Claim>
      {
        new(ClaimTypes.Name, user.Id.ToString()),
        new(ClaimTypes.Email, user.Email),
      };

      var claimsIdentity = new ClaimsIdentity(
        claims,
        CookieAuthenticationDefaults.AuthenticationScheme
      );

      await ctx.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(claimsIdentity),
        new AuthenticationProperties
        {
          AllowRefresh = true,
          IsPersistent = true
        }
      );
    }

    public async Task ClearUserAsync()
    {
      var ctx = _ctx.HttpContext;

      if (ctx != null)
        await ctx.SignOutAsync();
    }

    public async Task<bool> AuthorizeAsync(string policy)
    {
      var ctx = _ctx.HttpContext;
      
      if (ctx is null)
        return false;
      
      var res = await _auth.AuthorizeAsync(ctx.User, policy);
      return res.Succeeded;
    }
  }
}
