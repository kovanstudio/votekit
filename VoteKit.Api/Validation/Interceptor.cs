using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using HotChocolate.Configuration;
using HotChocolate.Types.Descriptors.Definitions;

namespace VoteKit.Api.Validation
{
  public class ValidatorTypeInterceptor : TypeInterceptor
  {
    public override void OnBeforeCompleteType(
      ITypeCompletionContext completionContext,
      DefinitionBase? definition,
      IDictionary<string, object?> contextData
    )
    {
      if (definition is not ObjectTypeDefinition objectTypeDefinition)
        return;

      foreach (var field in objectTypeDefinition.Fields)
      {
        foreach (var argument in field.Arguments.Where(arg => arg.Parameter is not null))
        {
          if (
            argument.Parameter!.IsDefined(typeof(ValidatableAttribute), true)
            || argument.Parameter!.ParameterType.IsDefined(typeof(ValidatableAttribute), true)
          )
          {
            argument.ContextData[nameof(ValidatableAttribute)] = true;
            continue;
          }

          if (argument.Parameter!.GetCustomAttributes(typeof(ValidationAttribute), true) is { Length: > 0 } attributes)
            argument.ContextData[nameof(ValidationAttribute)] = attributes;
        }
      }
    }
  }
}
