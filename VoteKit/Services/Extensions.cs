using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VoteKit.Data.Services;
using VoteKit.Services.Implementations;

namespace VoteKit.Services
{
  public static class ApplicationServiceExtensions
  {
    public static void AddApplicationServices(this IServiceCollection services, IConfiguration conf)
    {
      services.AddScoped<IAccessor, Accessor>();

      if (conf["Email:Service"] == "SMTP")
        services.AddSingleton<IEmailService, MailKitEmailService>();
      else
        services.AddSingleton<IEmailService, NoOpEmailService>();

      services.AddSingleton<IFileStore, FileSystemFileStore>();
      
      services.AddDataServices();
    }
  }
}
