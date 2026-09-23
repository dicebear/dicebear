<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import SiteNumberField from '@theme/components/site/SiteNumberField.vue';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';
import SiteSlider from '@theme/components/site/SiteSlider.vue';
import SiteTextField from '@theme/components/site/SiteTextField.vue';
import {
  hexToRgb,
  hslToRgb,
  hsvToHex,
  hsvToRgb,
  isValidHex,
  rgbToHex,
  rgbToHsl,
  rgbToHsvPreservingHue,
} from '@theme/utils/colorSpaces';
import type { Hsv } from '@theme/utils/colorSpaces';

const props = defineProps<{
  hsv: Hsv;
  hex: string;
}>();

const emit = defineEmits<{
  'update:hsv': [hsv: Hsv];
}>();

const rgb = computed(() => hsvToRgb(props.hsv));
const hsl = computed(() => rgbToHsl(rgb.value));

const hexInput = ref(props.hex);

watch(
  () => props.hex,
  (next) => {
    if (next.toLowerCase() !== hexInput.value.toLowerCase()) {
      hexInput.value = next;
    }
  },
);

function commitHex() {
  if (!isValidHex(hexInput.value)) {
    hexInput.value = props.hex;
    return;
  }
  const normalized = hexInput.value.startsWith('#')
    ? hexInput.value
    : `#${hexInput.value}`;
  const next = hexToRgb(normalized);
  emitFromRgb(next.r, next.g, next.b);
  hexInput.value = rgbToHex(next);
}

function emitFromRgb(r: number, g: number, b: number) {
  emit('update:hsv', rgbToHsvPreservingHue({ r, g, b }, props.hsv));
}

function updateRgbChannel(channel: 'r' | 'g' | 'b', value: number) {
  const next = { ...rgb.value, [channel]: value };
  emitFromRgb(next.r, next.g, next.b);
}

function updateHslChannel(channel: 'h' | 's' | 'l', value: number) {
  const next = { ...hsl.value, [channel]: value };
  const asRgb = hslToRgb(next);
  // HSL lets the user move hue directly, so its hue is the authoritative one.
  const max = Math.max(asRgb.r, asRgb.g, asRgb.b) / 255;
  const min = Math.min(asRgb.r, asRgb.g, asRgb.b) / 255;
  const v = max * 100;
  const s = max === 0 ? 0 : ((max - min) / max) * 100;
  emit('update:hsv', { h: next.h, s, v });
}

function updateHsvChannel(channel: 'h' | 's' | 'v', value: number) {
  emit('update:hsv', { ...props.hsv, [channel]: value });
}

function onNativePick(event: Event) {
  const value = (event.target as HTMLInputElement).value.toLowerCase();
  const { r, g, b } = hexToRgb(value);
  // Native pickers emit hex from integer-% S/V (keyboard arrows = ±1%), but
  // 24-bit hex decodes back with sub-% drift on the other axis, so a Down arrow
  // shows up as a diagonal cursor step. Try the rounded HSV first: if it
  // re-encodes to the same hex, the input came from an integer-% native state
  // and we can adopt it cleanly. Otherwise (e.g. mouse click landing on
  // non-integer S/V) keep the exact float HSV so the displayed hex matches.
  const exact = rgbToHsvPreservingHue({ r, g, b }, props.hsv);
  const snapped = {
    h: exact.h,
    s: Math.round(exact.s),
    v: Math.round(exact.v),
  };
  const hex = hsvToHex(snapped).toLowerCase() === value ? snapped : exact;
  emit('update:hsv', hex);
}

type ChannelDef = {
  key: string;
  label: string;
  /** Spoken name of the channel for the slider and the number field. */
  name: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
};

const rgbChannels: ChannelDef[] = [
  { key: 'r', label: 'R', name: 'Red', min: 0, max: 255, step: 1 },
  { key: 'g', label: 'G', name: 'Green', min: 0, max: 255, step: 1 },
  { key: 'b', label: 'B', name: 'Blue', min: 0, max: 255, step: 1 },
];

const hslChannels: ChannelDef[] = [
  { key: 'h', label: 'H', name: 'Hue', unit: '°', min: 0, max: 359, step: 1 },
  {
    key: 's',
    label: 'S',
    name: 'Saturation',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: 'l',
    label: 'L',
    name: 'Lightness',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
  },
];

const hsvChannels: ChannelDef[] = [
  { key: 'h', label: 'H', name: 'Hue', unit: '°', min: 0, max: 359, step: 1 },
  {
    key: 's',
    label: 'S',
    name: 'Saturation',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
  },
  { key: 'v', label: 'V', name: 'Value', unit: '%', min: 0, max: 100, step: 1 },
];

type Space = 'RGB' | 'HSL' | 'HSV';
const spaces: { value: Space; label: string }[] = [
  { value: 'RGB', label: 'RGB' },
  { value: 'HSL', label: 'HSL' },
  { value: 'HSV', label: 'HSV' },
];
const activeSpace = ref<Space>('HSV');

const activeChannels = computed<ChannelDef[]>(() => {
  if (activeSpace.value === 'RGB') return rgbChannels;
  if (activeSpace.value === 'HSL') return hslChannels;
  return hsvChannels;
});

function roundChannels(
  channels: Record<string, number>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(channels).map(([key, value]) => [key, Math.round(value)]),
  );
}

const activeValues = computed<Record<string, number>>(() => {
  if (activeSpace.value === 'RGB') return roundChannels(rgb.value);
  if (activeSpace.value === 'HSL') return roundChannels(hsl.value);
  return roundChannels(props.hsv);
});

function updateActiveChannel(key: string, value: number | null) {
  // An emptied number field keeps the current value until it has a number.
  if (value === null) return;

  if (activeSpace.value === 'RGB') {
    updateRgbChannel(key as 'r' | 'g' | 'b', value);
  } else if (activeSpace.value === 'HSL') {
    updateHslChannel(key as 'h' | 's' | 'l', value);
  } else {
    updateHsvChannel(key as 'h' | 's' | 'v', value);
  }
}
</script>

<template>
  <div class="contrast-sliders">
    <div class="contrast-sliders-hex">
      <input
        type="color"
        :value="hex"
        class="contrast-sliders-hex-swatch hv-border"
        aria-label="Open native color picker"
        @input="onNativePick"
      />
      <SiteTextField
        id="contrast-hex"
        v-model="hexInput"
        class="contrast-sliders-hex-input"
        aria-label="Hex color"
        maxlength="7"
        spellcheck="false"
        autocomplete="off"
        @change="commitHex"
        @keydown.enter="commitHex"
        @blur="commitHex"
      />
      <SiteSegmented
        v-model="activeSpace"
        :options="spaces"
        aria-label="Color space"
        class="contrast-sliders-space"
      />
    </div>

    <div class="contrast-sliders-channels">
      <div
        v-for="channel in activeChannels"
        :key="`${activeSpace}-${channel.key}`"
        class="contrast-sliders-row"
      >
        <span class="contrast-sliders-row-label">{{ channel.label }}</span>
        <SiteSlider
          :model-value="activeValues[channel.key]"
          :min="channel.min"
          :max="channel.max"
          :step="channel.step"
          :aria-label="channel.name"
          @update:model-value="updateActiveChannel(channel.key, $event)"
        />
        <SiteNumberField
          :model-value="activeValues[channel.key]"
          :min="channel.min"
          :max="channel.max"
          :step="channel.step"
          :suffix="channel.unit"
          :aria-label="channel.name"
          size="sm"
          @update:model-value="updateActiveChannel(channel.key, $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contrast-sliders {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &-hex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    &-swatch {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      padding: 0;
      overflow: hidden;
      border: 1px solid var(--db-btn-border);
      border-radius: var(--db-radius-2);
      background: transparent;
      cursor: pointer;

      &::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      &::-webkit-color-swatch {
        border: none;
      }

      &::-moz-color-swatch {
        border: none;
      }
    }
  }

  // Doubled selector, so the width wins over the field's own.
  & &-hex-input {
    flex: 1;
    width: auto;
    min-width: 120px;

    :deep(input) {
      font-family: var(--db-font-mono);
      font-variant-numeric: tabular-nums;
    }
  }

  &-space {
    flex-shrink: 0;
  }

  &-channels {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &-row {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr) 88px;
    gap: 16px;
    align-items: center;

    &-label {
      font-size: 15px;
      line-height: 24px;
      font-weight: 600;
      color: var(--db-ink-2);
    }
  }
}
</style>
