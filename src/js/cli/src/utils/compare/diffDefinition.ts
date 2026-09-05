import type { Style, StyleDefinition } from '@dicebear/core';

import type { DefinitionChange } from './types.js';

type Json = Record<string, unknown>;

/**
 * Fills in the value a missing field stands for, so that a built definition
 * (which drops empty lists) and a hand-written one (which may spell them out)
 * only differ where an avatar would.
 */
function withDefault(value: unknown, fallback: unknown): unknown {
  if (value === undefined) {
    return fallback;
  }

  if (Array.isArray(value) && value.length === 0 && Array.isArray(fallback)) {
    return fallback;
  }

  return value;
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function show(value: unknown): string {
  return value === undefined ? 'unset' : JSON.stringify(value);
}

/**
 * Compares two definitions on everything that shapes an avatar apart from
 * the element trees themselves: canvas, meta, animations, components with
 * their variants, and colors. The element trees are covered by the pixel
 * sweeps instead.
 */
export function diffDefinition(
  before: Style,
  after: Style,
): DefinitionChange[] {
  const changes: DefinitionChange[] = [];
  const a = before.definition() as StyleDefinition & Json;
  const b = after.definition() as StyleDefinition & Json;

  const changed = (
    scope: DefinitionChange['scope'],
    name: string,
    field: string,
    from: unknown,
    to: unknown,
  ) => {
    if (!same(from, to)) {
      changes.push({
        scope,
        kind: 'changed',
        name,
        detail: `${field} ${show(from)} -> ${show(to)}`,
      });
    }
  };

  changed('canvas', 'canvas', 'width', a.canvas.width, b.canvas.width);
  changed('canvas', 'canvas', 'height', a.canvas.height, b.canvas.height);
  changed('canvas', 'canvas', 'attributes', a.attributes, b.attributes);

  for (const section of ['license', 'creator', 'source'] as const) {
    const from = a.meta?.[section] as Json | undefined;
    const to = b.meta?.[section] as Json | undefined;

    for (const field of ['name', 'url']) {
      changed('meta', section, field, from?.[field], to?.[field]);
    }
  }

  changed(
    'animations',
    'animations',
    'names',
    before.animationNames(),
    after.animationNames(),
  );

  diffRecords(
    changes,
    'component',
    a.components ?? {},
    b.components ?? {},
    (name, from, to) => {
      if (!same(from.extends, to.extends)) {
        changed('component', name, 'extends', from.extends, to.extends);

        return;
      }

      if (from.extends !== undefined) {
        return;
      }

      for (const field of ['width', 'height', 'rotate', 'scale', 'translate']) {
        changed('component', name, field, from[field], to[field]);
      }

      changed(
        'component',
        name,
        'probability',
        withDefault(from.probability, 100),
        withDefault(to.probability, 100),
      );

      diffRecords(
        changes,
        'variant',
        (from.variants ?? {}) as Record<string, Json>,
        (to.variants ?? {}) as Record<string, Json>,
        (variant, fromVariant, toVariant) => {
          changed(
            'variant',
            variant,
            'weight',
            withDefault(fromVariant.weight, 1),
            withDefault(toVariant.weight, 1),
          );
          changed(
            'variant',
            variant,
            'tags',
            withDefault(fromVariant.tags, []),
            withDefault(toVariant.tags, []),
          );
        },
        name,
      );
    },
  );

  diffRecords(
    changes,
    'color',
    a.colors ?? {},
    b.colors ?? {},
    (name, from, to) => {
      const fromValues = (from.values ?? []) as string[];
      const toValues = (to.values ?? []) as string[];
      const added = toValues.filter((value) => !fromValues.includes(value));
      const removed = fromValues.filter((value) => !toValues.includes(value));

      if (added.length > 0 || removed.length > 0) {
        const parts = [
          ...added.map((value) => `+${value}`),
          ...removed.map((value) => `-${value}`),
        ];

        changes.push({
          scope: 'color',
          kind: 'changed',
          name,
          detail: `values ${parts.join(' ')}`,
        });
      } else if (!same(fromValues, toValues)) {
        changes.push({
          scope: 'color',
          kind: 'changed',
          name,
          detail: 'values order changed',
        });
      }

      changed(
        'color',
        name,
        'notEqualTo',
        withDefault(from.notEqualTo, []),
        withDefault(to.notEqualTo, []),
      );
      changed('color', name, 'contrastTo', from.contrastTo, to.contrastTo);
    },
  );

  return changes;
}

/**
 * Walks two name-keyed records, reports added and removed names, and hands
 * the common ones to `compare`. A `prefix` qualifies nested names like
 * `hair/long`.
 */
function diffRecords(
  changes: DefinitionChange[],
  scope: DefinitionChange['scope'],
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  compare: (name: string, from: Json, to: Json) => void,
  prefix?: string,
): void {
  const names = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  ).sort();

  for (const name of names) {
    const qualified = prefix ? `${prefix}/${name}` : name;

    if (!(name in before)) {
      changes.push({ scope, kind: 'added', name: qualified });
    } else if (!(name in after)) {
      changes.push({ scope, kind: 'removed', name: qualified });
    } else {
      compare(qualified, before[name] as Json, after[name] as Json);
    }
  }
}
