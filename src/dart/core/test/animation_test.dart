// The per-name `${name}Animation`, `${name}AnimationSpeed`, and
// `${name}AnimationDelay` options, ported from the JS reference suites: the
// per-name cases of Resolver.test.js and the "named selection" and "per-name
// speed and delay" cases of Renderer.test.js.
// These run without the parity fixtures, so they also cover the split pub.dev
// repository.
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

// A named timeline next to an unnamed one on the same element, so the
// per-name option has one to scale and one to leave at the global factor.
final Style _paced = Style(_decode('''
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      {
        "type": "element",
        "name": "rect",
        "animations": [
          {
            "name": "sway",
            "duration": 4,
            "delay": 1,
            "tracks": {
              "rotate": {
                "keyframes": [
                  { "at": 0, "value": 0 },
                  { "at": 100, "value": 4 }
                ]
              }
            }
          },
          {
            "duration": 3,
            "tracks": {
              "opacity": {
                "keyframes": [
                  { "at": 0, "value": 1 },
                  { "at": 50, "value": 0.5 }
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
'''));

// One named block per element plus an unnamed one, so every switch has
// something to include and something to skip.
final Style _named = Style(_decode('''
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      {
        "type": "element",
        "name": "rect",
        "animations": [
          {
            "name": "sway",
            "duration": 1,
            "tracks": {
              "rotate": {
                "keyframes": [
                  { "at": 0, "value": 0 },
                  { "at": 100, "value": 4 }
                ]
              }
            }
          }
        ]
      },
      {
        "type": "element",
        "name": "circle",
        "animations": [
          {
            "name": "blink",
            "duration": 2,
            "tracks": {
              "scaleY": {
                "keyframes": [
                  { "at": 0, "value": 1 },
                  { "at": 50, "value": 0.1 }
                ]
              }
            }
          },
          {
            "duration": 3,
            "tracks": {
              "opacity": {
                "keyframes": [
                  { "at": 0, "value": 1 },
                  { "at": 50, "value": 0.5 }
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
'''));

/// Counts the class rules in [svg], one per playing track.
int _rules(String svg) => 'animation:'.allMatches(svg).length;

/// Extracts the animation namespace hash from the first class name in [svg].
String _hashOf(String svg) {
  final match = RegExp(r'dba-([0-9a-f]+)-\d+').firstMatch(svg);

  expect(match, isNotNull, reason: 'expected an animation class in the output');

  return match!.group(1)!;
}

void main() {
  group('Options animationSpeedFor', () {
    test('rejects invalid values at validation', () {
      for (final speed in [
        0,
        20,
        [0, 2],
        [0.5, 2, 4],
        'fast',
      ]) {
        expect(
          () => Options({'blinkAnimationSpeed': speed}),
          throwsA(isA<OptionsValidationError>()),
          reason: jsonEncode(speed),
        );
      }

      expect(
        () => Options({'BlinkAnimationSpeed': 2}),
        throwsA(isA<OptionsValidationError>()),
      );
    });

    test('exposes the option as a range per name', () {
      final options = Options({
        'blinkAnimationSpeed': [0.5, 2],
      });

      expect(options.animationSpeedFor('blink')?.min, 0.5);
      expect(options.animationSpeedFor('blink')?.max, 2);
      expect(options.animationSpeedFor('sway'), isNull);
      expect(options.animationSpeed(), isNull);
    });
  });

  group('Resolver animationDelayFor', () {
    test('lets a named delay win over the global one', () {
      final resolver = _makeResolver(_minimalStyle, {
        'animationDelay': 1,
        'blinkAnimationDelay': -2,
      });

      expect(resolver.animationDelay(), 1);
      expect(resolver.animationDelayFor('blink'), -2);
      expect(resolver.animationDelayFor('sway'), 1);
      expect(resolver.animationDelayFor(null), 1);
      expect(_makeResolver(_minimalStyle, {}).animationDelayFor('blink'), 0);
    });

    test('draws a delay range under its own key, seeded', () {
      final options = {
        'seed': 'x',
        'animationDelay': [0, 3],
        'blinkAnimationDelay': [0, 3],
      };
      final resolver = _makeResolver(_minimalStyle, options);
      final global = resolver.animationDelay();
      final blink = resolver.animationDelayFor('blink');

      expect(global, inInclusiveRange(0, 3));
      expect(blink, inInclusiveRange(0, 3));
      expect(global, isNot(blink));
      expect(
        _makeResolver(_minimalStyle, options).animationDelayFor('blink'),
        blink,
      );
    });

    test('rejects values outside the bounds at validation', () {
      for (final data in [
        {'animationDelay': 3601},
        {'animationDelay': -3601},
        {
          'blinkAnimationDelay': [0, 1, 2],
        },
        {'blinkAnimationDelay': 'soon'},
      ]) {
        expect(
          () => Options(data),
          throwsA(isA<OptionsValidationError>()),
          reason: jsonEncode(data),
        );
      }
    });
  });

  group('Resolver animationPlays', () {
    test('lets a named switch win over the global one', () {
      final on = _makeResolver(_minimalStyle, {
        'animation': false,
        'blinkAnimation': true,
      });

      expect(on.animationPlays('blink'), isTrue);
      expect(on.animationPlays('sway'), isFalse);
      expect(on.animationPlays(null), isFalse);
      expect(on.resolved()['blinkAnimation'], isTrue);
      expect(on.resolved().containsKey('swayAnimation'), isFalse);

      final off = _makeResolver(_minimalStyle, {
        'animation': true,
        'blinkAnimation': false,
      });

      expect(off.animationPlays('blink'), isFalse);
      expect(off.animationPlays('sway'), isTrue);
      expect(off.animationPlays(null), isTrue);
    });

    test('rejects anything but a boolean at validation', () {
      for (final data in [
        {'animation': 'blink'},
        {
          'animation': ['blink'],
        },
        {'blinkAnimation': 'yes'},
        {'BlinkAnimation': true},
      ]) {
        expect(
          () => Options(data),
          throwsA(isA<OptionsValidationError>()),
          reason: jsonEncode(data),
        );
      }
    });
  });

  group('Resolver animationSpeedFor', () {
    test('lets the specific option win over the global one', () {
      final resolver = _makeResolver(_minimalStyle, {
        'animationSpeed': 0.5,
        'blinkAnimationSpeed': 2,
      });

      expect(resolver.animationSpeedFor('blink'), 2);
      expect(resolver.animationSpeedFor('sway'), 0.5);
      expect(resolver.animationSpeedFor(null), 0.5);
      expect(resolver.resolved()['blinkAnimationSpeed'], 2);
      expect(resolver.resolved().containsKey('swayAnimationSpeed'), isFalse);
    });

    test('draws a specific range under its own key', () {
      final options = {
        'seed': 'x',
        'blinkAnimationSpeed': [0.5, 2],
        'swayAnimationSpeed': [0.5, 2],
      };
      final resolver = _makeResolver(_minimalStyle, options);
      final blink = resolver.animationSpeedFor('blink');

      expect(blink, inInclusiveRange(0.5, 2));
      expect(blink, isNot(resolver.animationSpeedFor('sway')));
      expect(
        blink,
        isNot(
          _makeResolver(_minimalStyle, {
            'seed': 'x',
            'animationSpeed': [0.5, 2],
          }).animationSpeed(),
        ),
      );
      expect(
        _makeResolver(_minimalStyle, options).animationSpeedFor('blink'),
        blink,
      );
    });

    test('shares the global factor with every timeline', () {
      final resolver = _makeResolver(_minimalStyle, {'animationSpeed': 2});

      expect(resolver.animationSpeedFor('blink'), 2);
      expect(resolver.animationSpeedFor(null), 2);
    });
  });

  group('Renderer named selection', () {
    test('plays only a timeline switched on by name', () {
      final svg = Avatar(_named, {'blinkAnimation': true}).svg;

      expect(_rules(svg), 1);
      expect(svg, contains('scaleY'));
      expect(svg, isNot(contains('rotate(')));
      expect(svg, isNot(contains('opacity:')));
      expect('<g class="dba-'.allMatches(svg).length, 1);
    });

    test('combines several switches', () {
      final svg = Avatar(_named, {
        'swayAnimation': true,
        'blinkAnimation': true,
      }).svg;

      expect(_rules(svg), 2);
      expect(svg, contains('rotate('));
      expect(svg, contains('scaleY'));
      expect(svg, isNot(contains('opacity:')));
    });

    test('plays unnamed timelines only through the global switch', () {
      final svg = Avatar(_named, {'animation': true}).svg;

      expect(_rules(svg), 3);
      expect(svg, contains('opacity:'));
    });

    test('switches a timeline off while the rest play', () {
      final svg = Avatar(_named, {
        'animation': true,
        'blinkAnimation': false,
      }).svg;

      expect(_rules(svg), 2);
      expect(svg, isNot(contains('scaleY')));
      expect(svg, contains('rotate('));
      expect(svg, contains('opacity:'));
    });

    test('stays static for a name the style does not carry', () {
      final switched = Avatar(_named, {'bounceAnimation': true});

      expect(switched.svg, Avatar(_named).svg);
      expect(switched.resolvedOptions.containsKey('bounceAnimation'), isFalse);
    });

    test('records the switches in the resolved options', () {
      final options = Avatar(_named, {'blinkAnimation': true}).resolvedOptions;

      expect(options['animation'], isFalse);
      expect(options['blinkAnimation'], isTrue);
      expect(options.containsKey('swayAnimation'), isFalse);
    });

    test('includes the switches in the class namespace', () {
      final all = _hashOf(Avatar(_named, {'animation': true}).svg);
      final one = _hashOf(Avatar(_named, {'blinkAnimation': true}).svg);
      final allButOne = _hashOf(Avatar(_named, {
        'animation': true,
        'blinkAnimation': false,
      }).svg);

      expect(all, isNot(one));
      expect(all, isNot(allButOne));
      expect(one, isNot(allButOne));
    });
  });

  group('Renderer per-name speed and delay', () {
    test('adds the delay after the speed has scaled the authored one', () {
      final svg = Avatar(_paced, {
        'animation': true,
        'animationSpeed': 2,
        'animationDelay': 3,
      }).svg;

      expect(svg, contains('animation:2s linear 3.5s infinite'));
      expect(svg, contains('animation:1.5s linear 3s infinite'));
    });

    test('lets a named delay win over the global one', () {
      final svg = Avatar(_paced, {
        'animation': true,
        'animationDelay': 1,
        'swayAnimationDelay': -2,
      }).svg;

      expect(svg, contains('animation:4s linear -1s infinite'));
      expect(svg, contains('animation:3s linear 1s infinite'));
    });

    test('includes the delays in the class namespace', () {
      final plain = _hashOf(Avatar(_paced, {'animation': true}).svg);
      final shifted = _hashOf(Avatar(_paced, {
        'animation': true,
        'animationDelay': 1,
      }).svg);
      final named = _hashOf(Avatar(_paced, {
        'animation': true,
        'swayAnimationDelay': 1,
      }).svg);

      expect(plain, isNot(shifted));
      expect(shifted, isNot(named));
    });

    test('records the delays in the resolved options', () {
      final options = Avatar(_paced, {
        'animation': true,
        'animationDelay': 1,
        'swayAnimationDelay': [-2, -2],
      }).resolvedOptions;

      expect(options['animationDelay'], 1);
      expect(options['swayAnimationDelay'], -2);
      expect(
        Avatar(_paced).resolvedOptions.containsKey('animationDelay'),
        isFalse,
      );
    });

    test('scales only the named timeline', () {
      final svg = Avatar(_paced, {
        'animation': true,
        'swayAnimationSpeed': 2,
      }).svg;

      expect(svg, contains('animation:2s linear 0.5s infinite'));
      expect(svg, contains('animation:3s linear 0s infinite'));
    });

    test('lets the specific option win over the global one', () {
      final svg = Avatar(_paced, {
        'animation': true,
        'animationSpeed': 0.5,
        'swayAnimationSpeed': 2,
      }).svg;

      expect(svg, contains('animation:2s linear 0.5s infinite'));
      expect(svg, contains('animation:6s linear 0s infinite'));
    });

    test('ignores a name the style does not carry', () {
      final listed = Avatar(_paced, {
        'animation': true,
        'bounceAnimationSpeed': 2,
      });
      final plain = Avatar(_paced, {'animation': true});

      expect(listed.svg, plain.svg);
      expect(
          listed.resolvedOptions.containsKey('bounceAnimationSpeed'), isFalse);
    });

    test('leaves a timeline that does not play untouched', () {
      final off = Avatar(_paced, {
        'animation': false,
        'swayAnimationSpeed': 2,
      });

      expect(off.svg, Avatar(_paced).svg);
      expect(off.resolvedOptions.containsKey('swayAnimationSpeed'), isFalse);
    });

    test('includes the named factor in the class namespace', () {
      final named = Avatar(_paced, {
        'animation': true,
        'swayAnimationSpeed': 2,
      }).svg;
      final global = Avatar(_paced, {
        'animation': true,
        'animationSpeed': 2,
      }).svg;

      expect(_hashOf(named), isNot(_hashOf(global)));
    });

    test('records the drawn factor in the resolved options', () {
      final options = Avatar(_paced, {
        'animation': true,
        'swayAnimationSpeed': [2, 2],
      }).resolvedOptions;

      expect(options['swayAnimationSpeed'], 2);
      expect(options['animationSpeed'], 1);
    });
  });

  test('descriptor advertises a switch and a range per animation name', () {
    final descriptor = OptionsDescriptor(_named).toJson();
    final keys = descriptor.keys.toList();

    expect(descriptor['animation'], {'type': 'boolean'});
    expect(descriptor['blinkAnimation'], {'type': 'boolean'});
    expect(
      descriptor['blinkAnimationSpeed'],
      {'type': 'range', 'min': 0.1, 'max': 10},
    );
    expect(
      descriptor['blinkAnimationDelay'],
      {'type': 'range', 'min': -3600, 'max': 3600},
    );
    expect(keys.sublist(keys.indexOf('animation')), [
      'animation',
      'animationSpeed',
      'animationDelay',
      'blinkAnimation',
      'blinkAnimationSpeed',
      'blinkAnimationDelay',
      'swayAnimation',
      'swayAnimationSpeed',
      'swayAnimationDelay',
    ]);
    expect(
      OptionsDescriptor(_minimalStyle).toJson().containsKey('animationSpeed'),
      isFalse,
    );
  });
}
