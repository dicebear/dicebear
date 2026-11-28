/// Runtime validation of style definitions: the nesting depth limit, the
/// shared JSON Schema, and the cross-key checks the schema cannot express.
///
/// The checks read the caller's map as given, before `Style` takes its copy,
/// so they accept any map and list types, not only `Map<String, Object?>`.
library;

import '../error/style_validation_error.dart';
import '../error/validation_error.dart';
import 'style_schema_validator.dart';
import 'validator.dart';

/// Throws a [StyleValidationError] when [data] is not a valid style
/// definition: nested too deeply, in violation of the style definition
/// schema, with an invalid component alias, with a component cycle, or with
/// animation keyframes out of order. The checks run in that order and the
/// first one that fails throws.
void validateStyle(Object? data) {
  if (exceedsMaxJsonDepth(data)) {
    throw StyleValidationError(const [
      ValidationErrorDetail(message: maxJsonDepthMessage),
    ]);
  }

  validateStyleSchema(data);

  final definition = data as Map<Object?, Object?>;

  _validateAliases(definition);
  _validateComponentCycles(definition);
  _validateAnimations(definition);
}

/// Verifies that every component declared via `extends` references an
/// existing, non-alias component in the same `components` map — a cross-key
/// constraint the JSON Schema cannot express. All failures are collected
/// (in definition order, like the JS port), then one [StyleValidationError]
/// is thrown.
void _validateAliases(Map<Object?, Object?> definition) {
  final components = definition['components'] as Map<Object?, Object?>?;

  if (components == null) {
    return;
  }

  final errors = <ValidationErrorDetail>[];

  for (final entry in components.entries) {
    final data = entry.value as Map<Object?, Object?>;

    if (!_isAlias(data)) {
      continue;
    }

    final target = data['extends'] as String;
    final targetData = components[target] as Map<Object?, Object?>?;

    if (targetData == null) {
      errors.add(ValidationErrorDetail(
        instancePath: '/components/${entry.key}/extends',
        message: 'references unknown component "$target"',
      ));

      continue;
    }

    if (_isAlias(targetData)) {
      errors.add(ValidationErrorDetail(
        instancePath: '/components/${entry.key}/extends',
        message: 'references alias "$target" — alias chains are not allowed',
      ));
    }
  }

  if (errors.isNotEmpty) {
    throw StyleValidationError(errors);
  }
}

/// Verifies that no component renders itself, directly or through other
/// components. The renderer registers a variant's `<defs>` entry only after
/// its body has rendered, so a cycle would recurse until the stack runs out.
/// A reference to an alias counts as a reference to its source, since the
/// alias renders the source's variants. Unknown names render nothing and
/// close no cycle. Runs after [_validateAliases], so every alias points at a
/// base component here.
void _validateComponentCycles(Map<Object?, Object?> definition) {
  final components = definition['components'] as Map<Object?, Object?>?;

  if (components == null) {
    return;
  }

  final references =
      <Object?, List<({String name, String source, String path})>>{};

  for (final entry in components.entries) {
    final data = entry.value as Map<Object?, Object?>;

    if (_isAlias(data)) {
      continue;
    }

    final found = <({String name, String source, String path})>[];

    void walk(List<Object?> elements, String path) {
      for (var index = 0; index < elements.length; index++) {
        final element = elements[index] as Map<Object?, Object?>;
        final elementPath = '$path/$index';
        final referenced = element['name'];

        if (element['type'] == 'component' && referenced is String) {
          final target = components[referenced] as Map<Object?, Object?>?;

          if (target != null) {
            found.add((
              name: referenced,
              source:
                  _isAlias(target) ? target['extends'] as String : referenced,
              path: elementPath,
            ));
          }
        }

        final children = element['children'] as List<Object?>?;

        if (children != null) {
          walk(children, '$elementPath/children');
        }
      }
    }

    final variants = data['variants'] as Map<Object?, Object?>;

    for (final variant in variants.entries) {
      walk(
        (variant.value as Map<Object?, Object?>)['elements'] as List<Object?>,
        '/components/${entry.key}/variants/${variant.key}/elements',
      );
    }

    references[entry.key] = found;
  }

  // Depth-first search: a reference to a component that is still on the
  // stack closes a cycle. The depth is bounded by the number of components.
  final onStack = <Object?>{};
  final done = <Object?>{};
  final errors = <ValidationErrorDetail>[];

  void visit(Object? name) {
    onStack.add(name);

    for (final reference in references[name] ??
        const <({String name, String source, String path})>[]) {
      if (onStack.contains(reference.source)) {
        errors.add(ValidationErrorDetail(
          instancePath: reference.path,
          message: 'references component "${reference.name}", which leads '
              'back to "${reference.source}" — component cycles are not allowed',
        ));
      } else if (!done.contains(reference.source)) {
        visit(reference.source);
      }
    }

    onStack.remove(name);
    done.add(name);
  }

  for (final name in references.keys) {
    if (!done.contains(name)) {
      visit(name);
    }
  }

  if (errors.isNotEmpty) {
    throw StyleValidationError(errors);
  }
}

/// Verifies that every animation track lists its keyframes in strictly
/// ascending `at` order — the schema cannot express ordering between array
/// items. Step jumps are expressed with the `hold` easing rather than
/// duplicate positions. All violations are collected (in definition order,
/// like the JS port), then one [StyleValidationError] is thrown.
void _validateAnimations(Map<Object?, Object?> definition) {
  final errors = <ValidationErrorDetail>[];

  _visitElements(definition, (element, path) {
    final animations = element['animations'] as List<Object?>? ?? const [];

    for (var animationIndex = 0;
        animationIndex < animations.length;
        animationIndex++) {
      final animation = animations[animationIndex] as Map<Object?, Object?>;
      final tracks = animation['tracks'] as Map<Object?, Object?>;

      for (final track in tracks.entries) {
        final keyframes = (track.value as Map<Object?, Object?>)['keyframes']
            as List<Object?>;

        for (var i = 1; i < keyframes.length; i++) {
          final at = (keyframes[i] as Map<Object?, Object?>)['at'] as num;
          final previous =
              (keyframes[i - 1] as Map<Object?, Object?>)['at'] as num;

          if (at <= previous) {
            errors.add(ValidationErrorDetail(
              instancePath: '$path/animations/$animationIndex'
                  '/tracks/${track.key}/keyframes/$i/at',
              message: 'must be greater than the previous keyframe',
            ));
          }
        }
      }
    }
  });

  if (errors.isNotEmpty) {
    throw StyleValidationError(errors);
  }
}

/// Walks every element in [definition] — the canvas tree and every non-alias
/// component variant tree — and invokes [visit] with the raw element map and
/// its JSON pointer path. The same walk as `Style`'s own, over the raw map.
void _visitElements(
  Map<Object?, Object?> definition,
  void Function(Map<Object?, Object?> element, String path) visit,
) {
  void walk(List<Object?> elements, String path) {
    for (var index = 0; index < elements.length; index++) {
      final element = elements[index] as Map<Object?, Object?>;
      final elementPath = '$path/$index';

      visit(element, elementPath);

      final children = element['children'] as List<Object?>?;

      if (children != null) {
        walk(children, '$elementPath/children');
      }
    }
  }

  walk(
    (definition['canvas'] as Map<Object?, Object?>)['elements']
        as List<Object?>,
    '/canvas/elements',
  );

  final components =
      definition['components'] as Map<Object?, Object?>? ?? const {};

  for (final entry in components.entries) {
    final component = entry.value as Map<Object?, Object?>;

    if (_isAlias(component)) {
      continue;
    }

    final variants = component['variants'] as Map<Object?, Object?>;

    for (final variant in variants.entries) {
      walk(
        (variant.value as Map<Object?, Object?>)['elements'] as List<Object?>,
        '/components/${entry.key}/variants/${variant.key}/elements',
      );
    }
  }
}

// The discriminator between a base component and an alias, matching the JS
// port's `'extends' in data`.
bool _isAlias(Map<Object?, Object?> data) => data.containsKey('extends');
