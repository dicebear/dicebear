import { computed, shallowRef, watch, type InjectionKey, type Ref } from 'vue';
import { styleUsesVariable } from '@theme/utils/avatar/style';
import { loadStylePresets, type StylePreset } from '@theme/config/presets';
import {
  groupTagsByCategory,
  tokenCategory,
  toTagTokens,
} from '@theme/utils/avatar/tags';
import useStore from '@theme/stores/playground';
import { useStyleOptions } from './useStyleOptions';
import type { PlaygroundEntry } from './usePlaygroundSelection';

export type ComponentInfo = {
  name: string;
  variants: string[];
  hasProbability: boolean;
  defaultProbability: number;
  hasNonDefaultWeights: boolean;
  defaultWeights: Record<string, number>;
};

export type ColorInfo = {
  name: string;
  key: string;
  defaultValues: string[];
  hasFill: boolean;
  hasAngle: boolean;
  hasFillStops: boolean;
  hasOrder: boolean;
  contrastTo: string | null;
};

export type GeneralEntry = {
  id: 'presets' | 'canvas' | 'output' | 'motion' | 'tags';
  label: string;
};

/**
 * The reset entry, first among the presets. Modelled as a preset with no
 * options so it renders through the same tile and goes through the same
 * apply path, which clears everything and keeps the seed.
 */
const DEFAULT_PRESET: StylePreset = {
  id: '__default',
  name: 'Default',
  summary: 'The style as it ships, with nothing set.',
  description: '',
  options: {},
};

/**
 * An option set as a comparable string. Keys are sorted, because resetting a
 * field and setting it again moves it to the end of the object: the values
 * would still match the preset while the serialisation no longer did.
 */
function fingerprint(options: Record<string, unknown>): string {
  return JSON.stringify(
    Object.keys(options)
      .sort()
      .map((key) => [key, options[key]]),
  );
}

const TRANSFORM_KEYS = [
  'flip',
  'rotate',
  'scale',
  'translateX',
  'translateY',
  'borderRadius',
];
const FONT_KEYS = ['fontFamily', 'fontWeight'];
const OUTPUT_KEYS = ['size', 'title', 'idRandomization'];
const MOTION_KEYS = ['animation', 'animationSpeed', 'animationDelay'];

/**
 * Everything the playground lists on the left and edits on the right: the
 * general entries a style offers, its components and its colors, with the
 * option keys each of them owns. Built once per style and shared through
 * `playgroundEntriesKey`.
 */
export function usePlaygroundEntries(styleName: Ref<string>) {
  const store = useStore();
  const styleOptions = useStyleOptions(styleName);
  const { loadedStyle, descriptor, animationNames, styleColors } = styleOptions;

  const hasFontFamily = computed(() =>
    loadedStyle.value
      ? styleUsesVariable(styleName.value, 'fontFamily')
      : false,
  );
  const hasFontWeight = computed(() =>
    loadedStyle.value
      ? styleUsesVariable(styleName.value, 'fontWeight')
      : false,
  );
  const hasFont = computed(() => hasFontFamily.value || hasFontWeight.value);

  // OptionsDescriptor advertises `animation` and `tags` exactly for styles
  // where they do something.
  const hasAnimation = computed(() => 'animation' in descriptor.value);

  const styleTags = computed<string[]>(() => {
    const field = descriptor.value.tags;

    return field && 'values' in field ? [...field.values] : [];
  });
  const hasTags = computed(() => styleTags.value.length > 0);
  const tagCategories = computed(() => groupTagsByCategory(styleTags.value));

  // Set filter tokens per category, bare and per value, either polarity.
  const tagCounts = computed(() => {
    const counts = new Map<string, number>();

    for (const token of toTagTokens(store.avatarStyleOptions.tags)) {
      const category = tokenCategory(token);

      counts.set(category, (counts.get(category) ?? 0) + 1);
    }

    return counts;
  });

  const components = computed<ComponentInfo[]>(() => {
    const result: ComponentInfo[] = [];
    const style = loadedStyle.value;

    // The descriptor leaves alias components out, so every weighted
    // `*Variant` enum here is a source component.
    for (const [key, field] of Object.entries(descriptor.value)) {
      if (
        !key.endsWith('Variant') ||
        field.type !== 'enum' ||
        !field.weighted
      ) {
        continue;
      }

      const name = key.replace(/Variant$/, '');
      const comp = style?.components().get(name);
      const defaultWeights = comp
        ? Object.fromEntries(
            [...comp.variants()].map(([n, v]) => [n, v.weight()]),
          )
        : {};

      result.push({
        name,
        variants: (field.values as string[]) ?? [],
        hasProbability: `${name}Probability` in descriptor.value,
        defaultProbability: comp?.probability() ?? 100,
        hasNonDefaultWeights: Object.values(defaultWeights).some(
          (w) => w !== 1,
        ),
        defaultWeights,
      });
    }

    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  });

  const colors = computed<ColorInfo[]>(() => {
    const result: ColorInfo[] = [];

    for (const [key, field] of Object.entries(descriptor.value)) {
      if (
        field.type !== 'color' ||
        !key.endsWith('Color') ||
        key.endsWith('ColorFill') ||
        key.endsWith('ColorAngle') ||
        key.endsWith('ColorFillStops')
      ) {
        continue;
      }

      const name = key.replace(/Color$/, '');

      result.push({
        name,
        key,
        defaultValues: styleColors.value[name] ?? [],
        hasFill: `${key}Fill` in descriptor.value,
        hasAngle: `${key}Angle` in descriptor.value,
        hasFillStops: `${key}FillStops` in descriptor.value,
        hasOrder: `${key}Order` in descriptor.value,
        contrastTo:
          field.type === 'color' && typeof field.contrastTo === 'string'
            ? field.contrastTo
            : null,
      });
    }

    const background = result.filter((c) => c.name === 'background');
    const rest = result
      .filter((c) => c.name !== 'background')
      .sort((a, b) => a.name.localeCompare(b.name));

    return [...background, ...rest];
  });

  // The style's presets, fetched on demand. Dropped before the fetch, not
  // after it: a list left up while the next style's file is on the way
  // offers presets whose options that style does not accept.
  const presets = shallowRef<StylePreset[]>([]);

  watch(
    styleName,
    async (name) => {
      presets.value = [];

      const loaded = await loadStylePresets(name);

      if (styleName.value === name) {
        presets.value = loaded;
      }
    },
    { immediate: true },
  );

  const presetChoices = computed(() => [DEFAULT_PRESET, ...presets.value]);

  /** The preset whose options are applied right now, if the two still match. */
  const activePreset = computed<StylePreset | undefined>(() => {
    const options = store.avatarStyleOptionsWithoutDefaults;

    if (Object.keys(options).length === 0) {
      return DEFAULT_PRESET;
    }

    const current = fingerprint(options);

    return presets.value.find(
      (preset) => fingerprint(preset.options) === current,
    );
  });

  // What the list shows next to the entry: the preset in use, or Custom
  // once something was changed by hand.
  const presetLabel = computed(() => activePreset.value?.name ?? 'Custom');

  const generalEntries = computed<GeneralEntry[]>(() => {
    const list: GeneralEntry[] = [];

    if (presets.value.length > 0)
      list.push({ id: 'presets', label: 'Presets' });

    list.push(
      { id: 'canvas', label: 'Canvas' },
      { id: 'output', label: 'Output' },
    );

    if (hasAnimation.value) list.push({ id: 'motion', label: 'Animation' });
    if (hasTags.value) list.push({ id: 'tags', label: 'Tags' });

    return list;
  });

  function activeCount(comp: ComponentInfo): number {
    const val = store.avatarStyleOptions[`${comp.name}Variant`];

    if (val === undefined) return comp.variants.length;
    if (Array.isArray(val)) return val.length;
    if (typeof val === 'object') {
      return Object.values(val as Record<string, number>).filter((w) => w > 0)
        .length;
    }
    if (typeof val === 'string') return 1;

    return comp.variants.length;
  }

  function selectedColors(color: ColorInfo): string[] {
    const val = store.avatarStyleOptions[color.key];

    return Array.isArray(val) ? (val as string[]) : color.defaultValues;
  }

  // Selected colors against the colors of the style. A style without colors
  // of its own shows the plain number.
  function colorCount(color: ColorInfo): string {
    const selected = selectedColors(color).length;
    const total = color.defaultValues.length;

    if (total > 0) return `${selected}/${total}`;

    return selected > 0 ? String(selected) : 'none';
  }

  /** The option keys an entry owns, for its reset and its changed mark. */
  function keysOf(entry: PlaygroundEntry): string[] {
    if (entry.kind === 'component') {
      return [`${entry.name}Variant`, `${entry.name}Probability`];
    }

    if (entry.kind === 'color') {
      const key = `${entry.name}Color`;

      return ['', 'Fill', 'Angle', 'FillStops', 'Order'].map(
        (suffix) => `${key}${suffix}`,
      );
    }

    switch (entry.id) {
      case 'presets':
        return [];
      case 'canvas':
        return [...TRANSFORM_KEYS, ...FONT_KEYS];
      case 'output':
        return OUTPUT_KEYS;
      case 'motion':
        return [
          ...MOTION_KEYS,
          ...animationNames.value.flatMap((name) => [
            `${name}Animation`,
            `${name}AnimationSpeed`,
            `${name}AnimationDelay`,
          ]),
        ];
      case 'tags':
        return ['tags'];
    }
  }

  function isChanged(entry: PlaygroundEntry): boolean {
    return keysOf(entry).some((key) => store.isOptionSet(key));
  }

  function resetEntry(entry: PlaygroundEntry) {
    for (const key of keysOf(entry)) {
      if (store.isOptionSet(key)) {
        store.resetOption(key);
      }
    }
  }

  // The eye in the list. Hidden means a probability of 0. Showing again
  // brings back what the probability was before, or the style's own value.
  const remembered = new Map<string, unknown>();

  function isHidden(comp: ComponentInfo): boolean {
    return store.avatarStyleOptions[`${comp.name}Probability`] === 0;
  }

  function toggleHidden(comp: ComponentInfo) {
    const key = `${comp.name}Probability`;

    if (isHidden(comp)) {
      const previous = remembered.get(key);

      remembered.delete(key);

      if (previous === undefined) {
        delete store.avatarStyleOptions[key];
      } else {
        store.avatarStyleOptions[key] = previous;
      }

      return;
    }

    remembered.set(key, store.avatarStyleOptions[key]);
    store.avatarStyleOptions[key] = 0;
  }

  return {
    ...styleOptions,
    hasFontFamily,
    hasFontWeight,
    hasFont,
    hasAnimation,
    hasTags,
    tagCategories,
    tagCounts,
    components,
    colors,
    generalEntries,
    presets,
    presetChoices,
    activePreset,
    presetLabel,
    activeCount,
    selectedColors,
    colorCount,
    keysOf,
    isChanged,
    resetEntry,
    isHidden,
    toggleHidden,
  };
}

export type PlaygroundEntries = ReturnType<typeof usePlaygroundEntries>;

export const playgroundEntriesKey: InjectionKey<PlaygroundEntries> =
  Symbol('playground-entries');
