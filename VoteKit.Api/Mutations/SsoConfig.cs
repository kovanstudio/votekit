using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using VoteKit.Api.Validation;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Services;

namespace VoteKit.Api.Mutations;

public partial class Mutation
{
  public class SaveSsoConfigInput
  {
    [Url] public string? LoginUrl { get; set; }
    [Url] public string? LogoutUrl { get; set; }
  }

  [Authorize(Policy = "Admin")]
  [UseVotekitCtx]
  public async Task<SsoConfig> SaveSsoConfig(
    [Project] Project project,
    [ScopedService] VotekitCtx db,
    [Service] ISsoService ssoService,
    [Validatable] SaveSsoConfigInput input
  )
  {
    var ssoConfig = await ssoService.GetSsoConfig(project);

    db.Attach(ssoConfig);

    if (input.LoginUrl != null)
      ssoConfig.LoginUrl = string.IsNullOrWhiteSpace(input.LoginUrl) ? null : input.LoginUrl;

    if (input.LogoutUrl != null)
      ssoConfig.LogoutUrl = string.IsNullOrWhiteSpace(input.LogoutUrl) ? null : input.LogoutUrl;

    await db.SaveChangesWithValidationAsync();

    return ssoConfig;
  }
}
