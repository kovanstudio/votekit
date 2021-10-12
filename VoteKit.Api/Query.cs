using System;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Api;

public record Config(string BasePath, Guid EmptyGuid);

public partial class Query
{
  public string Echo(string input) => input;

  public Config Config([Service] IConfiguration cnf)
  {
    return new Config(cnf["HTTP:BasePath"], Guid.Empty);
  }
}
  
public enum OperationResult {
  Success,
  Fail
}
  
public enum OrderBy
{
  Asc,
  Desc
}
  
public enum VoteDelta
{
  Up,
  Down
}
