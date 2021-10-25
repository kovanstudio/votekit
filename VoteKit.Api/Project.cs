using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;
using VoteKit.Data.Services;
using VoteKit.Services;

namespace VoteKit.Api;

public partial class Query
{
  public Project? Project([Project] Project project)
  {
    return project;
  }
}

public enum ProjectAuthMethod
{
  None,
  Password,
  Mail,
  Redirect
}

[ExtendObjectType(typeof(Project))]
public class ProjectResolvers
{
  public async Task<Image?> LogoImage([Parent] Project project, [Service] IProjectService projects)
  {
    return await projects.LogoImageAsync(project);
  }

  public async Task<Image?> FaviconImage([Parent] Project project, [Service] IProjectService projects)
  {
    return await projects.FaviconImageAsync(project);
  }

  public async Task<string> LogoURL([Parent] Project project, [Service] IProjectService projects)
  {
    return await projects.LogoUrlAsync(project);
  }

  public async Task<string> FaviconURL([Parent] Project project, [Service] IProjectService projects)
  {
    return await projects.FaviconUrlAsync(project);
  }

  public async Task<ProjectAuthMethod> AuthMethod(
    [Parent] Project project,
    [Service] ISsoService ssoService,
    [Service] IEmailService emailService
  )
  {
    var ssoConfig = await ssoService.GetSsoConfig(project);

    if (ssoConfig.LoginUrl != null)
      return ProjectAuthMethod.Redirect;
    else if (emailService.IsOperational)
      return ProjectAuthMethod.Mail;

    return ProjectAuthMethod.Password;
  }

  [Authorize(Policy = "Admin")]
  public async Task<SsoConfig> SsoConfig([Parent] Project project, [Service] ISsoService ssoService)
  {
    return await ssoService.GetSsoConfig(project);
  }
}

public class ProjectType : ExplicitObjectType<Project>
{
  protected override void Configure(IObjectTypeDescriptor<Project> descriptor)
  {
    base.Configure(descriptor);

    descriptor.Field(x => x.Id);
    descriptor.Field(x => x.Name);
    descriptor.Field(x => x.Website);
    descriptor.Field(x => x.CreatedAt).Authorize("Editor");
  }
}
