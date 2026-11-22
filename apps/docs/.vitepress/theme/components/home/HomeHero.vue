<script setup lang="ts">
/**
 * The hero. Five stickers show the seed in five styles, the one in the
 * middle large and upright. The field holds the seed and types a few names
 * by itself until someone takes over; the yellow button rolls a new one.
 * The hero fills the window below the header.
 */
import { onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import {
  DEMO_NAMES,
  useHomeDemo,
  useSeedTyping,
} from '@theme/composables/useHomeDemo';
import { LINKS } from '@theme/config/home';
import SiteAvatar from '../site/SiteAvatar.vue';

const { theme } = useData<ThemeOptions>();
const demo = useHomeDemo();
const { stop } = useSeedTyping(demo, DEMO_NAMES.slice(0, 6));

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

function onInput(event: Event) {
  demo.setSeed((event.target as HTMLInputElement).value);
}
</script>

<template>
  <section class="home-hero site-container">
    <h1 class="site-hero site-rise">Roll a face<br />for every user</h1>
    <p class="site-lead home-hero-lead site-rise" style="animation-delay: 80ms">
      DiceBear turns a name into an avatar, and the same name gives the same
      avatar every time. {{ theme.styleCount }} styles, an HTTP API and
      libraries for seven languages.
    </p>

    <ul class="home-fan site-rise" style="animation-delay: 160ms">
      <li
        v-for="(item, index) in demo.styles.value"
        :key="item.name"
        class="home-fan-item"
        :class="`is-at-${index}`"
      >
        <SiteAvatar
          sticker
          mode="library"
          :style-name="item.name"
          :options="
            item.name === demo.styleName.value
              ? demo.options.value
              : { seed: demo.seed.value }
          "
          :lazy="false"
          :alt="`${item.title} avatar for the seed ${demo.seed.value}`"
        />
      </li>
    </ul>

    <p class="site-control home-hero-style" aria-live="polite">
      {{ demo.style.value.title }}
    </p>
    <div class="home-seed site-rise" style="animation-delay: 240ms">
      <label for="home-seed" class="sr-only">Seed</label>
      <input
        id="home-seed"
        class="home-seed-input"
        type="text"
        :value="demo.seed.value"
        autocomplete="off"
        spellcheck="false"
        maxlength="40"
        @focus="stop"
        @input="onInput"
      />
      <button
        type="button"
        class="site-btn site-btn-accent site-btn-lg"
        :disabled="!mounted"
        @click="demo.roll()"
      >
        Roll
      </button>
    </div>

    <div class="site-actions home-hero-actions">
      <a
        :href="withBase(LINKS.playground)"
        class="site-btn site-btn-primary site-btn-lg"
        >Open Playground</a
      >
      <a
        :href="withBase(LINKS.docs)"
        class="site-btn site-btn-secondary site-btn-lg"
      >
        Read the docs
        <ArrowRight :size="20" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - var(--db-header-h));
  padding-top: clamp(24px, 3vh, 48px);
  padding-bottom: clamp(40px, 6vh, 96px);
  text-align: center;

  &-lead {
    max-width: 760px;
    margin-top: clamp(20px, 2vw, 28px);
  }

  &-style {
    color: var(--db-muted);
  }

  &-actions {
    justify-content: center;
    margin-top: clamp(20px, 2.4vw, 32px);
  }
}

/* The fan: five stickers that overlap, the middle one large and upright,
   the outer ones smaller, lower and turned away. */
.home-fan {
  /* Wide and tall windows get large stickers; on a laptop the field and the
     buttons still fit above the fold. */
  --fan: clamp(64px, min(13vw, 14.5svh), 188px);

  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: clamp(20px, 2.4vw, 32px);
  padding: calc(var(--fan) * 0.2) 0 calc(var(--fan) * 0.26);

  &-item {
    position: relative;
    width: var(--fan);
    margin: 0 calc(var(--fan) * -0.1);

    &.is-at-0 {
      z-index: 1;
      transform: translate(2%, 34%) scale(0.68) rotate(-13deg);
    }

    &.is-at-1 {
      z-index: 2;
      transform: translate(-6%, 14%) scale(0.92) rotate(-7deg);
    }

    &.is-at-2 {
      z-index: 3;
      transform: scale(1.36) rotate(-2deg);
    }

    &.is-at-3 {
      z-index: 2;
      transform: translate(6%, 14%) scale(0.92) rotate(7deg);
    }

    &.is-at-4 {
      z-index: 1;
      transform: translate(-2%, 34%) scale(0.68) rotate(13deg);
    }
  }
}

/* The seed field: the large field of the page, ringed in ink. */
.home-seed {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(520px, 100%);
  height: 76px;
  margin-top: 12px;
  padding: 0 10px 0 22px;
  border-radius: 38px;
  background: var(--db-panel);
  box-shadow:
    0 0 0 2px var(--db-ink),
    var(--db-shadow);

  &:focus-within {
    box-shadow:
      0 0 0 3px var(--db-focus),
      var(--db-shadow);
  }

  &-input {
    flex: 1;
    min-width: 0;
    padding: 0 8px;
    border: 0;
    outline: none;
    background: transparent;
    font-family: var(--db-font-display);
    font-size: clamp(22px, 2.2vw, 30px);
    line-height: 40px;
    font-weight: 700;
    color: var(--db-ink);
  }
}
</style>
