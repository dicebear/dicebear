<script setup lang="ts">
/**
 * The column of the simple view: the style's looks as tiles, a row of
 * background colors and the shape of the corners. Every other option is in
 * the advanced view, which the view menu opens. On a phone the same content
 * sits under the picture.
 */
import { computed, inject } from 'vue';
import { storeToRefs } from 'pinia';
import { Plus } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import {
  playgroundEntriesKey,
  type PlaygroundEntries,
} from '@theme/composables/usePlaygroundEntries';
import {
  PLAYGROUND_SHAPES,
  usePlaygroundShape,
} from '@theme/composables/usePlaygroundShape';
import SiteSegmented from '../site/SiteSegmented.vue';
import PlaygroundActions from './PlaygroundActions.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';

withDefaults(
  defineProps<{
    seed: string;
    /** The ways out at the foot. A phone keeps them in a bar of its own. */
    actions?: boolean;
  }>(),
  { actions: true },
);

const emit = defineEmits<{
  'how-to-use': [];
}>();

const injected = inject(playgroundEntriesKey);

if (!injected) {
  throw new Error('PlaygroundSimplePanel needs the entries of PlaygroundApp.');
}

const entries: PlaygroundEntries = injected;

const store = useStore();
const {
  avatarStyleName,
  avatarStyleOptions,
  seed: currentSeed,
} = storeToRefs(store);

// The presets, drawn with the seed at hand. The first is the style as it
// ships.
const looks = computed(() =>
  entries.presetChoices.value.map((preset) => ({
    preset,
    options: { ...preset.options, seed: currentSeed.value },
    active: entries.activePreset.value?.id === preset.id,
  })),
);

const hasLooks = computed(() => entries.presetChoices.value.length > 1);

const BACKGROUND_KEY = 'backgroundColor';

const background = computed(() =>
  entries.colors.value.find((color) => color.name === 'background'),
);

interface Swatch {
  label: string;
  /** The option to set. Null leaves it to the style. */
  value: string[] | null;
  css: string;
}

// One hard stop per color, so a style's own background colors read as a
// set rather than a blend.
function stripes(colors: string[]): string {
  const step = 100 / colors.length;
  const stops = colors.map(
    (color, index) => `#${color} ${index * step}% ${(index + 1) * step}%`,
  );

  return `linear-gradient(135deg, ${stops.join(', ')})`;
}

const NONE_CSS =
  'linear-gradient(to top right, transparent calc(50% - 1px), var(--db-danger) calc(50% - 1px), var(--db-danger) calc(50% + 1px), transparent calc(50% + 1px)), var(--db-paper)';

const PALETTE: [string, string][] = [
  ['White', 'ffffff'],
  ['Sand', 'f1ece4'],
  ['Rose', 'ffe3ea'],
  ['Sky', 'e3edff'],
  ['Mint', 'e2f5e9'],
  ['Night', '101216'],
];

const defaults = computed(() => background.value?.defaultValues ?? []);

const swatches = computed<Swatch[]>(() => [
  ...(defaults.value.length > 0
    ? [
        {
          label: 'Style colors',
          value: null,
          css: stripes(defaults.value.slice(0, 4)),
        },
      ]
    : []),
  { label: 'None', value: [], css: NONE_CSS },
  ...PALETTE.map(([label, hex]) => ({
    label,
    value: [hex],
    css: `#${hex}`,
  })),
]);

const current = computed<string[] | undefined>(() => {
  const value = avatarStyleOptions.value[BACKGROUND_KEY];

  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : undefined;
});

function sameColors(a: string[], b: string[]) {
  return (
    a.length === b.length &&
    a.every((color, index) => color.toLowerCase() === b[index].toLowerCase())
  );
}

function isActive(swatch: Swatch): boolean {
  if (current.value === undefined) {
    // Left to the style: its own colors, or nothing when it has none.
    return (
      swatch.value === null ||
      (swatch.value.length === 0 && defaults.value.length === 0)
    );
  }

  return swatch.value !== null && sameColors(swatch.value, current.value);
}

// A color picked by hand, shown in the last field.
const custom = computed(() => {
  const value = current.value;

  if (!value || value.length !== 1) return undefined;
  if (swatches.value.some((swatch) => isActive(swatch))) return undefined;

  return value[0];
});

function setBackground(value: string[] | null) {
  if (value === null) {
    delete avatarStyleOptions.value[BACKGROUND_KEY];
  } else {
    avatarStyleOptions.value[BACKGROUND_KEY] = [...value];
  }
}

function onPick(event: Event) {
  const hex = (event.target as HTMLInputElement).value.replace('#', '');

  setBackground([hex]);
}

// The column has room for the words, so the shapes go without icons.
const shapes = PLAYGROUND_SHAPES.map(({ value, label }) => ({ value, label }));
const shape = usePlaygroundShape();
</script>

<template>
  <div class="pg-simple">
    <div class="pg-simple-body">
      <section v-if="hasLooks" class="pg-simple-section">
        <h2 class="pg-simple-title">Look</h2>
        <div class="pg-simple-looks">
          <button
            v-for="look in looks"
            :key="look.preset.id"
            type="button"
            class="pg-simple-look"
            :aria-label="look.preset.name"
            :aria-pressed="look.active"
            :data-tip="look.preset.name"
            @click="store.applyPreset(look.preset)"
          >
            <PlaygroundThumb
              :style-name="avatarStyleName"
              :options="look.options"
              surface="tile"
            />
          </button>
        </div>
      </section>

      <section v-if="background" class="pg-simple-section">
        <h2 class="pg-simple-title">Background</h2>
        <div class="pg-simple-swatches" role="group" aria-label="Background">
          <button
            v-for="swatch in swatches"
            :key="swatch.label"
            type="button"
            class="pg-simple-swatch"
            :style="{ background: swatch.css }"
            :aria-label="swatch.label"
            :aria-pressed="isActive(swatch)"
            :data-tip="swatch.label"
            @click="setBackground(swatch.value)"
          />
          <label
            class="pg-simple-swatch is-custom"
            :class="{ 'is-active': custom }"
            :style="custom ? { background: `#${custom}` } : undefined"
            data-tip="Pick a color"
          >
            <Plus v-if="!custom" :size="16" aria-hidden="true" />
            <input
              type="color"
              class="pg-simple-color"
              aria-label="Pick a color"
              :value="`#${custom ?? 'ffffff'}`"
              @input="onPick"
            />
          </label>
        </div>
      </section>

      <section class="pg-simple-section">
        <h2 class="pg-simple-title">Shape</h2>
        <SiteSegmented
          v-model="shape"
          :options="shapes"
          aria-label="Shape"
          fluid
        />
      </section>
    </div>

    <div v-if="actions" class="pg-simple-actions">
      <PlaygroundActions :seed="seed" @how-to-use="emit('how-to-use')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-simple {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;

  &-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 28px;
    min-height: 0;
    padding: 20px 12px 24px;
    overflow-y: auto;
  }

  &-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &-title {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink);
  }

  /* Five across, so a style's dozen looks take three rows and the shape
     still shows on a laptop screen. */
  &-looks {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  &-look {
    aspect-ratio: 1;
    padding: 0;
    border: 0;
    border-radius: var(--db-radius-3);
    background: none;
    cursor: pointer;

    :deep(.pg-thumb) {
      width: 100%;
      height: 100%;
      border-radius: var(--db-radius-3);
    }

    &:hover {
      outline: 2px solid var(--db-hover-border);
      outline-offset: 2px;
    }

    &[aria-pressed='true'] {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
      cursor: default;
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  &-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &-swatch {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    box-sizing: border-box;
    border: 1px solid var(--db-field-border);
    border-radius: var(--db-radius-2);
    color: var(--db-ink-2);
    cursor: pointer;

    &:hover {
      border-color: var(--db-hover-border);
    }

    &[aria-pressed='true'],
    &.is-active {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }

    &:focus-visible,
    &:has(:focus-visible) {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }

    &.is-custom {
      border-style: dashed;
      background: var(--db-paper);

      &.is-active {
        border-style: solid;
      }
    }
  }

  /* The native picker lies over the whole field, so a click on the field
     opens it in every browser. */
  &-color {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    opacity: 0;
    cursor: pointer;
  }

  /* Fixed under the options, as in the inspector of the advanced view. */
  &-actions {
    flex-shrink: 0;
    padding: 16px 12px 20px;
    border-top: 1px solid var(--db-line);
    background: var(--db-paper);
  }

  @media (max-width: 959px) {
    &-body {
      padding: 16px 16px 20px;
      overflow: visible;
    }

    /* Across the full width the tiles keep their size and the row takes
       as many as fit. */
    &-looks {
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    }

    &-actions {
      position: sticky;
      bottom: 0;
      padding: 12px 16px 16px;
    }
  }
}
</style>
