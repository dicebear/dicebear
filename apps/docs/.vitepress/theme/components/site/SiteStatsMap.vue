<script setup lang="ts">
/**
 * The dotted world map of the statistics page. Avatars appear at random
 * places on land, because the stats keep no locations, and the map says so.
 * The box in the corner carries the real number: avatars served a second.
 */
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

const apiBase = 'https://api.dicebear.com/11.x';
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
  /** Edge length of the tile in pixels at the desktop width. */
  size: number;
  url: string;
}

const MARKER_SIZES = [48, 56, 64];

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
    size: MARKER_SIZES[markerId % MARKER_SIZES.length],
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
  // The brand color of each theme. A canvas cannot read a custom property
  // that changes with the theme class before the class is applied.
  ctx.fillStyle = isDark.value
    ? 'rgba(76, 179, 230, 0.5)'
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

const formattedRate = (r: number) => Math.round(r).toLocaleString('en-US');
</script>

<template>
  <div ref="rootRef" class="site-stats-map">
    <div
      class="site-stats-map-wrap"
      role="img"
      aria-label="Dotted world map with avatars appearing at simulated locations"
    >
      <canvas
        ref="canvasRef"
        class="site-stats-map-canvas"
        aria-hidden="true"
      />
      <TransitionGroup name="site-stats-map-marker" tag="div">
        <div
          v-for="marker in markers"
          :key="marker.id"
          class="site-stats-map-marker"
          :style="{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            '--size': `${marker.size}px`,
          }"
        >
          <span class="site-stats-map-marker-ring" />
          <span class="site-stats-map-marker-tile">
            <img :src="marker.url" alt="" />
          </span>
        </div>
      </TransitionGroup>
    </div>
    <div class="site-stats-map-legend">
      <div class="site-stats-map-rate">
        <span class="site-stats-map-rate-value">{{
          formattedRate(props.rate)
        }}</span>
        <span class="site-text"
          >avatars a second, on average over the last seven days</span
        >
      </div>
      <span class="site-label">Simulated locations</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.site-stats-map {
  /* The left and right edge of the content column, measured from the band. */
  --edge: max(
    var(--db-gutter),
    calc((100% - var(--db-container)) / 2 + var(--db-gutter))
  );

  position: relative;
  width: 100%;
  overflow: hidden;

  &-wrap {
    position: relative;
    width: 100%;
    // Matches the projection's own ratio, which is what keeps the dots round.
    aspect-ratio: 360 / 140;
    pointer-events: none;
  }

  &-canvas {
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
    // `left` and `top` place the marker's corner, this pulls its center onto
    // the coordinate.
    transform: translate(-50%, -50%);

    &-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 28%;
      border: 2px solid var(--db-brand);
      opacity: 0;
      animation: site-stats-map-ping 1.4s cubic-bezier(0, 0, 0.2, 1) forwards;
    }

    /* The tile color stays light in dark mode, so every style reads on it. */
    &-tile {
      display: block;
      width: var(--size);
      height: var(--size);
      border-radius: 25%;
      background: var(--db-tile);
      box-shadow:
        0 0 0 3px var(--db-paper),
        0 14px 28px -10px rgba(11, 22, 32, 0.28);
      overflow: hidden;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
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

  &-legend {
    position: absolute;
    left: var(--edge);
    right: var(--edge);
    bottom: 32px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }

  &-rate {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding: 12px 20px;
    border: 1px solid var(--db-line);
    border-radius: var(--db-radius-4);
    background: var(--db-paper);

    &-value {
      font-size: 32px;
      line-height: 40px;
      font-weight: 700;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
      color: var(--db-ink);
    }
  }

  .site-label {
    flex-shrink: 0;
    padding-bottom: 8px;
  }

  /* Below the desktop width the map is too small to carry the legend, so it
     follows the map and the tiles shrink. */
  @media (max-width: 959px) {
    &-legend {
      position: static;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      margin-top: 24px;
      padding: 0 var(--db-gutter);
    }

    &-rate {
      flex-wrap: wrap;
      gap: 4px 16px;
    }

    &-marker-tile {
      width: calc(var(--size) * 0.5);
      height: calc(var(--size) * 0.5);
      box-shadow:
        0 0 0 2px var(--db-paper),
        0 8px 16px -8px rgba(11, 22, 32, 0.28);
    }
  }
}

@keyframes site-stats-map-ping {
  0% {
    opacity: 0.6;
    transform: scale(0.5);
  }

  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}
</style>
