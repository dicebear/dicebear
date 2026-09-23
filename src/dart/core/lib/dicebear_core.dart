/// Unique avatars from dozens of styles — deterministic, customizable,
/// vector-based.
///
/// The engine behind [DiceBear](https://www.dicebear.com). Pair it with the
/// style definitions from the `dicebear_styles` package:
///
/// ```dart
/// import 'package:dicebear_core/dicebear_core.dart';
/// import 'package:dicebear_styles/adventurer.dart';
///
/// void main() {
///   final style = Style.parse(adventurer);
///   final avatar = Avatar(style, {'seed': 'Felix'});
///
///   print(avatar.svg);
/// }
/// ```
library;

export 'src/avatar.dart' show Avatar;
export 'src/error/circular_color_reference_error.dart'
    show CircularColorReferenceError;
export 'src/error/options_validation_error.dart' show OptionsValidationError;
export 'src/error/style_validation_error.dart' show StyleValidationError;
export 'src/error/validation_error.dart'
    show ValidationError, ValidationErrorDetail;
export 'src/options_descriptor.dart' show OptionsDescriptor;
export 'src/style.dart' show Style;
