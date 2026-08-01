<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
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
  // HSL lets the user move hue directly; treat it as the authoritative hue.
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
  unit?: string;
  min: number;
  max: number;
  step: number;
};

const rgbChannels: ChannelDef[] = [
  { key: 'r', label: 'R', min: 0, max: 255, step: 1 },
  { key: 'g', label: 'G', min: 0, max: 255, step: 1 },
  { key: 'b', label: 'B', min: 0, max: 255, step: 1 },
];

const hslChannels: ChannelDef[] = [
  { key: 'h', label: 'H', unit: '°', min: 0, max: 359, step: 1 },
  { key: 's', label: 'S', unit: '%', min: 0, max: 100, step: 1 },
  { key: 'l', label: 'L', unit: '%', min: 0, max: 100, step: 1 },
];

const hsvChannels: ChannelDef[] = [
  { key: 'h', label: 'H', unit: '°', min: 0, max: 359, step: 1 },
  { key: 's', label: 'S', unit: '%', min: 0, max: 100, step: 1 },
  { key: 'v', label: 'V', unit: '%', min: 0, max: 100, step: 1 },
];

type Space = 'RGB' | 'HSL' | 'HSV';
const spaces: Space[] = ['RGB', 'HSL', 'HSV'];
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

function updateActiveChannel(key: string, value: number) {
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
        class="contrast-sliders-hex-swatch"
        aria-label="Open native color picker"
        @input="onNativePick"
      />
      <InputText
        id="contrast-hex"
        v-model="hexInput"
        class="contrast-sliders-hex-input"
        aria-label="Hex color"
        :maxlength="7"
        spellcheck="false"
        autocomplete="off"
        @change="commitHex"
        @keydown.enter="commitHex"
        @blur="commitHex"
      />
    </div>

    <SelectButton
      v-model="activeSpace"
      :options="spaces"
      :allow-empty="false"
      size="small"
      aria-label="Color space"
      class="contrast-sliders-space-toggle"
    />

    <div class="contrast-sliders-channels">
      <div
        v-for="channel in activeChannels"
        :key="`${activeSpace}-${channel.key}`"
        class="contrast-sliders-row"
      >
        <span class="contrast-sliders-row-label">
          {{ channel.label }}
          <span v-if="channel.unit" class="contrast-sliders-row-unit">{{
            channel.unit
          }}</span>
        </span>
        <Slider
          :model-value="activeValues[channel.key]"
          :min="channel.min"
          :max="channel.max"
          :step="channel.step"
          class="contrast-sliders-row-slider"
          @update:model-value="
            updateActiveChannel(channel.key, $event as number)
          "
        />
        <InputNumber
          :model-value="activeValues[channel.key]"
          :min="channel.min"
          :max="channel.max"
          :step="channel.step"
          :show-buttons="false"
          fluid
          class="contrast-sliders-row-input"
          input-class="contrast-sliders-row-input-field"
          @update:model-value="updateActiveChannel(channel.key, $event ?? 0)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contrast-sliders {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &-hex {
    display: flex;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 10px;

    &-swatch {
      width: 42px;
      height: 42px;
      padding: 2px;
      flex-shrink: 0;
      border: 1px solid var(--vp-c-border);
      border-radius: var(--vp-radius-xs);
      background: var(--vp-c-bg);
      cursor: pointer;

      &::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      &::-webkit-color-swatch {
        border: none;
        border-radius: 4px;
      }

      &::-moz-color-swatch {
        border: none;
        border-radius: 4px;
      }
    }

    &-input {
      flex: 1;
      min-width: 0;
      font-family: var(--vp-font-family-mono);
      font-variant-numeric: tabular-nums;
    }
  }

  &-space-toggle {
    display: flex;

    :deep(.p-togglebutton) {
      flex: 1;
    }
  }

  &-channels {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-row {
    display: grid;
    grid-template-columns: 36px 1fr 72px;
    align-items: center;
    gap: 12px;

    &-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--ui-c-text-muted);
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    &-unit {
      font-size: 10px;
      font-weight: 500;
      color: var(--ui-c-text-subtle);
    }

    &-slider {
      min-width: 0;
    }

    &-input :deep(.p-inputnumber-input) {
      text-align: right;
      font-variant-numeric: tabular-nums;
      padding-inline: 8px;
    }
  }
}
</style>
