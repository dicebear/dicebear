<script setup lang="ts">
/**
 * The top of the homepage: the headline, one sentence, the two ways in and
 * the interactive field below them.
 */
import { withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import HomeField from './HomeField.vue';

const hero = {
  title: ['A face for', 'every account'],
  lead: 'Give new users an avatar from the first minute. DiceBear draws it from a name or an ID, so nobody has to upload a photo.',
};

const actions = [
  {
    text: 'Open Playground',
    href: withBase('/playground/'),
    kind: 'primary',
    arrow: false,
  },
  {
    text: 'Read the docs',
    href: withBase('/start/'),
    kind: 'secondary',
    arrow: true,
  },
];
</script>

<template>
  <section class="home-hero">
    <div class="home-wrap home-hero-head">
      <h1 class="site-hero">
        <template v-for="(line, index) in hero.title" :key="line">
          <br v-if="index > 0" />{{ line }}
        </template>
      </h1>
      <p class="site-lead home-hero-lead">{{ hero.lead }}</p>
      <div class="home-hero-actions">
        <a
          v-for="action in actions"
          :key="action.text"
          :href="action.href"
          class="site-btn site-btn-lg"
          :class="`site-btn-${action.kind}`"
        >
          {{ action.text }}
          <ArrowRight v-if="action.arrow" :size="18" aria-hidden="true" />
        </a>
      </div>
    </div>
    <HomeField />
  </section>
</template>

<style scoped lang="scss">
.home-hero {
  &-head {
    // Above the field, which runs up into this block. The text sits in the
    // middle of the first screen, and the padding keeps it off the edges on
    // a short window.
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - var(--db-header-h));
    min-height: calc(100dvh - var(--db-header-h));
    padding-block: 64px;
    text-align: center;
  }

  &-lead {
    max-width: 680px;
    margin-top: 32px;
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;

    // The avatar field runs behind the buttons, so the quiet one needs a
    // surface of its own instead of the transparent default.
    .site-btn-secondary {
      background: var(--db-panel);
    }
  }

  @media (max-width: 767px) {
    &-head {
      padding-block: 48px;
    }

    &-lead {
      margin-top: 24px;
    }

    &-actions {
      gap: 12px;
      margin-top: 32px;
    }
  }
}
</style>
