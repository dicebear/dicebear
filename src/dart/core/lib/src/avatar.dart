/// Top-level entry point for rendering an avatar from a style and options.
library;

import 'options.dart';
import 'renderer.dart';
import 'resolver.dart';
import 'style.dart';

/// Top-level entry point for rendering an avatar from a style and options.
///
/// Construction immediately resolves and renders the SVG; the various
/// accessors return different serializations of that result. Throws an
/// `OptionsValidationError` on invalid options and a
/// `CircularColorReferenceError` when the style's colors reference each other
/// in a cycle.
class Avatar {
  final String _svg;
  final Map<String, Object?> _resolvedOptions;

  /// Resolves and renders an avatar for [style]. A `null` options map is
  /// treated as empty.
  factory Avatar(Style style, [Map<String, Object?>? options]) {
    final resolver = Resolver(style, Options(options));
    final svg = Renderer(style, resolver).render();

    return Avatar._(svg, resolver.resolved());
  }

  Avatar._(this._svg, this._resolvedOptions);

  /// Returns the rendered SVG markup.
  String get svg => _svg;

  /// Returns the rendered SVG markup.
  @override
  String toString() => _svg;

  /// Returns the avatar as a JSON-encodable map containing the SVG and the
  /// fully resolved options used to render it
  /// (`{'svg': ..., 'options': ...}`). `jsonEncode` picks this method up
  /// automatically.
  ///
  /// The options map is a fresh deep copy in first-resolution order, with
  /// unset (`null`) values dropped and whole-number values normalized to
  /// `int` — see [resolvedOptions].
  Map<String, Object?> toJson() => {
        'svg': _svg,
        'options': _normalizedOptions(),
      };

  /// Returns a deep copy of the fully resolved options used to render the
  /// avatar, in first-resolution order. The raw seed is deliberately
  /// excluded, and unset (`null`) entries are dropped — like
  /// `JSON.stringify` dropping `undefined` properties in the JS port.
  ///
  /// Whole-number values are exposed as `int` so that `jsonEncode` emits
  /// `128`, not `128.0` — the JSON envelope must match the other ports
  /// byte-for-byte (the engine computes in doubles throughout; the
  /// conversion happens only here, at the exposure boundary).
  Map<String, Object?> get resolvedOptions => _normalizedOptions();

  /// Returns the SVG encoded as a `data:image/svg+xml` URI.
  /// [Uri.encodeComponent] matches the JS `encodeURIComponent` contract for
  /// all well-formed input: every UTF-8 byte is percent-encoded except
  /// `A–Z a–z 0–9` and `-_.!~*'()`. An unpaired surrogate (only a style
  /// definition can bring one in, since the options replace any in `seed`
  /// and `title` with U+FFFD) is rejected here, mirroring the
  /// `URIError` the JS reference throws — Dart would otherwise silently
  /// substitute U+FFFD and diverge.
  String toDataUri() {
    for (var i = 0; i < _svg.length; i++) {
      final unit = _svg.codeUnitAt(i);

      if (unit >= 0xD800 && unit <= 0xDBFF) {
        final next = i + 1 < _svg.length ? _svg.codeUnitAt(i + 1) : 0;

        if (next >= 0xDC00 && next <= 0xDFFF) {
          i++;
          continue;
        }
      }

      if (unit >= 0xD800 && unit <= 0xDFFF) {
        throw ArgumentError.value(
          _svg,
          'svg',
          'contains an unpaired surrogate at code unit $i and cannot be '
              'percent-encoded (the JS reference throws URIError here)',
        );
      }
    }

    return 'data:image/svg+xml;charset=utf-8,${Uri.encodeComponent(_svg)}';
  }

  Map<String, Object?> _normalizedOptions() => {
        for (final entry in _resolvedOptions.entries)
          if (entry.value != null) entry.key: _numValue(entry.value),
      };

  /// Deep-copies a snapshot value, serializing numbers the way the JS port
  /// does: a whole number becomes a JSON integer (`256`), not a float
  /// (`256.0`). Fractional values and magnitudes at or beyond 2^53 (where
  /// `int` would lose the exact double value on the web) stay `double`.
  static Object? _numValue(Object? value) {
    if (value is double) {
      if (value == value.truncateToDouble() &&
          value.abs() < 9007199254740992.0) {
        return value.toInt();
      }

      return value;
    }

    if (value is List) {
      return [for (final item in value) _numValue(item)];
    }

    if (value is Map) {
      return {
        for (final entry in value.entries) entry.key: _numValue(entry.value),
      };
    }

    return value;
  }
}
