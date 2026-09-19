<script setup lang="ts">
/**
 * A hairline list of statements: a title, one sentence and the link that
 * follows from it. A link that earns money for DiceBear or its sponsor says
 * "Advertisement" below it and carries rel="sponsored".
 */
import { withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';

export interface AboutRow {
  title: string;
  text: string;
  link: string;
  href: string;
  /** Marks the link as an ad and shows the sponsor's logo next to the text. */
  sponsored?: boolean;
}

defineProps<{ rows: AboutRow[] }>();

const sponsorLogos = [
  { theme: 'only-light', src: '/sponsors/bunny-dark.svg' },
  { theme: 'only-dark', src: '/sponsors/bunny-light.svg' },
];

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function rel(row: AboutRow): string | undefined {
  if (row.sponsored) {
    return 'sponsored noopener';
  }
  return isExternal(row.href) ? 'noopener noreferrer' : undefined;
}
</script>

<template>
  <div class="about-rows">
    <div v-for="row in rows" :key="row.title" class="about-rows-row">
      <h3 class="site-h3">{{ row.title }}</h3>
      <div class="about-rows-main">
        <template v-if="row.sponsored">
          <img
            v-for="logo in sponsorLogos"
            :key="logo.theme"
            :class="['about-rows-logo', logo.theme]"
            :src="withBase(logo.src)"
            alt="bunny.net"
            width="149"
            height="43"
            loading="lazy"
          />
        </template>
        <p class="site-body">{{ row.text }}</p>
      </div>
      <div class="about-rows-action">
        <a
          class="site-control about-rows-link hv-link"
          :href="row.href"
          :target="isExternal(row.href) ? '_blank' : undefined"
          :rel="rel(row)"
        >
          {{ row.link }}
          <ArrowRight :size="18" aria-hidden="true" />
        </a>
        <span v-if="row.sponsored" class="about-rows-ad">Advertisement</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-rows {
  border-bottom: 1px solid var(--db-line);

  &-row {
    display: grid;
    grid-template-columns: 340px minmax(0, 1fr) auto;
    gap: 48px;
    align-items: center;
    padding: 32px 0;
    border-top: 1px solid var(--db-line);
  }

  &-main {
    display: flex;
    align-items: center;
    gap: 24px;
    min-width: 0;
  }

  &-logo {
    flex-shrink: 0;
    width: auto;
    height: 40px;
  }

  &-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--db-brand-text);
    text-decoration: none;
    white-space: nowrap;
  }

  &-ad {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-muted);
  }

  @media (max-width: 1279px) {
    &-row {
      grid-template-columns: 260px minmax(0, 1fr) auto;
      gap: 32px;
    }
  }

  @media (max-width: 959px) {
    &-row {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
      padding: 28px 0;
    }

    &-main {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    &-action {
      align-items: flex-start;
      margin-top: 4px;
    }
  }
}
</style>
