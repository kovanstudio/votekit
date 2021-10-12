using System;

namespace VoteKit
{
  public class VoteKitException : Exception
  {
    public static VoteKitException NotFound => new("Not Found", "NOT_FOUND");
    public static VoteKitException AccessDenied => new("Access Denied", "ACCESS_DENIED");
    public static VoteKitException UserRequired => new("User Required", "USER_REQUIRED");

    public static readonly VoteKitException NotAuthorized = new("You don't have the necessary permissions", "AUTH_NOT_AUTHORIZED");
    public static VoteKitException NotAuthenticated = new("You are not logged in", "AUTH_NOT_AUTHENTICATED");

    public string Code { get; private set; }

    public VoteKitException(string code = "EXCEPTION") : base()
    {
      Code = code;
    }

    public VoteKitException(string message, string code = "EXCEPTION") : base(message)
    {
      Code = code;
    }
  }
  
  public class GqlException : VoteKitException
  {
    public GqlException(string code) : base(code)
    {
    }

    public GqlException(string message, string code) : base(message, code)
    {
    }
  }
}
