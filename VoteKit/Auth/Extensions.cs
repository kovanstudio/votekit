using System;
using System.Linq;
using System.Security.Claims;

namespace VoteKit.Auth
{
  public static class ClaimsPrincipalExtensions
  {
    public static bool TryGetClaim(this ClaimsPrincipal user, string claim, out string value)
    {
      var foundvalue = user.Claims.FirstOrDefault(c => c.Type == claim)?.Value;

      if (foundvalue != null)
      {
        value = foundvalue;
        return true;
      }

      value = string.Empty;
      return false;
    }
    
    public static bool TryGetIdClaim(this ClaimsPrincipal user, string claim, out Guid id)
    {
      var idstring = user.Claims.FirstOrDefault(c => c.Type == claim)?.Value;

      if (!(idstring is null) && Guid.TryParse(idstring, out id))
      {
        return true;
      }

      id = Guid.Empty;
      return false;
    }
  }
}
