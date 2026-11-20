/// Makes user text well-formed before the core reads it.
///
/// A Dart string can hold a lone UTF-16 surrogate, for example half of an
/// emoji cut off by `substring`. Ports that keep strings as UTF-8 can hold
/// ill-formed bytes instead. Neither has a meaning another port could
/// reproduce, so every port replaces them with U+FFFD first, the same as
/// JavaScript's `String.prototype.toWellFormed()`.
library;

/// Returns [value] with every lone surrogate replaced by U+FFFD. A
/// well-formed string comes back unchanged.
String wellFormed(String value) {
  StringBuffer? result;
  var start = 0;

  for (var i = 0; i < value.length; i++) {
    final unit = value.codeUnitAt(i);

    if (unit < 0xD800 || unit > 0xDFFF) {
      continue;
    }

    if (unit <= 0xDBFF && i + 1 < value.length) {
      final next = value.codeUnitAt(i + 1);

      if (next >= 0xDC00 && next <= 0xDFFF) {
        // A valid pair: keep both units.
        i++;
        continue;
      }
    }

    (result ??= StringBuffer())
      ..write(value.substring(start, i))
      ..writeCharCode(0xFFFD);
    start = i + 1;
  }

  if (result == null) {
    return value;
  }

  return (result..write(value.substring(start))).toString();
}
