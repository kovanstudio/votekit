using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Execution;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Snapshooter.Xunit;
using VoteKit.Api;
using Xunit;

namespace VoteKit.Tests.Api;

public class QueryTests : IAsyncLifetime
{
  private IRequestExecutor _requestExecutor;

  [Fact]
  public async Task Query_Config()
  {
    var res = await _requestExecutor.ExecuteAsync("{ config { basePath, emptyGuid } }");
    res.MatchSnapshot();
  }

  public async Task InitializeAsync()
  {
    var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string>
    {
      { "HTTP:BasePath", "http://localhost:3000/" }
    }).Build();

    _requestExecutor = await new ServiceCollection()
      .AddSingleton<IConfiguration>(config)
      .AddGraphQL()
      .BuildApi()
      .BuildRequestExecutorAsync();
  }

  public Task DisposeAsync()
  {
    return Task.CompletedTask;
  }
}
