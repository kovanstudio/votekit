using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace VoteKit.Util
{
  public static class Validation
  {
    public static void MustValidateObject(object argument)
    {
      if (!TryValidateObject(argument, out var results))
      {
        var messages = results.Select(r => r.ErrorMessage ?? "").ToList().Aggregate((message, nextMessage) => message + "\n" + nextMessage);
        throw new VoteKitException(messages, "VALIDATION_FAILED");
      }
    }

    public static bool TryValidateObject(object argument, out ICollection<ValidationResult> validationResults)
    {
      validationResults = new List<ValidationResult>();
      return Validator.TryValidateObject(argument, new ValidationContext(argument), validationResults, validateAllProperties: true);
    }
  }
}
