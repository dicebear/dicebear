// The parity fixtures are read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:convert';

import 'package:dicebear_core/src/error/options_validation_error.dart';
import 'package:dicebear_core/src/error/style_validation_error.dart';
import 'package:dicebear_core/src/style.dart';
import 'package:dicebear_core/src/validator/options_validator.dart';
import 'package:test/test.dart';

import 'fixtures.dart';

// Cross-language validation parity: every port must accept and reject the
// same inputs (error messages are language-specific and not compared).
void main() {
  final fixture = parityFixture('validation.json');

  if (fixture == null) {
    test(
      'validation parity',
      () {},
      skip: 'parity fixtures not available (run inside the dicebear monorepo)',
    );

    return;
  }

  final cases = jsonDecode(fixture) as Map<String, Object?>;
  final styleCases =
      (cases['styles'] as List<Object?>).cast<Map<String, Object?>>();
  final optionCases =
      (cases['options'] as List<Object?>).cast<Map<String, Object?>>();

  test('fixture covers styles and options', () {
    expect(styleCases, isNotEmpty);
    expect(optionCases, isNotEmpty);
  });

  // The style cases go through the Style constructor, not bare
  // validateStyleSchema: `alias-to-unknown-component` passes the JSON Schema
  // in every port and is only rejected by the alias check in validateStyle,
  // which the constructor runs.
  group('styles', () {
    for (final c in styleCases) {
      final id = c['id'] as String;
      final definition = c['definition'] as Map<String, Object?>;
      final valid = c['valid'] as bool;

      test(id, () {
        if (valid) {
          expect(() => Style(definition), returnsNormally);
        } else {
          expect(() => Style(definition), throwsA(isA<StyleValidationError>()));
        }
      });
    }
  });

  // The fixture generator validated these against the `minimal` style, but
  // options validation is style-independent in every port — validateOptions
  // is the exact equivalent. Avatar-level coverage lands with wave 2.
  group('options', () {
    for (final c in optionCases) {
      final id = c['id'] as String;
      final options = c['options'];
      final valid = c['valid'] as bool;

      test(id, () {
        if (valid) {
          expect(() => validateOptions(options), returnsNormally);
        } else {
          expect(
            () => validateOptions(options),
            throwsA(isA<OptionsValidationError>()),
          );
        }
      });
    }
  });

  // The `circularColors` cases pin the resolver's reported resolution chain
  // through Avatar construction — wave 2 covers them once Avatar exists.
}
