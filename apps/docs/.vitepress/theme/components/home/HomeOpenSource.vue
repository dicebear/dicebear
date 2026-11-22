<script setup lang="ts">
/**
 * Section five: the project. Open source since the first commit, with the
 * star count on the button, and three facts on the right: the licenses, no
 * paid tier, and data that stays with you.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { siGithub } from 'simple-icons';
import type { ThemeOptions } from '@theme/types';
import { normalizeLicense } from '@theme/config/styleCategories';
import { FIRST_COMMIT, LINKS } from '@theme/config/home';
import UiIcon from '../ui/UiIcon.vue';

const { theme } = useData<ThemeOptions>();

const stars = computed(
  () => theme.value.githubStars?.['dicebear/dicebear'] ?? '',
);

const cc0 = computed(
  () =>
    Object.values(theme.value.avatarStyles).filter(
      (style) => normalizeLicense(style.meta.license?.name ?? '') === 'CC0 1.0',
    ).length,
);
</script>

<template>
  <section class="site-box is-block is-mint home-project">
    <div class="site-pair is-top home-project-grid">
      <div>
        <h2 class="site-headline">Open source since {{ FIRST_COMMIT.year }}</h2>
        <p class="site-lead home-project-lead">
          The first commit dates from {{ FIRST_COMMIT.month }}
          {{ FIRST_COMMIT.year }}. Version {{ theme.majorVersion }} is the
          current one, and it is still built in the open.
        </p>
        <div class="site-actions home-project-actions">
          <a
            :href="LINKS.github"
            target="_blank"
            rel="noopener noreferrer"
            class="site-btn site-btn-primary site-btn-lg"
          >
            <UiIcon :path="siGithub.path" :size="20" aria-hidden="true" />
            Star on GitHub
            <span v-if="stars" class="home-project-stars">{{ stars }}</span>
          </a>
          <a
            :href="withBase(LINKS.support)"
            class="site-btn site-btn-secondary site-btn-lg"
            >Support DiceBear</a
          >
        </div>
      </div>
      <ul class="site-rows is-strong is-between">
        <li class="site-row">
          <h3 class="site-heading">MIT code, CC0 styles</h3>
          <p class="site-body home-project-text">
            The code is MIT licensed and on GitHub. {{ cc0 }} of
            {{ theme.styleCount }} styles are CC0, free to use without
            attribution, and every other style keeps the license its artist
            chose.
          </p>
        </li>
        <li class="site-row">
          <h3 class="site-heading">No paid tier</h3>
          <p class="site-body home-project-text">
            There is no company behind DiceBear. bunny.net sponsors the CDN, so
            the hosted API costs nothing for non-commercial use.
          </p>
        </li>
        <li class="site-row">
          <h3 class="site-heading">Your data stays yours</h3>
          <p class="site-body home-project-text">
            The libraries run in your own code, so nothing about your users
            leaves your systems.
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-project {
  &-grid {
    row-gap: 56px;
  }

  &-lead {
    max-width: 500px;
    margin-top: 28px;
  }

  &-actions {
    margin-top: 40px;
  }

  &-stars {
    padding-left: 12px;
    border-left: 2px solid color-mix(in srgb, currentColor 30%, transparent);
  }

  &-text {
    max-width: 520px;
    margin-top: 8px;
  }
}
</style>
