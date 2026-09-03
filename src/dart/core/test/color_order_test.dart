// The `${name}ColorOrder` option, ported from the JS reference suites — the
// `colorOrder` cases of Resolver.test.js, Options.test.js,
// OptionsDescriptor.test.js, and Renderer.test.js. These run without the
// parity fixtures, so they also cover the split pub.dev repository.
library;

import 'dart:convert';

import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_core/src/options.dart';
import 'package:dicebear_core/src/resolver.dart';
import 'package:test/test.dart';

Map<String, Object?> _decode(String json) =>
    jsonDecode(json) as Map<String, Object?>;

Resolver _makeResolver(Style style, Map<String, Object?> data) =>
    Resolver(style, Options(data));

final Style _minimalStyle =
    Style(_decode('{"canvas":{"width":100,"height":100,"elements":[]}}'));

final Style _styleWithColors = Style(_decode('''
{
  "canvas": { "width": 100, "height": 100, "elements": [] },
  "colors": {
    "skin": {
      "values": ["#f0c8a0", "#d4a574", "#8d5524"]
    },
    "hair": {
      "values": ["#2c1b18", "#b55239", "#d6b370"],
      "notEqualTo": ["skin"]
    },
    "background": {
      "values": ["#ffffff", "#000000", "#cccccc"],
      "contrastTo": "skin"
    }
  }
}
'''));

void main() {
  group('Resolver colorOrder', () {
    test('defaults to random', () {
      final resolver = _makeResolver(_minimalStyle, {'seed': 'order-default'});

      expect(resolver.colorOrder('skin'), 'random');
    });

    test('keeps the given order for gradient fills when fixed', () {
      final resolver = _makeResolver(_minimalStyle, {
        'seed': 'order-fixed',
        'skinColor': ['#0055a4', '#ffffff', '#ef4135'],
        'skinColorFill': 'linear',
        'skinColorOrder': 'fixed',
      });

      expect(resolver.color('skin'), ['#0055a4', '#ffffff', '#ef4135']);
    });

    test('keeps the order for every seed', () {
      for (var i = 0; i < 20; i++) {
        final resolver = _makeResolver(_minimalStyle, {
          'seed': 'order-fixed-$i',
          'skinColor': ['#0055a4', '#ffffff', '#ef4135'],
          'skinColorFill': 'linear',
          'skinColorOrder': 'fixed',
        });

        expect(resolver.color('skin'), ['#0055a4', '#ffffff', '#ef4135']);
      }
    });

    test('defaults the stop count to the number of colors when fixed', () {
      final resolver = _makeResolver(_minimalStyle, {
        'seed': 'order-stops',
        'skinColor': ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
        'skinColorFill': 'linear',
        'skinColorOrder': 'fixed',
      });

      expect(resolver.color('skin').length, 4);
    });

    test('respects an explicit stop count when fixed', () {
      final resolver = _makeResolver(_minimalStyle, {
        'seed': 'order-explicit-stops',
        'skinColor': ['#0055a4', '#ffffff', '#ef4135'],
        'skinColorFill': 'linear',
        'skinColorFillStops': 2,
        'skinColorOrder': 'fixed',
      });

      expect(resolver.color('skin'), ['#0055a4', '#ffffff']);
    });

    test('always uses the first color for solid fills when fixed', () {
      final resolver = _makeResolver(_minimalStyle, {
        'seed': 'order-solid',
        'skinColor': ['#ef4135', '#0055a4'],
        'skinColorOrder': 'fixed',
      });

      expect(resolver.color('skin'), ['#ef4135']);
    });

    test('skips contrast sorting when fixed', () {
      // background.contrastTo = skin: by default the strongest-contrast
      // candidate comes first, with a fixed order the user's first color wins.
      final options = <String, Object?>{
        'seed': 'order-contrast',
        'skinColor': '#000000',
        'backgroundColor': ['#111111', '#ffffff'],
      };

      final control = _makeResolver(_styleWithColors, options);
      final fixed = _makeResolver(_styleWithColors, {
        ...options,
        'backgroundColorOrder': 'fixed',
      });

      expect(control.color('background'), ['#ffffff']);
      expect(fixed.color('background'), ['#111111']);
    });

    test('still applies notEqualTo filtering when fixed', () {
      // hair.notEqualTo = skin
      final resolver = _makeResolver(_styleWithColors, {
        'seed': 'order-not-equal',
        'skinColor': '#2c1b18',
        'hairColor': ['#2c1b18', '#b55239', '#d6b370'],
        'hairColorFill': 'linear',
        'hairColorOrder': 'fixed',
      });

      expect(resolver.color('hair'), ['#b55239', '#d6b370']);
    });

    test('keeps a style palette in definition order when fixed', () {
      // Without user-supplied colors, 'fixed' uses the palette as the style
      // lists it, for every seed.
      for (var i = 0; i < 5; i++) {
        final resolver = _makeResolver(_styleWithColors, {
          'seed': 'order-style-$i',
          'skinColorFill': 'linear',
          'skinColorFillStops': 3,
          'skinColorOrder': 'fixed',
        });

        expect(resolver.color('skin'), ['#f0c8a0', '#d4a574', '#8d5524']);
      }
    });

    test('skips contrast sorting for a style palette when fixed', () {
      // background.contrastTo = skin: the contrast sort would put black
      // first against a white skin, the fixed order keeps white first.
      final resolver = _makeResolver(_styleWithColors, {
        'seed': 'order-style-contrast',
        'skinColor': '#ffffff',
        'backgroundColorOrder': 'fixed',
      });

      expect(resolver.color('background'), ['#ffffff']);
    });

    test('defaults the stop count to the palette size when fixed', () {
      final resolver = _makeResolver(_styleWithColors, {
        'seed': 'order-style-stops',
        'skinColorFill': 'linear',
        'skinColorOrder': 'fixed',
      });

      expect(resolver.color('skin'), ['#f0c8a0', '#d4a574', '#8d5524']);
    });
  });

  group('Options colorOrder', () {
    test('returns null when unset', () {
      expect(Options({}).colorOrder('skin'), isNull);
    });

    test('passes the value through', () {
      final options = Options({'skinColorOrder': 'fixed'});

      expect(options.colorOrder('skin'), 'fixed');
    });

    test('rejects an unknown value', () {
      expect(
        () => Options({'skinColorOrder': 'sorted'}),
        throwsA(isA<OptionsValidationError>()),
      );
    });

    test('rejects a list value', () {
      expect(
        () => Options({
          'skinColorOrder': ['fixed'],
        }),
        throwsA(isA<OptionsValidationError>()),
      );
    });
  });

  group('OptionsDescriptor colorOrder', () {
    test('describes every color order as an enum', () {
      final minimal = OptionsDescriptor(_minimalStyle).toJson();
      final withColors = OptionsDescriptor(_styleWithColors).toJson();

      expect(minimal['backgroundColorOrder'], {
        'type': 'enum',
        'values': ['random', 'fixed'],
      });
      expect(withColors['skinColorOrder'], {
        'type': 'enum',
        'values': ['random', 'fixed'],
      });
    });
  });

  group('Renderer colorOrder', () {
    test('keeps the stop order when the color order is fixed', () {
      final style = Style(_decode('''
      {
        "canvas": {
          "width": 100,
          "height": 100,
          "elements": [
            {
              "type": "element",
              "name": "rect",
              "attributes": { "fill": { "type": "color", "name": "bg" } }
            }
          ]
        },
        "colors": {
          "bg": { "values": ["#ff0000", "#0000ff"] }
        }
      }
      '''));

      final avatar = Avatar(style, {
        'seed': 'test',
        'bgColor': ['#0055a4', '#ffffff', '#ef4135'],
        'bgColorFill': 'linear',
        'bgColorOrder': 'fixed',
      });

      expect(
        avatar.svg,
        contains('<stop offset="0%" stop-color="#0055a4"/>'
            '<stop offset="50%" stop-color="#ffffff"/>'
            '<stop offset="100%" stop-color="#ef4135"/>'),
      );
    });
  });
}
