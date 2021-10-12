using BaseX;

namespace VoteKit.Util
{
  public class Base62
  {
    public static readonly Encoding Encoding = new("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }

  public class Base10
  {
    public static readonly Encoding Encoding = new("0123456789");
  }
}
