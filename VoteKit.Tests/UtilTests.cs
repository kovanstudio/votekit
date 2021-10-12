using System;
using VoteKit.Util;
using Xunit;

namespace VoteKit.Tests
{
  public class UtilTests
  {
    [Fact]
    public void Hex_To_From()
    {
      var hex = "12aa75";
      var bytes = new byte[] { 18, 170, 117 };

      Assert.Equal(bytes, Hex.FromHex(hex));
      Assert.Equal(hex, Hex.ToHex(bytes));
      Assert.Equal(Array.Empty<byte>(), Hex.FromHex(""));
    }

    [Fact]
    public void Hash_MD5()
    {
      Assert.Equal("033bd94b1168d7e4f0d644c3c95e35bf", Hash.MD5Hash("TEST"));
    }

    [Fact]
    public void Hash_HashPassword()
    {
      var hash = Hash.HashPassword("TEST", new byte[] { 1, 2, 3, 4 });

      Assert.Equal(64, hash.Length);
      Assert.Matches("[0-9a-f]+", hash);
    }
  }
}
