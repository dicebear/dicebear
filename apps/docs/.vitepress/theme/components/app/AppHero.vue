<script setup lang="ts">
import AppHeroContent from './AppHeroContent.vue';
import AppHeroSwarm from './AppHeroSwarm.vue';
import { useVisibility } from '../../composables/useVisibility';

// Only used to pause the avatar-cluster bob when the hero scrolls out of view.
const isVisible = useVisibility('.app-hero', { once: false, threshold: 0.1 });
</script>

<template>
  <section class="app-hero" :class="{ 'app-hero--paused': !isVisible }">
    <div class="app-hero-bg ui-bg-grid"></div>
    <div class="app-hero-glow"></div>

    <div class="app-hero-grid">
      <AppHeroContent />
      <AppHeroSwarm />
    </div>
  </section>
</template>

<style lang="scss">
:root {
  --app-hero-glow: radial-gradient(
    ellipse 60% 50% at 50% -10%,
    var(--vp-c-brand-soft),
    transparent 70%
  );
}

.app-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  padding: 80px 24px;
  overflow: hidden;

  &--paused {
    .app-hero-swarm-tile {
      /* Pause only the bob (second animation). SSR renders --paused until the
       * IntersectionObserver fires after hydration. If the fade were paused
       * too, the tiles would stay at opacity 0 until all JS has loaded, which
       * delays LCP by seconds on slow connections. */
      animation-play-state: running, paused;
    }
  }

  &-bg {
    z-index: 0;
  }

  &-glow {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: var(--app-hero-glow);
  }

  &-grid {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1180px;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 64px;
    align-items: center;
  }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    animation: fade-up var(--duration-reveal) var(--ease-smooth);
  }

  &-title {
    margin: 0 0 24px;
    line-height: 1.02;
    letter-spacing: -0.04em;
    text-wrap: balance;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.1s both;

    &-line {
      display: block;
      font-size: clamp(42px, 4.8vw, 66px);
      font-weight: 800;
      color: var(--vp-c-text-1);
    }

    /* The single brand-blue accent word (no gradient, no animation). */
    &-accent {
      color: var(--vp-c-brand-2);
    }
  }

  &-description {
    font-size: 20px;
    color: var(--vp-c-text-2);
    line-height: 1.6;
    margin: 0 0 40px;
    max-width: 540px;
    text-wrap: pretty;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.2s both;
  }

  /* Accent underline: solid brand color, matching the headline accent word. */
  &-underline {
    background-image: linear-gradient(var(--vp-c-brand-2), var(--vp-c-brand-2));
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 100% 2px;
    padding-bottom: 1px;
    white-space: nowrap;
    transition: color var(--duration-fast) ease;

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }

  &-actions {
    display: flex;
    justify-content: flex-start;
    gap: 16px;
    animation: fade-up var(--duration-reveal) var(--ease-smooth) 0.3s both;
  }
}

@media (max-width: 960px) {
  .app-hero {
    min-height: auto;
    padding: 96px 24px 80px;

    &-grid {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    &-content {
      align-items: center;
      text-align: center;
    }

    &-description {
      margin-left: auto;
      margin-right: auto;
    }

    &-actions {
      justify-content: center;
    }
  }
}

@media (max-width: 768px) {
  .app-hero {
    padding: 80px 16px 64px;

    &-title-line {
      font-size: clamp(34px, 9vw, 50px);
    }

    &-description {
      font-size: 17px;
    }

    &-actions {
      flex-direction: column;
      align-items: center;

      .app-hero-action-btn {
        width: 100%;
        max-width: 280px;
      }
    }
  }
}
</style>
