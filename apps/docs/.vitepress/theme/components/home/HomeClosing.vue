<script setup lang="ts">
/**
 * The last block of the homepage: one line, one sentence and the same two
 * ways in as the hero. It also holds the space to the footer.
 */
import { withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';

const closing = {
  title: 'Build your first avatar',
  lead: 'Pick a style, set a seed, copy the URL. The Playground has every style with every option next to the code.',
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
  <section class="home-wrap home-closing">
    <h2 class="site-headline">{{ closing.title }}</h2>
    <p class="site-lead home-closing-lead">{{ closing.lead }}</p>
    <div class="home-closing-actions">
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
  </section>
</template>

<style scoped lang="scss">
.home-closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 168px;
  padding-bottom: 168px;
  text-align: center;

  &-lead {
    max-width: 640px;
    margin-top: 32px;
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    margin-top: 48px;
  }

  @media (max-width: 767px) {
    padding-top: 96px;
    padding-bottom: 96px;

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
