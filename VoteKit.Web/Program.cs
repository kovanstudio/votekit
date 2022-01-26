using System;
using System.IO;
using System.Linq;
using System.Reflection.Metadata;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp.Web.Caching;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers;
using VoteKit.Api;
using VoteKit.Auth;
using VoteKit.Data;
using VoteKit.Services;
using VoteKit.Web;
using VoteKit.Web.Services;

[assembly: MetadataUpdateHandler(typeof(HotReloadManager))]

namespace VoteKit.Web;

internal static class HotReloadManager
{
  public static void ClearCache(Type[]? types)
  {
    if (types?.All(t => t.Namespace == "AspNetCoreGeneratedDocument") ?? false) return;

    Program.Restart();
  }
}

public static class Program
{
  private static WebApplication? _app;
  private static bool _restarting;

  public static void Restart()
  {
    _restarting = true;
    _app?.StopAsync().RunSynchronously();
  }

  public static void Main(string[] args)
  {
    do
    {
      _restarting = false;

      _app = BuildApplication(args);
      _app.Run();
    } while (_restarting);
  }

  private static WebApplication BuildApplication(string[] args)
  {
    var builder = WebApplication.CreateBuilder();

    if (builder.Environment.IsDevelopment())
      builder.WebHost.UseUrls("http://*:3000");
    else
      builder.WebHost.UseUrls("http://*:80");

    // Config
    builder.Configuration.AddEnvironmentVariables("VK_");
    builder.Configuration["DataDir"] ??= Path.Combine(builder.Environment.ContentRootPath, "data");
    builder.Configuration.AddJsonFile(Path.Join(builder.Configuration["DataDir"], "votekit.config.json"), true, true);

    if (!Directory.Exists(builder.Configuration["DataDir"]))
      Directory.CreateDirectory(builder.Configuration["DataDir"]);


    // Services
    builder.Services.AddHttpContextAccessor();

    if (builder.Configuration["DB:Provider"] == "pg")
      builder.Services.AddDbContextFactory<VotekitCtx>(options =>
        options.UseNpgsql(builder.Configuration["DB:ConnectionString"], o => { o.MigrationsAssembly("VoteKit.Migrations.PostgreSQL"); })
      );
    else
      builder.Services.AddDbContextFactory<VotekitCtx>(options =>
        options.UseSqlite(
          $"Filename={Path.Join(builder.Configuration["DataDir"], "database.db")}",
          o => { o.MigrationsAssembly("VoteKit.Migrations.SQLite"); }
        )
      );

    builder.Services.AddScoped<ProjectLoaderMiddleware>();
    builder.Services.AddScoped<UserAuthenticationEvents>();

    builder.Services.AddControllersWithViews();

    builder.Services
      .AddDataProtection()
      .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Configuration["DataDir"], "data-protection")));

    builder.Services
      .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
      .AddCookie(opts =>
        {
          opts.EventsType = typeof(UserAuthenticationEvents);
          opts.Cookie.Name = "vkauth";
          opts.Cookie.SameSite = SameSiteMode.None;
          opts.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
          opts.LoginPath = "/login";
        }
      );

    builder.Services.AddAuthorization(options =>
    {
      options.AddPolicy("User", p => p.RequireClaim(ClaimTypes.Role, "User", "Editor", "Admin"));
      options.AddPolicy("Editor", p => p.RequireClaim(ClaimTypes.Role, "Editor", "Admin"));
      options.AddPolicy("Admin", p => p.RequireClaim(ClaimTypes.Role, "Admin"));
    });

    builder.Services.AddSingleton<IImageProvider, ImageProvider>();
    builder.Services.AddImageSharp();

    builder.Services.Configure<PhysicalFileSystemCacheOptions>(c =>
    {
      c.CacheRoot = builder.Configuration["DataDir"];
      c.CacheFolder = "img-cache";
    });

    builder.Services.AddApplicationServices(builder.Configuration);
    builder.Services.AddApiServer();

    // Application

    var app = builder.Build();

    if (app.Environment.IsDevelopment()) app.UseDeveloperExceptionPage();

    app.UseImageSharp();
    app.UseStaticFiles();

    app.UseMiddleware<ProjectLoaderMiddleware>();

    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
      endpoints.MapControllers();
      endpoints.MapApiServer();
    });

    using (var db = app.Services.GetRequiredService<IDbContextFactory<VotekitCtx>>().CreateDbContext())
    {
      db.Database.Migrate();
    }

    return app;
  }
}
