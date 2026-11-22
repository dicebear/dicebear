<script setup lang="ts">
/**
 * How DiceBear gets into a project: the headline across the block, under it
 * the code for one avatar in every language, and on the left what a page
 * full of users looks like with that line in place. Fixed style and seeds;
 * the hero does not reach in here.
 */
import { computed, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { demoSnippets } from '@theme/utils/homeSnippets';
import { FRAMEWORK_GUIDES, LINKS } from '@theme/config/home';
import SiteAvatar from '../site/SiteAvatar.vue';
import UiCode from '../ui/UiCode.vue';

const { theme } = useData<ThemeOptions>();
const STYLE = 'pixel-art';
const SEED = 'Felix';
const CROWD = ['Felix', 'Mia', 'Noah', 'Aiko', 'Lena', 'Omar'];

const active = ref('http-api');

const tabs = computed(() =>
  demoSnippets(STYLE, { seed: SEED }, theme.value.majorVersion),
);

const current = computed(
  () => tabs.value.find((tab) => tab.id === active.value) ?? tabs.value[0],
);
</script>

<template>
  <section class="site-box is-block is-sun home-integrate">
    <h2 class="site-headline home-integrate-title">
      One line, and everybody has a face
    </h2>

    <div class="site-pair is-top home-integrate-grid">
      <div>
        <p class="site-lead home-integrate-lead">
          Put the URL into an image tag. Or draw avatars in your own code, with
          a library for seven languages and a CLI for batches. Each of them
          returns the same avatar for the same seed.
        </p>
        <ul class="home-crowd" aria-label="Six Pixel Art avatars">
          <li v-for="name in CROWD" :key="name">
            <SiteAvatar
              :style-name="STYLE"
              :options="{ seed: name }"
              :alt="name"
            />
          </li>
        </ul>
      </div>

      <div class="home-integrate-code">
        <UiCode v-model="active" :tabs="tabs">
          <template #foot>
            <a :href="withBase(current.docs)" class="site-link-arrow"
              >{{ current.label }} docs</a
            >
          </template>
        </UiCode>
        <div class="site-actions home-integrate-actions">
          <a
            :href="withBase(LINKS.playground)"
            class="site-btn site-btn-primary site-btn-lg"
            >Try it in the Playground</a
          >
          <a
            :href="withBase(LINKS.docs)"
            class="site-btn site-btn-secondary site-btn-lg"
          >
            Documentation
            <ArrowRight :size="20" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>

    <nav class="home-guides" aria-label="Framework guides">
      <a
        v-for="guide in FRAMEWORK_GUIDES"
        :key="guide.href"
        :href="withBase(guide.href)"
        class="site-pill site-pill-outline"
        >{{ guide.label }}</a
      >
      <a
        :href="withBase(LINKS.integrations)"
        class="site-pill home-guides-more"
      >
        and many more
        <ArrowRight :size="18" aria-hidden="true" />
      </a>
    </nav>
  </section>
</template>

<style scoped lang="scss">
.home-integrate {
  &-title {
    margin-bottom: clamp(32px, 3.4vw, 48px);
  }

  &-grid {
    row-gap: 40px;
  }

  &-lead {
    max-width: 520px;
  }

  &-code {
    min-width: 0;
  }

  &-actions {
    margin-top: 20px;
  }
}

/* A row of round avatars that overlap, ringed in the ground. */
.home-crowd {
  display: flex;
  margin-top: 40px;
  padding-left: 12px;

  > li {
    width: clamp(52px, 5.4vw, 76px);
    margin-left: -12px;
  }

  :deep(.site-tile) {
    border: 4px solid var(--db-paper);
    border-radius: 50%;
    background: #ffffff;
  }
}

.home-guides {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: clamp(32px, 3.4vw, 48px);

  &-more {
    padding: 0 8px;
  }
}
</style>
