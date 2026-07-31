<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useData } from 'vitepress';
import { useVisibility } from '@theme/composables/useVisibility';
import {
  buildLandDots,
  projectX,
  projectY,
  DOT_COLUMNS,
  MAP_ASPECT,
} from '@theme/utils/landDots';
import {
  createPreloadBuffer,
  type PreloadBuffer,
} from '@theme/utils/avatarPreload';

const props = defineProps<{
  rate: number;
}>();

const { isDark } = useData();

const rootRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const isVisible = useVisibility(rootRef, { once: false, threshold: 0.1 });

const apiBase = 'https://api.dicebear.com/10.x';
const avatarStyles = [
  'thumbs',
  'shapes',
  'lorelei',
  'pixel-art',
  'adventurer',
  'bottts',
  'avataaars',
  'notionists',
];

interface MapMarker {
  id: number;
  /** Position on the map, both as a percentage of width and height. */
  x: number;
  y: number;
  url: string;
}

const markers = ref<MapMarker[]>([]);

let landDots: [number, number][] = [];
let preloadBuffer: PreloadBuffer | null = null;
let markerId = 0;
let markerInterval: ReturnType<typeof setInterval> | null = null;
let resizeObserver: ResizeObserver | null = null;
const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

function generateAvatarUrl() {
  const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
  const seed = Math.random().toString(36).slice(2, 8);
  return `${apiBase}/${style}/svg?seed=${seed}&size=64`;
}

// A marker is roughly this wide relative to the map. Two of them closer than
// that overlap, which reads as one smudge rather than two locations.
const MIN_MARKER_GAP = 7;

function pickPosition(): { x: number; y: number } | null {
  if (landDots.length === 0) return null;

  const spot = () => {
    const [lat, lng] = landDots[Math.floor(Math.random() * landDots.length)];
    return { x: projectX(lng) * 100, y: projectY(lat) * 100 };
  };

  for (let attempt = 0; attempt < 30; attempt++) {
    const candidate = spot();

    // The map is far wider than tall, so a percentage of height covers much
    // less screen than the same percentage of width. Scaling y by the aspect
    // ratio puts both onto the same scale before measuring the distance.
    const clear = markers.value.every(
      (m) =>
        Math.hypot(candidate.x - m.x, (candidate.y - m.y) / MAP_ASPECT) >=
        MIN_MARKER_GAP,
    );

    if (clear) return candidate;
  }

  return spot();
}

// Every marker is on screen at once, so the lifetime divided by the interval
// is the count that settles. Six leaves the continents readable underneath.
const MARKER_LIFETIME = 6000;
const MARKER_INTERVAL = 1000;

function addMarker() {
  const position = pickPosition();

  if (!position) return;

  const marker: MapMarker = {
    id: markerId++,
    x: position.x,
    y: position.y,
    url: preloadBuffer ? preloadBuffer.getPreloadedUrl() : generateAvatarUrl(),
  };

  markers.value.push(marker);

  pendingTimeouts.push(
    setTimeout(() => {
      markers.value = markers.value.filter((m) => m.id !== marker.id);
    }, MARKER_LIFETIME),
  );
}

function drawDots() {
  const canvas = canvasRef.value;

  if (!canvas || landDots.length === 0) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (width === 0 || height === 0) return;

  // Cap the pixel ratio: past 2x the dots gain nothing visible and the canvas
  // grows quadratically.
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Setting width or height resets the context, so the scale goes after it.
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = isDark.value
    ? 'rgba(56, 189, 248, 0.65)'
    : 'rgba(2, 132, 199, 0.28)';

  const radius = Math.max(0.6, (width / DOT_COLUMNS) * 0.3);
  const fullCircle = Math.PI * 2;

  for (const [lat, lng] of landDots) {
    ctx.beginPath();
    ctx.arc(
      projectX(lng) * width,
      projectY(lat) * height,
      radius,
      0,
      fullCircle,
    );
    ctx.fill();
  }
}

function startMarkers() {
  if (markerInterval || landDots.length === 0) return;

  // Stagger the first few so the map fills in rather than appearing at once.
  for (let i = 0; i < 5; i++) {
    pendingTimeouts.push(setTimeout(addMarker, i * 300));
  }

  markerInterval = setInterval(addMarker, MARKER_INTERVAL);
}

function stopMarkers() {
  if (markerInterval) {
    clearInterval(markerInterval);
    markerInterval = null;
  }

  pendingTimeouts.forEach(clearTimeout);
  pendingTimeouts.length = 0;
}

// The land data is a 64 kB fetch and the dot grid costs a few milliseconds of
// point-in-polygon tests, so neither happens until the map is on screen.
let activation: Promise<void> | null = null;
let isUnmounted = false;

async function activate() {
  if (!activation) {
    activation = (async () => {
      preloadBuffer = createPreloadBuffer(generateAvatarUrl);

      try {
        const res = await fetch('/ne_110m_land.geojson');
        landDots = buildLandDots(await res.json());
      } catch {
        // Without the land data there is nothing to draw and nowhere to put a
        // marker. The caption below the map still carries the actual number.
        return;
      }

      drawDots();
    })();
  }

  await activation;

  // The map can have scrolled back out, or the page can have been left, while
  // the land data was still loading.
  if (isUnmounted || !isVisible.value) return;

  startMarkers();
}

onMounted(() => {
  if (isVisible.value) {
    activate();
  }

  resizeObserver = new ResizeObserver(() => drawDots());

  if (canvasRef.value) {
    resizeObserver.observe(canvasRef.value);
  }
});

watch(isVisible, (visible) => {
  if (visible) {
    activate();
  } else {
    stopMarkers();
  }
});

watch(isDark, () => drawDots());

onUnmounted(() => {
  isUnmounted = true;
  stopMarkers();
  markers.value = [];
  preloadBuffer = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
});

const formattedRate = (r: number) => {
  if (r >= 1000) return `~${(r / 1000).toFixed(1)}k`;
  return `~${r.toFixed(0)}`;
};
</script>

<template>
  <div ref="rootRef" class="app-stats-map">
    <div class="app-stats-map-wrap">
      <canvas ref="canvasRef" class="app-stats-map-canvas" aria-hidden="true" />
      <TransitionGroup name="app-stats-map-marker" tag="div">
        <div
          v-for="marker in markers"
          :key="marker.id"
          class="app-stats-map-marker"
          :style="{ left: `${marker.x}%`, top: `${marker.y}%` }"
        >
          <span class="app-stats-map-marker-ring" />
          <span class="app-stats-map-marker-disc">
            <img :src="marker.url" alt="" class="app-stats-map-marker-img" />
          </span>
        </div>
      </TransitionGroup>
    </div>
    <p class="app-stats-map-caption">
      {{ formattedRate(props.rate) }} avatars generated every second, worldwide
    </p>
  </div>
</template>

<style lang="scss" scoped>
.app-stats-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;

  &-wrap {
    position: relative;
    width: 100%;
    // Matches the projection's own ratio, which is what keeps the dots round.
    aspect-ratio: 360 / 140;
    pointer-events: none;
  }

  &-canvas {
    // Taken out of the flow on purpose. In flow, the wrap is a flex item whose
    // automatic minimum size comes from the canvas's intrinsic ratio, which
    // starts at 2:1 and would win over the aspect-ratio above.
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
  }

  &-marker {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    // `left` and `top` place the marker's corner, this pulls its centre onto
    // the coordinate.
    transform: translate(-50%, -50%);

    &-ring {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid var(--vp-c-brand-1);
      opacity: 0;
      animation: app-stats-map-ping 1.4s cubic-bezier(0, 0, 0.2, 1) forwards;
    }

    &-disc {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.95);
      box-shadow:
        0 2px 12px rgba(0, 0, 0, 0.12),
        0 0 0 1px rgba(0, 0, 0, 0.04);
      overflow: hidden;

      .dark & {
        background: #1a1c2a;
        border-color: rgba(56, 189, 248, 0.2);
        box-shadow:
          0 2px 12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(56, 189, 248, 0.1);
      }
    }

    &-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: block;
    }

    &-enter-active {
      transition:
        opacity var(--duration-slow) var(--ease-spring),
        transform var(--duration-slow) var(--ease-spring);
    }

    &-leave-active {
      transition:
        opacity var(--duration-slow) ease,
        transform var(--duration-slow) ease;
    }

    &-enter-from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0);
    }

    &-leave-to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.3);
    }
  }

  &-caption {
    font-size: 13px;
    color: var(--vp-c-text-3);
    text-align: center;
    line-height: 1.4;
    margin: 0;
  }
}

@keyframes app-stats-map-ping {
  0% {
    opacity: 0.6;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(2.2);
  }
}

@media (max-width: 768px) {
  .app-stats-map-marker {
    &-disc {
      width: 18px;
      height: 18px;
    }

    &-ring {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
