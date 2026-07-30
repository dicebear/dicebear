// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/avatar.dart';
import 'package:dicebear_core/src/style.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

// Cross-language avatar parity: every rendered SVG must match the
// JS-generated fixture byte for byte, the resolved options must match in key
// order AND int-vs-double typing, and the data URIs pin the percent-encoding
// contract.
void main() {
  if (parityFixtures() == null) {
    test(
      'avatar parity',
      () {},
      skip: 'parity fixtures not available (run inside the dicebear monorepo)',
    );

    return;
  }

  for (final name in parityStyleNames()) {
    group(name, () {
      // The vendored fixture style, never a styles package — every language
      // renders from identical input bytes.
      final style = Style(
        jsonDecode(parityFixture('styles/$name.json')!) as Map<String, Object?>,
      );
      final cases = (jsonDecode(parityFixture('avatars/$name.json')!) as List)
          .cast<Map<String, Object?>>();

      for (final c in cases) {
        test(c['id'], () {
          final avatar = Avatar(style, c['options'] as Map<String, Object?>?);
          final wantSvg = c['svg'] as String;

          if (avatar.svg != wantSvg) {
            final index = _firstDiff(avatar.svg, wantSvg);

            fail('SVG mismatch at index $index\n'
                ' got: …${_context(avatar.svg, index)}…\n'
                'want: …${_context(wantSvg, index)}…');
          }

          // Serialized compare (Python's approach): Dart shares Python's
          // `1 == 1.0` equality hazard, so a structural deep-equal would
          // hide int-vs-double drift. Encoding both sides through
          // jsonEncode also pins the key order.
          expect(
            jsonEncode(avatar.toJson()['options']),
            jsonEncode(c['resolvedOptions']),
          );

          // Only `plain-seed` and `title-escaping` carry a data URI — the
          // encoder is byte-level, so two cases cover the alphabet.
          final dataUri = c['dataUri'];

          if (dataUri != null) {
            expect(avatar.toDataUri(), dataUri);
          }
        });
      }
    });
  }
}

/// Returns the index of the first code unit where [a] and [b] differ, or the
/// length of the shorter string if one is a prefix of the other — full-SVG
/// diffs are unreadable otherwise (the Go suite's firstDiff).
int _firstDiff(String a, String b) {
  final n = a.length < b.length ? a.length : b.length;

  for (var i = 0; i < n; i++) {
    if (a.codeUnitAt(i) != b.codeUnitAt(i)) {
      return i;
    }
  }

  return n;
}

/// Returns a ±40-character window around [index] for mismatch reporting.
String _context(String s, int index) {
  final start = (index - 40).clamp(0, s.length);
  final end = (index + 40).clamp(0, s.length);

  return s.substring(start, end);
}
