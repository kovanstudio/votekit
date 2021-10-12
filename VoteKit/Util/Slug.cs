using System;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace VoteKit.Util
{
  public static class Slug
  {
    public static string RemoveAccents(string text)
    {
      if (string.IsNullOrWhiteSpace(text))
        return text;

      text = text.Normalize(NormalizationForm.FormD);
      char[] chars = text
          .Where(c => CharUnicodeInfo.GetUnicodeCategory(c)
          != UnicodeCategory.NonSpacingMark).ToArray();

      return new string(chars).Normalize(NormalizationForm.FormC);
    }

    public static string Slugify(string phrase, int maxLength = Int32.MaxValue)
    {
      string output = RemoveAccents(phrase).ToLower().Trim();

      output = Regex.Replace(output, @"[^A-Za-z0-9\s-]", "");
      output = Regex.Replace(output, @"\s+", " ").Trim();
      output = Regex.Replace(output, @"\s", "-");

      return output.Substring(0, Math.Min(maxLength, output.Length));
    }
  }
}
