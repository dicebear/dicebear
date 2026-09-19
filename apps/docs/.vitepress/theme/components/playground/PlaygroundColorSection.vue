<script setup lang="ts">
import { computed, inject, watch } from 'vue';
import { Link2 } from '@lucide/vue';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';
import { capitalCase } from 'change-case';
import useStore from '@theme/stores/playground';
import { stripHash } from '@theme/utils/avatar/colors';
import { navigateToColorKey } from '@theme/components/styles/styleOptionsKeys';
import PlaygroundColorPicker from './PlaygroundColorPicker.vue';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const props = defineProps<{
  colorName: string;
  defaultValues: string[];
  hasFill: boolean;
  hasAngle: boolean;
  hasFillStops: boolean;
  hasOrder: boolean;
  contrastTo?: string | null;
}>();

const navigateToColor = inject(navigateToColorKey, null);

function onContrastLinkClick() {
  if (props.contrastTo && navigateToColor) {
    navigateToColor(props.contrastTo);
  }
}

const store = useStore();

const colorKey = `${props.colorName}Color`;
const fillKey = `${colorKey}Fill`;
const angleKey = `${colorKey}Angle`;
const fillStopsKey = `${colorKey}FillStops`;
const orderKey = `${colorKey}Order`;

const colors = computed<string[]>({
  get: () => {
    const val = store.avatarStyleOptions[colorKey];

    if (Array.isArray(val)) return val;

    return props.defaultValues;
  },
  set: (val: string[]) => {
    const matchesDefaults =
      val.length === props.defaultValues.length &&
      val.every((v, i) => v === props.defaultValues[i]);

    if (matchesDefaults) {
      delete store.avatarStyleOptions[colorKey];
    } else {
      store.avatarStyleOptions[colorKey] = [...val];
    }
  },
});

function addColor(hex: string) {
  if (!hex) return;

  const clean = stripHash(hex).toLowerCase();

  if (colors.value.includes(clean)) return;

  colors.value = [...colors.value, clean];
}

// Every color of the style stays visible as a swatch, pressed while it is
// in use. Colors added by hand follow and leave again with a click.
const swatches = computed(() => {
  const customs = colors.value.filter((c) => !props.defaultValues.includes(c));

  return [...props.defaultValues, ...customs].map((hex) => ({
    hex,
    on: colors.value.includes(hex),
    custom: !props.defaultValues.includes(hex),
  }));
});

function toggleColor(hex: string) {
  if (colors.value.includes(hex)) {
    colors.value = colors.value.filter((c) => c !== hex);

    return;
  }

  // A color of the style returns to its place in the style's order, ahead of
  // the colors added by hand.
  const customs = colors.value.filter((c) => !props.defaultValues.includes(c));

  colors.value = [
    ...props.defaultValues.filter((c) => c === hex || colors.value.includes(c)),
    ...customs,
  ];
}

const fillOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
];

const fill = computed({
  get: () => {
    const val = store.avatarStyleOptions[fillKey];

    if (Array.isArray(val)) return val[0] ?? 'solid';

    return typeof val === 'string' ? val : 'solid';
  },
  set: (val: string) => {
    if (val === 'solid') {
      delete store.avatarStyleOptions[fillKey];
    } else {
      store.avatarStyleOptions[fillKey] = [val];
    }
  },
});

const orderOptions = [
  { label: 'Random', value: 'random' },
  { label: 'Fixed', value: 'fixed' },
];

// Unlike *ColorFill, the *ColorOrder option takes a single value only; the
// schema rejects the array form.
const order = computed({
  get: () => {
    const val = store.avatarStyleOptions[orderKey];

    return typeof val === 'string' ? val : 'random';
  },
  set: (val: string) => {
    if (val === 'random') {
      delete store.avatarStyleOptions[orderKey];
    } else {
      store.avatarStyleOptions[orderKey] = val;
    }
  },
});

// The order field only shows for gradient fills, but unlike angle or stops
// the core would still apply a lingering value to a solid fill (`fixed` pins
// the first color). Clear it when the fill returns to solid, so a hidden
// field never changes the avatar.
watch(fill, (val) => {
  if (val === 'solid') {
    delete store.avatarStyleOptions[orderKey];
  }
});
</script>

<template>
  <div class="pg-color">
    <p v-if="contrastTo" class="pg-color-contrast" role="note">
      <Link2 :size="16" aria-hidden="true" class="pg-color-contrast-icon" />
      <span>
        Linked to
        <button
          type="button"
          class="pg-color-contrast-link hv-link"
          @click="onContrastLinkClick"
        >
          {{ capitalCase(contrastTo) }}</button
        >. The value with the strongest contrast against the chosen
        {{ capitalCase(contrastTo).toLowerCase() }} is preferred. Adding more
        options here introduces variation, but the highest-contrast value still
        dominates.
      </span>
    </p>

    <div class="pg-field">
      <div class="pg-field-label">
        <span>Color</span>
        <span class="pg-field-tools">
          <PlaygroundFieldReset
            v-if="store.isOptionSet(colorKey)"
            @click="store.resetOption(colorKey)"
          />
        </span>
      </div>
      <div class="pg-color-swatches">
        <button
          v-for="swatch in swatches"
          :key="swatch.hex"
          type="button"
          class="pg-color-swatch hv-swatch"
          :aria-pressed="swatch.on"
          :aria-label="`#${swatch.hex}`"
          :title="
            swatch.custom
              ? `#${swatch.hex} (click to remove)`
              : `#${swatch.hex}`
          "
          :style="{ '--swatch': `#${swatch.hex}` }"
          @click="toggleColor(swatch.hex)"
        ></button>
        <PlaygroundColorPicker
          :preset-colors="props.defaultValues"
          :colors="colors"
          @add="addColor"
        />
      </div>
    </div>

    <template v-if="hasFill && colors.length > 0">
      <div class="pg-field">
        <div class="pg-field-label">
          <span>Fill</span>
          <span class="pg-field-tools">
            <PlaygroundFieldReset
              v-if="store.isOptionSet(fillKey)"
              @click="store.resetOption(fillKey)"
            />
          </span>
        </div>
        <SiteSegmented
          v-model="fill"
          :options="fillOptions"
          aria-label="Fill"
          fluid
        />
      </div>

      <div v-if="hasOrder && fill !== 'solid'" class="pg-field">
        <div class="pg-field-label">
          <span>Order</span>
          <span class="pg-field-tools">
            <PlaygroundFieldReset
              v-if="store.isOptionSet(orderKey)"
              @click="store.resetOption(orderKey)"
            />
          </span>
        </div>
        <SiteSegmented
          v-model="order"
          :options="orderOptions"
          aria-label="Order"
          fluid
        />
      </div>

      <div
        v-if="(hasAngle || hasFillStops) && fill !== 'solid'"
        class="pg-color-pair"
      >
        <PlaygroundRangeField
          v-if="hasAngle"
          label="Angle"
          :option-key="angleKey"
          :min="-360"
          :max="360"
          :step="1"
          unit="°"
          :default-single="0"
        />
        <PlaygroundRangeField
          v-if="hasFillStops"
          label="Stops"
          :option-key="fillStopsKey"
          :min="2"
          :max="5"
          :step="1"
          :default-single="2"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pg-color {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 4px;
}

/* The checker shows through a color with reduced opacity. */
.pg-color-swatch {
  position: relative;
  width: 36px;
  height: 36px;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid var(--db-line);
  border-radius: 10px;
  background: repeating-conic-gradient(
      var(--db-soft) 0% 25%,
      var(--db-paper) 0% 50%
    )
    50% / 10px 10px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--swatch);
  }

  &[aria-pressed='false'] {
    opacity: 0.35;
  }

  &[aria-pressed='true'] {
    box-shadow:
      0 0 0 2px var(--db-paper),
      0 0 0 4px var(--db-brand);
  }
}

.pg-color-pair {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 20px;
}

@container pg-options (max-width: 520px) {
  .pg-color-pair {
    grid-auto-flow: row;
  }
}

.pg-color-contrast {
  display: flex;
  gap: 10px;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--db-muted);
}

.pg-color-contrast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.pg-color-contrast-link {
  display: inline;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  font: inherit;
  color: var(--db-brand-text);
  cursor: pointer;
}
</style>
