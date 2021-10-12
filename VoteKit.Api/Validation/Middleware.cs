using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Resolvers;
using HotChocolate.Types;

namespace VoteKit.Api.Validation
{
  public class ValidatorMiddleware
  {
    private readonly FieldDelegate _next;

    public ValidatorMiddleware(FieldDelegate next)
    {
      _next = next;
    }

    private static Action<IInputField> ReportErrorFactory(IMiddlewareContext context)
    {
      return argument =>
      {
        if (context.ArgumentValue<object>(argument.Name) is not { } item)
          return;

        var validationResults = new List<ValidationResult>();

        if (ValidateItem(argument.ContextData, item, context.Services, validationResults))
          return;

        foreach (var validationResult in validationResults)
        {
          context.ReportError(
            ErrorBuilder.New()
              .SetMessage(validationResult.ErrorMessage ?? "Unspecified Error")
              .SetCode("VALIDATION_FAIL")
              .Build()
          );
        }

        validationResults.Clear();
      };
    }

    private static bool ValidateItem(
      IReadOnlyDictionary<string, object?> context,
      object item,
      IServiceProvider serviceProvider,
      List<ValidationResult> validationResults
    )
    {
      
      return context.TryGetValue(nameof(ValidationAttribute), out var attrs) && attrs is IEnumerable<ValidationAttribute> attributes
        ? Validator.TryValidateValue(item, new ValidationContext(item, serviceProvider, default), validationResults, attributes)
        : Validator.TryValidateObject(item, new ValidationContext(item, serviceProvider, default), validationResults, true);
    }

    private static void ValidateInputs(IMiddlewareContext context)
    {
      if (context.Selection.Field.Arguments is not { Count: > 0 } arguments)
        return;

      arguments
        .AsParallel()
        .Where(argument =>
          argument.ContextData.ContainsKey(nameof(ValidatableAttribute)) || argument.ContextData.ContainsKey(nameof(ValidationAttribute)))
        .ForAll(ReportErrorFactory(context));
    }

    public async Task InvokeAsync(IMiddlewareContext context)
    {
      ValidateInputs(context);

      if (!context.HasErrors)
        await _next(context).ConfigureAwait(false);
    }
  }
}
