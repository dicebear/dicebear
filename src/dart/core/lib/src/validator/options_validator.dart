/// Runtime validation of avatar options: the nesting depth limit, then the
/// shared JSON Schema.
library;

import '../error/options_validation_error.dart';
import '../error/validation_error.dart';
import 'options_schema_validator.dart';
import 'validator.dart';

/// Throws an [OptionsValidationError] when [data] is not valid avatar
/// options: nested too deeply, or in violation of the options schema.
void validateOptions(Object? data) {
  if (exceedsMaxJsonDepth(data)) {
    throw OptionsValidationError(const [
      ValidationErrorDetail(message: maxJsonDepthMessage),
    ]);
  }

  validateOptionsSchema(data);
}
