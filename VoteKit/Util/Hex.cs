
using System;
using System.Collections.Generic;
using System.Text;

namespace VoteKit.Util
{
  public static class Hex
  {
    public static string ToHex(IEnumerable<byte> bytes)
    {
      var sb = new StringBuilder();

      foreach (var t in bytes)
      {
        sb.Append(t.ToString("X2"));
      }

      return sb.ToString().ToLower();
    }

    public static byte[] FromHex(string hexString)
    {
      var bytes = new byte[hexString.Length / 2];

      for (var i = 0; i < bytes.Length; i++)
      {
        bytes[i] = Convert.ToByte(hexString.Substring(i * 2, 2), 16);
      }

      return bytes;
    }
  }
}
