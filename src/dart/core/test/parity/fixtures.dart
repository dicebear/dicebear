/// Shared access to the cross-language parity fixtures.
///
/// The fixtures live in the monorepo at `tests/fixtures/parity`, three levels
/// above the package root, and are not shipped with the published package.
/// Every parity suite therefore skips itself when the directory is absent,
/// like the Go port's parity tests.
///
/// VM-only: this reads from disk via `dart:io`, so every suite importing it
/// carries `@TestOn('vm')`. Web-eligible tests must not import this file; they
/// embed the cases they need (see `web_parity_test.dart`).
library;

import 'dart:io';

/// Returns the parity fixture directory, or `null` when running outside the
/// monorepo (published package) — callers skip their suite then.
Directory? parityFixtures() {
  // `dart test` runs from the package root.
  final dir = Directory('../../../tests/fixtures/parity');

  return dir.existsSync() ? dir : null;
}

/// Enumerates the parity style fixtures instead of repeating a hand-maintained
/// list in every suite, so a fixture added to `tests/fixtures/parity/styles` is
/// picked up the way the PHP and Python suites already pick it up. Sorted, so
/// the group order stays stable. Empty when the fixture directory is absent.
List<String> parityStyleNames() {
  final dir = parityFixtures();

  if (dir == null) {
    return const [];
  }

  final names = Directory('${dir.path}/styles')
      .listSync()
      .whereType<File>()
      .map((file) => file.uri.pathSegments.last)
      .where((name) => name.endsWith('.json'))
      .map((name) => name.substring(0, name.length - '.json'.length))
      .toList()
    ..sort();

  return names;
}

/// Returns the contents of the fixture file [name], or `null` when the
/// fixture directory is absent. A missing file inside an existing fixture
/// directory throws — that is a broken checkout, not a published package.
String? parityFixture(String name) {
  final dir = parityFixtures();

  if (dir == null) {
    return null;
  }

  return File('${dir.path}/$name').readAsStringSync();
}
