<script setup lang="ts">
import { withBase } from 'vitepress';
import { PALETTE, type Pastel } from '@theme/utils/palette';

interface Tile {
  styleName: string;
  seed: string;
  background: Pastel;
  size: number;
  delay: number;
}

const tiles: Tile[] = [
  {
    styleName: 'lorelei',
    seed: 'Felix',
    background: PALETTE.rose,
    size: 256,
    delay: 0,
  },
  {
    styleName: 'clay',
    seed: 'Aneka',
    background: PALETTE.amber,
    size: 160,
    delay: -1.2,
  },
  {
    styleName: 'bottts',
    seed: 'Pixel',
    background: PALETTE.cyan,
    size: 128,
    delay: -2.1,
  },
  {
    styleName: 'notionists',
    seed: 'Rowan',
    background: PALETTE.green,
    size: 128,
    delay: -3.0,
  },
  {
    styleName: 'adventurer',
    seed: 'Juno',
    background: PALETTE.blue,
    size: 160,
    delay: -0.6,
  },
  {
    styleName: 'sprouts',
    seed: 'Sage',
    background: PALETTE.lime,
    size: 128,
    delay: -1.6,
  },
];

// The swarm sits in the LCP area, so its avatars are pre-generated as
// same-origin static files (scripts/generate-hero-avatars.mjs) instead of
// being fetched from api.dicebear.com, since an external origin costs extra
// DNS/TLS round trips before the largest above-the-fold images can paint.
function url(tile: Tile): string {
  return withBase(
    `/avatars/hero/${tile.styleName}-${tile.seed.toLowerCase()}.svg`,
  );
}
</script>

<template>
  <div class="app-hero-swarm">
    <div
      v-for="(tile, index) in tiles"
      :key="`${tile.styleName}-${tile.seed}`"
      :class="['app-hero-swarm-tile', `app-hero-swarm-tile--${index}`]"
      :style="{
        '--tile-bg': `#${tile.background}`,
        '--tile-delay': `${tile.delay}s`,
      }"
    >
      <img
        :src="url(tile)"
        alt=""
        :width="tile.size"
        :height="tile.size"
        :fetchpriority="index === 0 ? 'high' : 'auto'"
        decoding="async"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-hero-swarm {
  position: relative;
  width: 100%;
  height: 460px;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.app-hero-swarm-tile {
  position: absolute;
  width: var(--tile-w);
  height: var(--tile-w);
  top: var(--tile-top, auto);
  bottom: var(--tile-bottom, auto);
  left: var(--tile-left, auto);
  right: var(--tile-right, auto);
  transform: var(--tile-translate, none) rotate(var(--tile-rotate, 0deg));
  border-radius: 28px;
  overflow: hidden;
  background: var(--tile-bg);
  box-shadow:
    var(--vp-shadow-3),
    0 0 0 1px var(--vp-c-divider);
  animation:
    app-hero-swarm-fade var(--duration-reveal) var(--ease-smooth)
      var(--tile-fade-delay, 0s) both,
    app-hero-swarm-bob 6s ease-in-out var(--tile-delay, 0s) infinite;
  will-change: translate;
  contain: layout paint;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  &--0 {
    --tile-w: 220px;
    --tile-left: 50%;
    --tile-top: 50%;
    --tile-translate: translate(-50%, -50%);
    --tile-rotate: -3deg;
    --tile-fade-delay: 0.2s;
    z-index: 3;
  }

  &--1 {
    --tile-w: 130px;
    --tile-left: 4%;
    --tile-top: 8%;
    --tile-rotate: -8deg;
    --tile-fade-delay: 0.35s;
  }

  &--2 {
    --tile-w: 110px;
    --tile-right: 8%;
    --tile-top: 4%;
    --tile-rotate: 6deg;
    --tile-fade-delay: 0.45s;
  }

  &--3 {
    --tile-w: 140px;
    --tile-right: 0;
    --tile-bottom: 8%;
    --tile-rotate: 4deg;
    --tile-fade-delay: 0.55s;
  }

  &--4 {
    --tile-w: 100px;
    --tile-left: 2%;
    --tile-bottom: 14%;
    --tile-rotate: -5deg;
    --tile-fade-delay: 0.65s;
  }

  &--5 {
    --tile-w: 92px;
    --tile-left: 24%;
    --tile-bottom: 0;
    --tile-rotate: 8deg;
    --tile-fade-delay: 0.75s;
  }
}

@keyframes app-hero-swarm-bob {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -5px;
  }
}

@keyframes app-hero-swarm-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 960px) {
  .app-hero-swarm {
    height: 360px;
    max-width: 460px;
    margin: 0 auto;
  }

  .app-hero-swarm-tile {
    &--0 {
      --tile-w: 180px;
    }
    &--1 {
      --tile-w: 104px;
    }
    &--2 {
      --tile-w: 88px;
    }
    &--3 {
      --tile-w: 112px;
    }
    &--4 {
      --tile-w: 80px;
    }
    &--5 {
      --tile-w: 76px;
    }
  }
}

@media (max-width: 540px) {
  .app-hero-swarm {
    height: 300px;
  }

  .app-hero-swarm-tile {
    &--0 {
      --tile-w: 150px;
    }
    &--1 {
      --tile-w: 86px;
    }
    &--2 {
      --tile-w: 74px;
    }
    &--3 {
      --tile-w: 94px;
    }
    &--4 {
      --tile-w: 68px;
    }
    &--5 {
      --tile-w: 64px;
    }
  }
}
</style>
