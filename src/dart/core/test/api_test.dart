// Public-API behavior tests, ported from the Go api_test.go and Rust api.rs
// suites (minus the Go/Rust-specific JSON-escaping and schema-URI tests, plus
// the renderer/avatar behaviors the Python suite pins). These run without the
// parity fixtures, so they also cover the split pub.dev repository.
library;

import 'dart:convert';

import 'package:dicebear_core/dicebear_core.dart';
import 'package:test/test.dart';

Map<String, Object?> _decode(String json) =>
    jsonDecode(json) as Map<String, Object?>;

final Map<String, Object?> _minimalStyle =
    _decode('{"canvas":{"width":100,"height":100,"elements":[]}}');

// A style whose canvas declares its own defs entry plus a reference to it —
// the Python suite's idRandomization style.
final Map<String, Object?> _styleWithIds = _decode('''
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      {
        "type": "element",
        "name": "defs",
        "children": [
          {
            "type": "element",
            "name": "linearGradient",
            "attributes": { "id": "grad1" },
            "children": [
              {
                "type": "element",
                "name": "stop",
                "attributes": { "offset": "0%", "stop-color": "red" }
              }
            ]
          }
        ]
      },
      { "type": "element", "name": "rect", "attributes": { "fill": "url(#grad1)" } }
    ]
  }
}
''');

void main() {
  group('Style.parse', () {
    // The raw JSON string is what the dicebear_styles package ships, so
    // Style.parse(constant) is the primary consumer entry point.
    final json = jsonEncode(_minimalStyle);

    test('parses a raw JSON definition equivalently to the map constructor',
        () {
      final fromString = Avatar(Style.parse(json), {'seed': 'x'});
      final fromMap = Avatar(Style(_minimalStyle), {'seed': 'x'});

      expect(fromString.svg, fromMap.svg);
    });

    test('throws FormatException on malformed JSON', () {
      // Mirrors int.parse / jsonDecode: a parse failure is a FormatException,
      // distinct from a schema failure.
      expect(() => Style.parse('not json'), throwsFormatException);
    });

    test('throws StyleValidationError on a schema-invalid definition', () {
      expect(() => Style.parse('{}'), throwsA(isA<StyleValidationError>()));
    });

    test('throws StyleValidationError when the JSON is not an object', () {
      // Valid JSON, wrong shape: fails as a validation error, not a cast error.
      expect(() => Style.parse('[]'), throwsA(isA<StyleValidationError>()));
    });
  });

  test('toJson exposes svg and resolved options', () {
    final avatar = Avatar(Style(_minimalStyle), {'seed': 'x'});
    final json = avatar.toJson();
    final options = json['options'] as Map<String, Object?>;

    expect(json['svg'], avatar.svg);
    // The resolved options carry the picked values but never the raw seed.
    expect(options['flip'], 'none');
    expect(options.containsKey('seed'), isFalse);
  });

  test('options descriptor describes components and colors', () {
    final style = Style(_decode('''
    {
      "canvas": { "width": 100, "height": 100, "elements": [] },
      "components": {
        "shape": { "width": 100, "height": 100, "variants": { "a": { "elements": [] }, "b": { "elements": [] } } }
      },
      "colors": {
        "fill": { "values": ["#000000"] },
        "outline": { "values": ["#111111", "#eeeeee"], "contrastTo": "fill", "notEqualTo": ["fill"] }
      }
    }
    '''));

    final descriptor = OptionsDescriptor(style).toJson();

    // Fixed top-level fields.
    expect(descriptor['seed'], {'type': 'string'});

    // Per-component fields (variants sorted).
    final shapeVariant = descriptor['shapeVariant'] as Map<String, Object?>;
    final shapeProbability =
        descriptor['shapeProbability'] as Map<String, Object?>;

    expect(shapeVariant['values'], ['a', 'b']);
    expect(shapeProbability['type'], 'number');

    // Per-color fields, plus the implicit `background` color.
    final fillColor = descriptor['fillColor'] as Map<String, Object?>;
    final backgroundColor =
        descriptor['backgroundColor'] as Map<String, Object?>;

    expect(fillColor['type'], 'color');
    expect(backgroundColor['type'], 'color');

    // A color group repeats the constraints of its definition, so tooling that
    // picks colors itself can apply them.
    expect(descriptor['outlineColor'], {
      'type': 'color',
      'list': true,
      'contrastTo': 'fill',
      'notEqualTo': ['fill'],
    });
    expect(fillColor.containsKey('contrastTo'), isFalse);
    expect(fillColor.containsKey('notEqualTo'), isFalse);
  });

  test('circular color reference is reported', () {
    final style = Style(_decode('''
    {
      "canvas": {
        "width": 100, "height": 100,
        "elements": [{ "type": "element", "name": "rect", "attributes": { "fill": { "type": "color", "name": "a" } } }]
      },
      "colors": {
        "a": { "values": ["#000000"], "contrastTo": "b" },
        "b": { "values": ["#ffffff"], "contrastTo": "a" }
      }
    }
    '''));

    expect(
      () => Avatar(style, {'seed': 'x'}),
      throwsA(
        isA<CircularColorReferenceError>().having(
          (e) => e.message,
          'message',
          contains('Circular color reference'),
        ),
      ),
    );
  });

  test('toJson serializes whole-number options as integers', () {
    // The other ports emit integers ("size":128), not floats (128.0); the
    // resolved-options snapshot must match byte-for-byte.
    final avatar = Avatar(Style(_minimalStyle), {'seed': 'x', 'size': 128});
    final encoded = jsonEncode(avatar.toJson());

    expect(encoded, contains('"size":128'));
    expect(encoded, isNot(contains('"size":128.0')));
  });

  test('toJson emits options in resolution order', () {
    // The envelope must match the JS port byte-for-byte, including the key
    // order (size before title — both resolved before the root attributes).
    // The expected string is the verbatim output of the JS core for the same
    // style and options.
    final avatar = Avatar(
      Style(_minimalStyle),
      {'seed': 'x', 'size': 128, 'title': 't'},
    );

    expect(
      jsonEncode(avatar.toJson()),
      contains('"options":{"backgroundColorFill":"solid","backgroundColor":[],'
          '"scale":1,"flip":"none","rotate":0,"translateX":0,"translateY":0,'
          '"borderRadius":0,"size":128,"title":"t","idRandomization":false}'),
    );
  });

  test('toJson does not HTML-escape the embedded SVG', () {
    // The JS/PHP/Rust ports emit the literal "<svg ...>" in the JSON
    // envelope; Dart's jsonEncode never HTML-escapes, but pin it anyway.
    final avatar = Avatar(Style(_minimalStyle), {'seed': 'x'});

    expect(jsonEncode(avatar.toJson()), contains('"svg":"<svg '));
  });

  test('deeply nested colors resolve without exponential blowup', () {
    // Each color references the next via BOTH contrastTo and notEqualTo,
    // which without memoization fans out to 2^depth color resolutions — a
    // schema-valid hang. With the resolver's memo it is linear; a regression
    // would make this test never finish.
    const depth = 40;

    final colors = StringBuffer();

    for (var i = 0; i < depth; i++) {
      colors.write('"c$i":{"values":["#000000"],'
          '"contrastTo":"c${i + 1}","notEqualTo":["c${i + 1}"]},');
    }

    colors.write('"c$depth":{"values":["#ffffff"]}');

    final style = Style(_decode(
      '{"canvas":{"width":100,"height":100,"elements":'
      '[{"type":"element","name":"rect","attributes":'
      '{"fill":{"type":"color","name":"c0"}}}]},"colors":{$colors}}',
    ));

    expect(() => Avatar(style, {'seed': 'x'}), returnsNormally);
  });

  test('validation accepts and rejects like the other ports', () {
    final style = Style(_minimalStyle);

    // Accepts a minimal valid style and options.
    expect(() => Avatar(style, {'seed': 'x'}), returnsNormally);
    // Null options are treated as empty and accepted.
    expect(() => Avatar(style), returnsNormally);
    expect(() => Avatar(style, null), returnsNormally);

    // Rejects a definition missing canvas.
    expect(
      () => Style(_decode('{"components":{}}')),
      throwsA(isA<StyleValidationError>()),
    );

    // Rejects an alias to an unknown component.
    expect(
      () => Style(_decode('{"canvas":{"width":100,"height":100,"elements":[]},'
          '"components":{"a":{"extends":"missing"}}}')),
      throwsA(
        isA<StyleValidationError>().having(
          (e) => e.message,
          'message',
          contains('unknown component'),
        ),
      ),
    );

    // Rejects options with a wrong type (seed must be a string).
    expect(
      () => Avatar(style, {'seed': 123}),
      throwsA(isA<OptionsValidationError>()),
    );
  });

  test('Uri.encodeComponent matches JS encodeURIComponent', () {
    // Expected values are exactly what JavaScript's encodeURIComponent
    // returns; toDataUri builds on this contract.
    const cases = {
      '<svg>': '%3Csvg%3E',
      'a b&c': 'a%20b%26c',
      "-_.!~*'()": "-_.!~*'()", // the unreserved set passes through
      'é': '%C3%A9', // multi-byte UTF-8 → per-byte escaping
      '"#/': '%22%23%2F',
    };

    cases.forEach((input, want) {
      expect(Uri.encodeComponent(input), want, reason: input);
    });
  });

  test('toDataUri encodes the SVG', () {
    final avatar = Avatar(Style(_minimalStyle), {'seed': 'x'});
    final uri = avatar.toDataUri();

    expect(
      uri,
      'data:image/svg+xml;charset=utf-8,${Uri.encodeComponent(avatar.svg)}',
    );
    // The SVG starts with "<svg", which encodes to "%3Csvg".
    expect(uri, startsWith('data:image/svg+xml;charset=utf-8,%3Csvg'));
  });

  group('idRandomization', () {
    test('randomizes ids when enabled', () {
      final avatar = Avatar(
        Style(_styleWithIds),
        {'seed': 'test', 'idRandomization': true},
      );

      expect(avatar.svg, isNot(contains('id="grad1"')));
      expect(avatar.svg, isNot(contains('url(#grad1)')));
      expect(avatar.svg, contains('id="grad1-'));
      expect(avatar.svg, contains('url(#grad1-'));
    });

    test('preserves ids when disabled', () {
      final avatar = Avatar(
        Style(_styleWithIds),
        {'seed': 'test', 'idRandomization': false},
      );

      expect(avatar.svg, contains('id="grad1"'));
      expect(avatar.svg, contains('url(#grad1)'));
    });

    test('uses process randomness, not the seeded PRNG', () {
      // The same seed must yield different suffixes per render — only the
      // ids change, never the document structure.
      String render() => Avatar(
            Style(_styleWithIds),
            {'seed': 'test', 'idRandomization': true},
          ).svg;
      final first = render();
      final second = render();

      expect(first, isNot(second));

      // Strip each render's single 6-hex suffix; the remaining documents
      // must be identical.
      String stripSuffix(String svg) {
        final suffix = RegExp('grad1-([0-9a-f]{6})').firstMatch(svg)![1]!;

        return svg.replaceAll('-$suffix', '');
      }

      expect(stripSuffix(first), stripSuffix(second));
    });
  });

  group('title', () {
    test('sets role="img" and an escaped aria-label', () {
      final avatar = Avatar(
        Style(_minimalStyle),
        {'seed': 'x', 'title': 'A & B <C>'},
      );

      expect(avatar.svg, contains('role="img"'));
      expect(avatar.svg, contains('aria-label="A &amp; B &lt;C&gt;"'));
      expect(avatar.svg, contains('<title>A &amp; B &lt;C&gt;</title>'));
    });

    test('falls back to aria-hidden without a title', () {
      final avatar = Avatar(Style(_minimalStyle), {'seed': 'x'});

      expect(avatar.svg, contains('aria-hidden="true"'));
      expect(avatar.svg, isNot(contains('role="img"')));
      expect(avatar.svg, isNot(contains('<title>')));
    });
  });

  test('resolved options are exposed as isolated deep copies', () {
    final avatar = Avatar(
      Style(_minimalStyle),
      {'seed': 'x', 'backgroundColor': 'ff0000'},
    );

    // Mutating a returned envelope must not leak into later calls.
    final first = avatar.toJson();

    (first['options'] as Map<String, Object?>)['injected'] = 'modified';
    ((first['options'] as Map<String, Object?>)['backgroundColor'] as List)
        .add('#injected');

    final second = avatar.toJson()['options'] as Map<String, Object?>;

    expect(second.containsKey('injected'), isFalse);
    expect(second['backgroundColor'], ['#ff0000']);

    // The resolvedOptions getter returns the same normalized shape, also as
    // a fresh copy per call.
    final resolved = avatar.resolvedOptions;

    expect(jsonEncode(resolved), jsonEncode(second));

    (resolved['backgroundColor'] as List).clear();

    expect(avatar.resolvedOptions['backgroundColor'], ['#ff0000']);
  });

  // The Ajv-compiled validators of the JS reference reject NaN/Infinity
  // wherever a number is allowed; the other ports cannot even represent them
  // in their JSON values. Without the finiteness walk in the validators, a
  // NaN canvas width would render `viewBox="0 0 NaN 100"`.
  group('non-finite numbers', () {
    test('are rejected in options like the JS reference', () {
      final style = Style(_minimalStyle);

      expect(
        () => Avatar(style, {'seed': 'x', 'rotate': double.nan}),
        throwsA(isA<OptionsValidationError>()),
      );
      expect(
        () => Avatar(style, {'seed': 'x', 'fooProbability': double.nan}),
        throwsA(isA<OptionsValidationError>()),
      );
      // Variant weights have a minimum but no maximum, so Infinity slips
      // past the range checks and only the finiteness walk catches it.
      expect(
        () => Avatar(style, {
          'seed': 'x',
          'fooVariant': {'a': double.infinity},
        }),
        throwsA(isA<OptionsValidationError>()),
      );
    });

    test('are rejected in style definitions like the JS reference', () {
      expect(
        () => Style({
          'canvas': {
            'width': double.nan,
            'height': 100,
            'elements': <Object?>[]
          },
        }),
        throwsA(isA<StyleValidationError>()),
      );
    });
  });

  test('toDataUri rejects unpaired surrogates like the JS reference', () {
    // JS encodeURIComponent throws URIError for a lone surrogate;
    // Uri.encodeComponent would silently substitute U+FFFD instead.
    final avatar = Avatar(
      Style(_minimalStyle),
      {'seed': 'x', 'title': 'broken \u{D800} title'},
    );

    expect(avatar.toDataUri, throwsArgumentError);
  });
}
