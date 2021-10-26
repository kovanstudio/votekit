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
    [Url] public string? LoginUrl { get; set; } = null!;
    [Url] public string? LogoutUrl { get; set; } = null!;
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

    ssoConfig.LoginUrl = string.IsNullOrWhiteSpace(input.LoginUrl) ? null : input.LoginUrl;
    ssoConfig.LogoutUrl = string.IsNullOrWhiteSpace(input.LogoutUrl) ? null : input.LogoutUrl;

    await db.SaveChangesWithValidationAsync();

    return ssoConfig;
  }
}
