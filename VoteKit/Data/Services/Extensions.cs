using Microsoft.Extensions.DependencyInjection;

namespace VoteKit.Data.Services;

public static class DataServiceExtensions
{
  public static void AddDataServices(this IServiceCollection services)
  {
    services.AddScoped<IProjectService, ProjectService>();
    services.AddScoped<IBoardService, BoardService>();
    services.AddScoped<IImageService, ImageService>();
    services.AddScoped<IInviteService, InviteService>();
  }
}
