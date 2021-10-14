using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;

namespace VoteKit.Util;

public static class Hash
{
  public static string MD5Hash(string input)
  {
    using var md5 = MD5.Create();
    var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
    return Hex.ToHex(hash);
  }

  public static string HashPassword(string password, byte[] salt)
  {
    var hashed = KeyDerivation.Pbkdf2(
      password,
      salt,
      KeyDerivationPrf.HMACSHA256,
      10000,
      32);

    return Hex.ToHex(hashed);
  }
}
