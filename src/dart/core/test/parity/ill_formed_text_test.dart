// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/avatar.dart';
import 'package:dicebear_core/src/style.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

// Lone surrogates in the options become U+FFFD before anything reads them, so
// the avatar matches the one for the well-formed text. Inputs are UTF-16
// code-unit arrays; the `utf8` cases are for the ports whose strings are
// bytes. See tests/fixtures/parity/generate.mjs.
void main() {
  final fixture = parityFixture('ill-formed-text.json');

  group(
    'ill-formed text',
    skip: fixture == null ? 'parity fixtures not available' : false,
    () {
      test('utf16 cases render like the reference', () {
        final style = Style(
          jsonDecode(parityFixture('styles/initials.json')!)
              as Map<String, Object?>,
        );
        final cases = ((jsonDecode(fixture!) as Map<String, Object?>)['utf16']
                as List<Object?>)
            .cast<Map<String, Object?>>();

        expect(cases, isNotEmpty);

        for (final c in cases) {
          final input = String.fromCharCodes(
            (c['input'] as List<Object?>).cast<int>(),
          );
          final avatar = Avatar(style, {'seed': input, 'title': input});

          expect(avatar.toString(), c['svg'], reason: '${c['input']}');
        }
      });
    },
  );
}
