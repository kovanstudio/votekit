using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace VoteKit.Services.Implementations;

public class MailKitEmailServiceOptions
{
  public string From { get; set; } = null!;

  public string SmtpHost { get; set; } = null!;
  public int SmtpPort { get; set; }
  public string SmtpUser { get; set; } = null!;
  public string SmtpPass { get; set; } = null!;
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
      Subject = message.Subject
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
    await smtp.ConnectAsync(_options.SmtpHost, _options.SmtpPort, SecureSocketOptions.StartTls);

    if (!string.IsNullOrWhiteSpace(_options.SmtpUser))
      await smtp.AuthenticateAsync(_options.SmtpUser, _options.SmtpPass);

    await smtp.SendAsync(mimeMessage);
    await smtp.DisconnectAsync(true);
  }
}
