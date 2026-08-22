/// Runtime validation of avatar options against the shared draft-07 JSON
/// Schema, which ships as the pure-data `dicebear_schema` package.
///
/// The compiled validator matches the ones the other ports use: every port must
/// accept and reject the same inputs (pinned by the `validation.json` parity
/// fixture); only the error message text is language-specific.
library;

import 'package:dicebear_schema/dicebear_schema.dart' as dicebear_schema;
import 'package:json_schema/json_schema.dart' as json_schema;

import '../error/options_validation_error.dart';
import 'validator.dart';

// A top-level `final` variable is initialized lazily on first read, so the
// schema is parsed and compiled exactly once and reused afterwards.
final json_schema.JsonSchema _optionsSchema = compileSchema(
  'options.min.json',
  dicebear_schema.options,
);

/// Throws an [OptionsValidationError] when [data] violates the options
/// schema.
void validateOptions(Object? data) {
  final details = collectErrors(_optionsSchema, data);

  if (details.isNotEmpty) {
    throw OptionsValidationError(details);
  }
}
