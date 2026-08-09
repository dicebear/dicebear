<script setup lang="ts">
import { computed, inject, watch } from 'vue';
import { Trash2, ArrowLeftRight, Link2 } from '@lucide/vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Slider from 'primevue/slider';
import { capitalCase } from 'change-case';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import { stripHash } from '@theme/utils/avatar/colors';
import { navigateToColorKey } from '@theme/components/styles/styleOptionsKeys';
import PlaygroundColorPicker from './PlaygroundColorPicker.vue';
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

function removeColor(index: number) {
  const next = [...colors.value];

  next.splice(index, 1);
  colors.value = next;
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

const {
  isRangeMode,
  toggleRangeMode,
  resetRangeField,
  singleComputed,
  rangeComputed,
} = useRangeField(store.avatarStyleOptions);

const angleSingle = singleComputed(angleKey, 0);
const angleRange = rangeComputed(angleKey, 0);

const fillStopsSingle = singleComputed(fillStopsKey, 2);
const fillStopsRange = rangeComputed(fillStopsKey, 2);
</script>

<template>
  <div class="pg-color">
    <div v-if="contrastTo" class="pg-color-contrast-banner" role="note">
      <Link2 :size="14" class="pg-color-contrast-banner-icon" />
      <p class="pg-color-contrast-banner-text">
        Linked to
        <button
          type="button"
          class="pg-color-contrast-banner-link"
          @click="onContrastLinkClick"
        >
          {{ capitalCase(contrastTo) }}</button
        >. The value with the strongest contrast against the chosen
        {{ capitalCase(contrastTo).toLowerCase() }} is preferred. Adding more
        options here introduces variation, but the highest-contrast value still
        dominates.
      </p>
    </div>

    <div class="pg-color-label">
      <span>Color</span>
      <PlaygroundFieldReset
        v-if="store.isOptionSet(colorKey)"
        @click="store.resetOption(colorKey)"
      />
    </div>
    <div class="pg-color-grid">
      <div
        v-for="(color, i) in colors"
        :key="i"
        class="pg-color-tile"
        :style="{ '--tile-color': `#${color}` }"
        @click="removeColor(i)"
      >
        <div class="pg-color-tile-delete">
          <Trash2 :size="16" />
        </div>
      </div>
      <PlaygroundColorPicker
        :preset-colors="props.defaultValues"
        :colors="colors"
        @add="addColor"
      />
    </div>

    <template v-if="hasFill && colors.length > 0">
      <div class="pg-field">
        <div class="pg-field-label">
          <span>Fill</span>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(fillKey)"
            @click="store.resetOption(fillKey)"
          />
        </div>
        <Select
          v-model="fill"
          :options="fillOptions"
          option-label="label"
          option-value="value"
          class="pg-color-fill-select"
        />
      </div>

      <div class="pg-field" v-if="hasOrder && fill !== 'solid'">
        <div class="pg-field-label">
          <span>Order</span>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(orderKey)"
            @click="store.resetOption(orderKey)"
          />
        </div>
        <Select
          v-model="order"
          :options="orderOptions"
          option-label="label"
          option-value="value"
          class="pg-color-fill-select"
        />
      </div>

      <div class="pg-field" v-if="hasAngle && fill !== 'solid'">
        <div class="pg-field-label">
          <span>Angle</span>
          <Button
            size="small"
            :severity="isRangeMode(angleKey) ? 'primary' : 'secondary'"
            variant="outlined"
            v-tooltip="
              isRangeMode(angleKey)
                ? 'Switch to fixed value'
                : 'Switch to range'
            "
            @click="toggleRangeMode(angleKey, 0)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(angleKey)"
            @click="resetRangeField(angleKey)"
          />
          <span class="pg-field-value" v-if="isRangeMode(angleKey)"
            >{{ angleRange[0] }}° — {{ angleRange[1] }}°</span
          >
          <span class="pg-field-value" v-else>{{ angleSingle }}°</span>
        </div>
        <Slider
          v-if="isRangeMode(angleKey)"
          v-model="angleRange"
          :range="true"
          :min="-360"
          :max="360"
          :step="1"
        />
        <Slider v-else v-model="angleSingle" :min="-360" :max="360" :step="1" />
      </div>

      <div class="pg-field" v-if="hasFillStops && fill !== 'solid'">
        <div class="pg-field-label">
          <span>Stops</span>
          <Button
            size="small"
            :severity="isRangeMode(fillStopsKey) ? 'primary' : 'secondary'"
            variant="outlined"
            v-tooltip="
              isRangeMode(fillStopsKey)
                ? 'Switch to fixed value'
                : 'Switch to range'
            "
            @click="toggleRangeMode(fillStopsKey, 2)"
            class="pg-field-toggle"
          >
            <ArrowLeftRight :size="14" />
          </Button>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(fillStopsKey)"
            @click="resetRangeField(fillStopsKey)"
          />
          <span class="pg-field-value" v-if="isRangeMode(fillStopsKey)"
            >{{ fillStopsRange[0] }} — {{ fillStopsRange[1] }}</span
          >
          <span class="pg-field-value" v-else>{{ fillStopsSingle }}</span>
        </div>
        <Slider
          v-if="isRangeMode(fillStopsKey)"
          v-model="fillStopsRange"
          :range="true"
          :min="2"
          :max="5"
          :step="1"
        />
        <Slider v-else v-model="fillStopsSingle" :min="2" :max="5" :step="1" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pg-color {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-color-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-c-text-muted);
}

.pg-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 6px;
}

.pg-color-tile {
  aspect-ratio: 1;
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-xs);
  background: repeating-conic-gradient(
      var(--vp-c-bg-soft) 0% 25%,
      var(--vp-c-bg) 0% 50%
    )
    50% / 10px 10px;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--tile-color);
    border-radius: calc(var(--vp-radius-xs) - 1px);
  }

  .pg-color-tile-delete {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: calc(var(--vp-radius-xs) - 1px);
    color: white;
    opacity: 0;
    transition: opacity var(--duration-fast) ease;
    z-index: 1;
  }

  &:hover .pg-color-tile-delete {
    opacity: 1;
  }
}

.pg-color-fill-select {
  width: 100%;
}

.pg-color-contrast-banner {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ui-c-text-muted);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-xs);
}

.pg-color-contrast-banner-icon {
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.7;
}

.pg-color-contrast-banner-text {
  margin: 0;
}

.pg-color-contrast-banner-link {
  display: inline;
  padding: 0;
  margin: 0;
  font: inherit;
  color: var(--vp-c-brand-1);
  background: transparent;
  border: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: var(--vp-c-brand-2);
  }
}
</style>
