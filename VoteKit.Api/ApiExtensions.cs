using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Serialization;
using HotChocolate.Execution;
using HotChocolate.Execution.Configuration;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using VoteKit.Api.Mutations;
using VoteKit.Api.Validation;
using VoteKit.Auth;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Api;

public static class ApiExtensions
{
  public static void AddApiServer(this IServiceCollection services)
  {
    services.AddGraphQLServer()
      .AddAuthorization()
      .BuildApi();

    services.AddHttpResultSerializer<MyCustomHttpResultSerializer>();
  }

  public static IRequestExecutorBuilder BuildApi(this IRequestExecutorBuilder builder)
  {
    var extendTypes = typeof(ApiExtensions).Assembly.GetTypes()
      .Where(t => t.GetCustomAttributes(typeof(ExtendObjectTypeAttribute), true).Length > 0)
      .ToArray();

    var objectTypes = typeof(ApiExtensions).Assembly.GetTypes()
      .Where(x => !x.IsAbstract && (typeof(ObjectType).IsAssignableFrom(x) || typeof(InputObjectType).IsAssignableFrom(x)))
      .ToArray();

    return builder.TryAddTypeInterceptor<ValidatorTypeInterceptor>()
      .UseField<ValidatorMiddleware>()
      .AddHttpRequestInterceptor<HttpRequestInterceptor>()
      .ModifyRequestOptions(o => { o.IncludeExceptionDetails = true; })
      .AddErrorFilter(error =>
      {
        if (error.Exception is VoteKitException e)
          return error.RemoveExtensions().WithCode(e.Code).WithMessage(e.Message);

        return error;
      })
      .AddSorting()
      .AddQueryType<Query>()
      .AddMutationType<Mutation>()
      .AddTypes(objectTypes)
      .AddTypes(extendTypes);
  }

  public static void MapApiServer(this IEndpointRouteBuilder endpoints)
  {
    endpoints.MapGraphQL("/gql");
  }
}
  
public class MyCustomHttpResultSerializer : DefaultHttpResultSerializer
{
  public override HttpStatusCode GetStatusCode(IExecutionResult result)
  {
    return HttpStatusCode.OK;
  }
}

public class HttpRequestInterceptor : DefaultHttpRequestInterceptor
{
  public override ValueTask OnCreateAsync(
    HttpContext context,
    IRequestExecutor requestExecutor,
    IQueryRequestBuilder requestBuilder,
    CancellationToken cancellationToken
  )
  {
    base.OnCreateAsync(context, requestExecutor, requestBuilder, cancellationToken);
      
    requestBuilder.TryAddProperty(nameof(Project), context.GetProject());

    return default;
  }
}

public class ProjectAttribute : GlobalStateAttribute
{
  public ProjectAttribute() : base(nameof(Project))
  {
  }
}

public class UseVotekitCtxAttribute : ObjectFieldDescriptorAttribute
{
  public override void OnConfigure(IDescriptorContext context, IObjectFieldDescriptor descriptor, MemberInfo member)
  {
    descriptor.UseDbContext<VotekitCtx>();
  }
}
  
public abstract class ExplicitObjectType<T> : ObjectType<T>
{
  protected override void Configure(IObjectTypeDescriptor<T> descriptor)
  {
    base.Configure(descriptor);
      
    descriptor.BindFields(BindingBehavior.Explicit);
  }
}
