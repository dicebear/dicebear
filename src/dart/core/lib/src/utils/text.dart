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

/// How many levels of maps and lists the options may nest. No valid options
/// nest anywhere near this deep.
const int maxJsonDepth = 64;

/// What the caller reports when [exceedsMaxJsonDepth] holds.
const String maxJsonDepthMessage =
    'nesting is deeper than the $maxJsonDepth levels this port reads';

/// Returns whether [value] nests maps and lists deeper than [maxJsonDepth]
/// levels. A value that contains itself does.
///
/// Callers ask before anything else walks the value: [wellFormedJsonValue] and
/// the schema validator both follow the nesting with recursion, and input this
/// deep would end in a [StackOverflowError] instead of an error the caller is
/// expected to catch. The search stops at the first branch that is too deep,
/// so a value that contains itself is found after [maxJsonDepth] steps.
bool exceedsMaxJsonDepth(Object? value) => _exceedsMaxJsonDepth(value, 1);

bool _exceedsMaxJsonDepth(Object? value, int depth) {
  if (value is Map) {
    if (depth > maxJsonDepth) {
      return true;
    }

    for (final entry in value.entries) {
      if (_exceedsMaxJsonDepth(entry.key, depth + 1) ||
          _exceedsMaxJsonDepth(entry.value, depth + 1)) {
        return true;
      }
    }

    return false;
  }

  if (value is List) {
    if (depth > maxJsonDepth) {
      return true;
    }

    for (final item in value) {
      if (_exceedsMaxJsonDepth(item, depth + 1)) {
        return true;
      }
    }
  }

  return false;
}

/// Deep-copies a decoded-JSON [value] like `deepCopyJsonValue`, applying
/// [wellFormed] to every string on the way: map keys, map values and list
/// items at any depth. Insertion order is preserved. A key that is not a
/// string is kept as it is, for the validator to turn down. Check
/// [exceedsMaxJsonDepth] first, since the copy follows the value's nesting.
Object? wellFormedJsonValue(Object? value) {
  if (value is String) {
    return wellFormed(value);
  }

  if (value is Map) {
    return <Object?, Object?>{
      for (final entry in value.entries)
        wellFormedJsonValue(entry.key): wellFormedJsonValue(entry.value),
    };
  }

  if (value is List) {
    return <Object?>[for (final item in value) wellFormedJsonValue(item)];
  }

  return value;
}
