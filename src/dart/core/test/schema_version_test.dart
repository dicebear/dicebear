// pubspec.yaml is read from disk via dart:io — VM only.
@TestOn('vm')
library;

import 'dart:io';

import 'package:dicebear_core/src/validator/validator.dart';
import 'package:test/test.dart';

void main() {
  // The release guard only reads manifests, so a stale prerelease in the URI
  // the schemas are registered under would otherwise ship unnoticed.
  test('schemaBaseUrl names the dicebear_schema version pubspec.yaml requires',
      () {
    final pubspec = File('pubspec.yaml').readAsStringSync();
    final match = RegExp(r'^\s*dicebear_schema:\s*\^?(\S+)', multiLine: true)
        .firstMatch(pubspec);

    expect(match, isNotNull, reason: 'pubspec.yaml lists no dicebear_schema');
    expect(schemaBaseUrl, contains('@dicebear/schema@${match!.group(1)}/'));
  });
}
