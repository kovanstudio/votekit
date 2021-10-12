using System.Collections.Generic;
using System.Threading.Tasks;

namespace VoteKit.Services
{
  public class MailMessage
  {
    public string Subject { get; set; } = null!;
    public IEnumerable<string> ToEmails { get; set; } = new List<string>();
    public IEnumerable<string> BccEmails { get; set; } = new List<string>();
    public string HtmlContent { get; set; } = null!;
    public string TextContent { get; set; } = null!;
    public string Category { get; set; } = null!;
    public IDictionary<string, object> MetaData { get; set; } = new Dictionary<string, object>();
  }

  public interface IEmailService
  {
    Task SendEmailAsync(MailMessage message);
  }

  public class NoOpEmailService : IEmailService
  {
    public Task SendEmailAsync(MailMessage message)
    {
      return Task.CompletedTask;
    }
  }
}
