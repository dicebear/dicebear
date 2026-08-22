/// Numeric helpers shared by the PRNG and the renderer: SVG number
/// formatting and the JavaScript-compatible half-up rounding the rest of the
/// engine depends on for cross-language parity.
library;

/// Rounds half toward +∞, matching JavaScript's `Math.round`. Dart's
/// `num.round()` rounds half away from zero, and the naive
/// `(x + 0.5).floor()` over-rounds the largest double below 0.5; comparing
/// the fractional part against 0.5 reproduces `Math.round` exactly.
///
/// Unlike Go (which needs `//go:noinline` here to forbid FMA contraction),
/// Dart rounds every floating-point operation to a 64-bit double on both the
/// VM and the web, so an expression like `value * 100000.0` cannot fuse with
/// the subtraction below. Keep the multiply and the comparison as separate
/// operations anyway — the parity fixture `1.999995 → "2"` is the canary.
double roundHalfUp(double value) {
  final floor = value.floorToDouble();

  if (value - floor < 0.5) {
    return floor;
  }

  return floor + 1.0;
}

/// Formats a number for SVG output, rounded to at most 5 decimal places.
///
/// Rounding to a fixed precision keeps the output bounded and identical across
/// every port: every value becomes a multiple of 1e-5, which has no exponential
/// form, so the result is built from integer arithmetic with no
/// language-specific float stringifying. `double.toString()` must never be used
/// here — Dart renders integral doubles as `1.0` where JavaScript prints `1`.
String formatNumber(double value) {
  if (value.isNaN) {
    return 'NaN';
  }

  if (value == double.infinity) {
    return 'Infinity';
  }

  if (value == double.negativeInfinity) {
    return '-Infinity';
  }

  var scaled = roundHalfUp(value * 100000.0).toInt();
  final sign = scaled < 0 ? '-' : '';

  if (scaled < 0) {
    scaled = -scaled;
  }

  final integerPart = scaled ~/ 100000;
  final fraction = (scaled % 100000)
      .toString()
      .padLeft(5, '0')
      .replaceFirst(_trailingZeros, '');

  if (fraction.isEmpty) {
    return '$sign$integerPart';
  }

  return '$sign$integerPart.$fraction';
}

final _trailingZeros = RegExp(r'0+$');

/// Converts a number to the string JavaScript's `String(value)` produces.
///
/// Used wherever a number becomes a PRNG dedupe/sort key (e.g. `fontWeight`
/// lists), so the key must match the JS port byte for byte: integral values
/// print without a decimal point (`400`, not Dart's `400.0`).
///
/// The zero check comes first on purpose: on the web `-0.0 is int` is true
/// and dart2js prints `-0.0` (where JS prints `0`), so the naive integral
/// branch would silently diverge on the web only.
String jsNumString(num value) {
  if (value == 0) {
    return '0';
  }

  final d = value.toDouble();

  if (d.isNaN) {
    return 'NaN';
  }

  if (d == double.infinity) {
    return 'Infinity';
  }

  if (d == double.negativeInfinity) {
    return '-Infinity';
  }

  if (d == d.truncateToDouble() && d.abs() < 1e21) {
    // BigInt is exact for every integral double; `toInt()` would clamp
    // values at or above 2^63 on the VM, and JS prints e.g. String(1e20)
    // as "100000000000000000000".
    return BigInt.from(d).toString();
  }

  return d.toString();
}
