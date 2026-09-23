<script setup lang="ts">
/**
 * One color in the inspector: the values the seed picks from as a list, the
 * fill for gradients, and a note when it is tied to another color.
 */
import { computed, inject, watch } from 'vue';
import { X } from '@lucide/vue';
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
  // The colors that are chosen to contrast with this one.
  contrastedBy?: string[];
}>();

const navigateToColor = inject(navigateToColorKey, null);

function goTo(name: string) {
  navigateToColor?.(name);
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

function removeColor(hex: string) {
  colors.value = colors.value.filter((c) => c !== hex);
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

const fillKeys = [fillKey, angleKey, fillStopsKey, orderKey];
const fillSet = computed(() => fillKeys.some((key) => store.isOptionSet(key)));

function resetFill() {
  for (const key of fillKeys) {
    if (store.isOptionSet(key)) store.resetOption(key);
  }
}

const contrastedNames = computed(() =>
  (props.contrastedBy ?? []).map((name) => ({
    name,
    label: capitalCase(name),
  })),
);
</script>

<template>
  <div class="pg-color">
    <div class="pg-group pg-group-first">
      <div class="pg-group-head">
        <h3 class="pg-group-title">Values</h3>
        <PlaygroundFieldReset
          v-if="store.isOptionSet(colorKey)"
          @click="store.resetOption(colorKey)"
        />
      </div>
      <div class="pg-color-values">
        <div v-for="hex in colors" :key="hex" class="pg-color-value">
          <span
            class="pg-color-value-swatch"
            :style="{ '--swatch': `#${hex}` }"
            aria-hidden="true"
          />
          <span class="pg-color-value-hex">#{{ hex }}</span>
          <button
            type="button"
            class="site-btn site-btn-ghost site-btn-icon site-btn-sm pg-color-value-remove"
            :aria-label="`Remove #${hex}`"
            @click="removeColor(hex)"
          >
            <X :size="14" aria-hidden="true" />
          </button>
        </div>
        <PlaygroundColorPicker
          :preset-colors="props.defaultValues"
          :colors="colors"
          row
          @add="addColor"
        />
      </div>
      <p class="pg-help">The seed picks one of these. One value pins it.</p>
    </div>

    <div v-if="hasFill && colors.length > 0" class="pg-group">
      <div class="pg-group-head">
        <h3 class="pg-group-title">Fill</h3>
        <PlaygroundFieldReset v-if="fillSet" @click="resetFill" />
      </div>
      <div class="pg-color-fill">
        <SiteSegmented
          v-model="fill"
          :options="fillOptions"
          aria-label="Fill"
          fluid
        />

        <div
          v-if="(hasAngle || hasFillStops) && fill !== 'solid'"
          class="pg-fields"
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

        <div v-if="hasOrder && fill !== 'solid'" class="pg-field">
          <div class="pg-field-label">
            <span>Order</span>
          </div>
          <SiteSegmented
            v-model="order"
            :options="orderOptions"
            aria-label="Order"
            fluid
          />
        </div>
      </div>
    </div>

    <p v-if="contrastTo" class="pg-help">
      Chosen to contrast with
      <button
        type="button"
        class="pg-color-link hv-link"
        @click="goTo(contrastTo)"
      >
        {{ capitalCase(contrastTo) }}</button
      >. The value with the strongest contrast wins.
    </p>
    <p v-if="contrastedNames.length > 0" class="pg-help">
      <template v-for="(item, index) in contrastedNames" :key="item.name">
        <template v-if="index > 0">, </template>
        <button
          type="button"
          class="pg-color-link hv-link"
          @click="goTo(item.name)"
        >
          {{ item.label }}
        </button>
      </template>
      {{ contrastedNames.length > 1 ? 'are' : 'is' }} chosen to contrast with
      this color.
    </p>
  </div>
</template>

<style scoped lang="scss">
.pg-color {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-color-values {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.pg-color-value {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
}

/* The checker shows through a color with reduced opacity. */
.pg-color-value-swatch {
  position: relative;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  overflow: hidden;
  border-radius: 7px;
  background: repeating-conic-gradient(
      var(--db-soft) 0% 25%,
      var(--db-paper) 0% 50%
    )
    50% / 8px 8px;
  box-shadow: inset 0 0 0 1px rgba(11, 22, 32, 0.08);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--swatch);
  }
}

.pg-color-value-hex {
  font-family: var(--db-font-mono);
  font-size: 13px;
  line-height: 18px;
  color: var(--db-ink);
}

.pg-color-value-remove {
  margin-left: auto;
}

.pg-color-fill {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-color-link {
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
