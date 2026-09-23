<script setup lang="ts">
// A hand-built saturation and value square: it has to host the iso-contrast
// overlay that maps the WCAG pick boundary onto the plane.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import SiteSlider from '@theme/components/site/SiteSlider.vue';
import { clamp, hsvToHex, luminance } from '@theme/utils/colorSpaces';
import type { Hsv } from '@theme/utils/colorSpaces';

const props = defineProps<{
  hsv: Hsv;
  hex: string;
  contrastA: string;
  contrastB: string;
}>();

const emit = defineEmits<{
  'update:hsv': [hsv: Hsv];
}>();

const surface = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
const surfaceSize = ref({ width: 0, height: 0 });

function setFromPointer(event: PointerEvent) {
  if (!surface.value) return;
  const rect = surface.value.getBoundingClientRect();
  const s = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
  const v = clamp((1 - (event.clientY - rect.top) / rect.height) * 100, 0, 100);
  if (s === props.hsv.s && v === props.hsv.v) return;
  emit('update:hsv', { h: props.hsv.h, s, v });
}

function onPointerDown(event: PointerEvent) {
  isDragging.value = true;
  (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  setFromPointer(event);
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return;
  setFromPointer(event);
}

function onPointerUp(event: PointerEvent) {
  isDragging.value = false;
  (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
}

function onKeydown(event: KeyboardEvent) {
  const step = event.shiftKey ? 5 : 1;
  let { s, v } = props.hsv;
  let handled = true;

  switch (event.key) {
    case 'ArrowLeft':
      s = clamp(s - step, 0, 100);
      break;
    case 'ArrowRight':
      s = clamp(s + step, 0, 100);
      break;
    case 'ArrowUp':
      v = clamp(v + step, 0, 100);
      break;
    case 'ArrowDown':
      v = clamp(v - step, 0, 100);
      break;
    default:
      handled = false;
  }

  if (handled) {
    event.preventDefault();
    if (s === props.hsv.s && v === props.hsv.v) return;
    emit('update:hsv', { h: props.hsv.h, s, v });
  }
}

function setHue(h: number) {
  if (h === props.hsv.h) return;
  emit('update:hsv', { ...props.hsv, h });
}

// Tracks the surface dimensions so the SVG overlay scales correctly.
function measureSurface() {
  if (!surface.value) return;
  const rect = surface.value.getBoundingClientRect();
  surfaceSize.value = { width: rect.width, height: rect.height };
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  measureSurface();
  if (typeof ResizeObserver !== 'undefined' && surface.value) {
    resizeObserver = new ResizeObserver(measureSurface);
    resizeObserver.observe(surface.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

const cursorStyle = computed(() => ({
  left: `${props.hsv.s}%`,
  top: `${100 - props.hsv.v}%`,
}));

const ariaValueText = computed(
  () =>
    `${hsvToHex(props.hsv)}, saturation ${Math.round(props.hsv.s)} percent, value ${Math.round(props.hsv.v)} percent`,
);

// Layered gradients (white→hue overlaid with transparent→black) compose to
// the canonical HSV saturation/value square at the current hue.
const hueOnlyBackground = computed(() => {
  const hueColor = hsvToHex({ h: props.hsv.h, s: 100, v: 100 });
  return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`;
});

// Iso-contrast curve: the set of HSV (s, v) points (at the current hue)
// where contrast against A equals contrast against B. The equal-contrast
// luminance is L* = sqrt((L_a + 0.05) * (L_b + 0.05)) - 0.05. We binary
// search V along each S step so the curve plots exactly the points where
// the core's contrast sort would swap its pick. Tracks only hue (not s/v) so
// dragging the crosshair doesn't retrigger ~1.9k luminance calls.
const isoContrastPath = computed<string | null>(() => {
  if (surfaceSize.value.width === 0) return null;

  const hue = props.hsv.h;
  const la = luminance(props.contrastA);
  const lb = luminance(props.contrastB);
  const target = Math.sqrt((la + 0.05) * (lb + 0.05)) - 0.05;

  if (target <= 0 || target >= 1) return null;

  const steps = 80;
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * 100;
    let lo = 0;
    let hi = 100;

    for (let iter = 0; iter < 24; iter++) {
      const mid = (lo + hi) / 2;
      const lum = luminance(hsvToHex({ h: hue, s, v: mid }));
      if (lum < target) lo = mid;
      else hi = mid;
    }

    const v = (lo + hi) / 2;
    if (v <= 0 || v >= 100) continue;

    points.push(`${s},${100 - v}`);
  }

  if (points.length < 2) return null;
  return `M ${points.join(' L ')}`;
});
</script>

<template>
  <div class="contrast-canvas">
    <div
      ref="surface"
      class="contrast-canvas-surface"
      :style="{ background: hueOnlyBackground }"
      role="slider"
      aria-label="Color picker: drag or use arrow keys"
      :aria-valuetext="ariaValueText"
      tabindex="0"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeydown"
    >
      <svg
        v-if="isoContrastPath"
        class="contrast-canvas-iso"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          :d="isoContrastPath"
          class="contrast-canvas-iso-outline"
          vector-effect="non-scaling-stroke"
        />
        <path
          :d="isoContrastPath"
          class="contrast-canvas-iso-stroke"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <div
        class="contrast-canvas-cursor"
        :style="cursorStyle"
        aria-hidden="true"
      />
    </div>

    <div class="contrast-canvas-hue">
      <span class="contrast-canvas-hue-label">Hue</span>
      <SiteSlider
        :model-value="Math.round(hsv.h)"
        :min="0"
        :max="359"
        aria-label="Hue"
        class="contrast-canvas-hue-slider"
        @update:model-value="setHue"
      />
      <span class="contrast-canvas-hue-hex">{{ hex }}</span>
    </div>

    <p class="contrast-canvas-hint">
      The dashed line marks where the pick switches from one contrast color to
      the other.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.contrast-canvas {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  &-surface {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--db-radius-6);
    cursor: crosshair;
    touch-action: none;
    user-select: none;

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 3px;
    }
  }

  &-iso {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    &-outline {
      fill: none;
      stroke: rgba(0, 0, 0, 0.35);
      stroke-width: 4;
      stroke-linejoin: round;
      stroke-linecap: round;
    }

    &-stroke {
      fill: none;
      stroke: #fff;
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-dasharray: 8 6;
    }
  }

  &-cursor {
    position: absolute;
    width: 22px;
    height: 22px;
    box-sizing: border-box;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.35),
      inset 0 0 0 1px rgba(0, 0, 0, 0.35);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &-hue {
    display: flex;
    align-items: center;
    gap: 20px;

    &-label {
      flex-shrink: 0;
      width: 40px;
      font-size: 16px;
      line-height: 26px;
      font-weight: 600;
      color: var(--db-ink-2);
    }

    &-hex {
      flex-shrink: 0;
      width: 80px;
      font-family: var(--db-font-mono);
      font-size: 15px;
      line-height: 24px;
      text-align: right;
      color: var(--db-ink);
      font-variant-numeric: tabular-nums;
    }
  }

  // The hue slider shows the spectrum as its track and no filled part.
  & &-hue-slider {
    flex: 1;
    min-width: 0;

    &::before {
      top: 4px;
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(
        to right,
        #f00,
        #ff0,
        #0f0,
        #0ff,
        #00f,
        #f0f,
        #f00
      );
    }

    &::after {
      display: none;
    }
  }

  &-hint {
    margin: 0;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);
  }

  @media (max-width: 959px) {
    max-width: 560px;
  }

  @media (max-width: 767px) {
    &-surface {
      border-radius: var(--db-radius-5);
    }

    &-hue {
      gap: 12px;
    }

    &-hint {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
