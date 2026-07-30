// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/options_descriptor.dart';
import 'package:dicebear_core/src/style.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

// Cross-language descriptor parity: one OptionsDescriptor per parity style,
// pinning the field map (types, ranges, sorted variant lists, per-color
// fields) that tooling builds form controls from. The serialized compare
// pins key order and int-vs-double typing, like the avatar resolved-options
// assertion.
void main() {
  if (parityFixtures() == null) {
    test(
      'descriptor parity',
      () {},
      skip: 'parity fixtures not available (run inside the dicebear monorepo)',
    );

    return;
  }

  for (final name in const [
    'animated',
    'glass',
    'initials',
    'notionists',
    'shape-grid',
    'tagged',
    'thumbs',
  ]) {
    test(name, () {
      final style = Style(
        jsonDecode(parityFixture('styles/$name.json')!) as Map<String, Object?>,
      );
      final expected = jsonDecode(parityFixture('descriptors/$name.json')!);

      expect(
        jsonEncode(OptionsDescriptor(style).toJson()),
        jsonEncode(expected),
      );
    });
  }
}
