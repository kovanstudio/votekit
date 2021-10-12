using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace VoteKit.Services.Implementations
{
  public class MailKitEmailServiceOptions
  {
    public string From { get; set; } = null!;
    
    public string SMTPHost { get; set; } = null!;
    public int SMTPPort { get; set; }
    public string SMTPUser { get; set; } = null!;
    public string SMTPPass { get; set; } = null!;
  }
  
  public class MailKitEmailService : IEmailService
  {
    private readonly MailKitEmailServiceOptions _options;

    public MailKitEmailService(IConfiguration configuration)
    {
      _options = configuration.GetSection("Email").Get<MailKitEmailServiceOptions>();
    }

    public async Task SendEmailAsync(MailMessage message)
    {
      var mimeMessage = new MimeMessage()
      {
        Subject = message.Subject,
      };
      
      mimeMessage.From.Add(MailboxAddress.Parse(_options.From));

      foreach (var to in message.ToEmails)
        mimeMessage.To.Add(MailboxAddress.Parse(to));

      foreach (var to in message.BccEmails)
        mimeMessage.To.Add(MailboxAddress.Parse(to));

      var bodyBuilder = new BodyBuilder();

      if (!string.IsNullOrWhiteSpace(message.TextContent))
        bodyBuilder.TextBody = message.TextContent;
      
      if (!string.IsNullOrWhiteSpace(message.HtmlContent))
        bodyBuilder.HtmlBody = message.HtmlContent;

      mimeMessage.Body = bodyBuilder.ToMessageBody();
      
      using var smtp = new SmtpClient();
      await smtp.ConnectAsync(_options.SMTPHost, _options.SMTPPort, SecureSocketOptions.StartTls);

      if (!string.IsNullOrWhiteSpace(_options.SMTPUser))
        await smtp.AuthenticateAsync(_options.SMTPUser, _options.SMTPPass);

      await smtp.SendAsync(mimeMessage);
      await smtp.DisconnectAsync(true);
    }
  }
}
