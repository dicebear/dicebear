<script setup lang="ts">
/**
 * The head every page below the home shares: a breadcrumb, the headline,
 * facts as outlined chips and the lead. Actions stand beside the lead and
 * end with it, as on the Studio page. A style page puts its card into an
 * aside column next to the whole head instead.
 */
import { ChevronRight } from '@lucide/vue';

export interface SiteCrumb {
  text: string;
  link?: string;
}

export interface SiteChip {
  text: string;
  href?: string;
}

withDefaults(
  defineProps<{
    crumbs?: SiteCrumb[];
    title: string;
    chips?: SiteChip[];
    /** Width of the aside column in pixels. */
    asideWidth?: number;
    /** Whether the aside sits at the top of the head or at its middle. */
    asideAlign?: 'start' | 'center';
    /** The lead in the large marketing size, or in the body size of a style page. */
    leadSize?: 'lead' | 'body';
  }>(),
  { asideWidth: 400, asideAlign: 'start', leadSize: 'lead' },
);

/** Links off the site open in a new tab, links on it stay here. */
function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
</script>

<template>
  <div class="site-container site-page-head">
    <nav
      v-if="crumbs?.length"
      class="site-page-head-crumbs"
      aria-label="Breadcrumb"
    >
      <template v-for="(crumb, index) in crumbs" :key="index">
        <ChevronRight v-if="index > 0" :size="12" aria-hidden="true" />
        <a v-if="crumb.link" :href="crumb.link" class="hv-link">{{
          crumb.text
        }}</a>
        <span v-else aria-current="page">{{ crumb.text }}</span>
      </template>
    </nav>
    <div
      :class="['site-page-head-grid', { 'has-aside': $slots.aside }]"
      :style="{
        '--site-page-head-aside': `${asideWidth}px`,
        alignItems: asideAlign,
      }"
    >
      <div class="site-page-head-main">
        <h1 class="site-display site-rise">
          <slot name="title">{{ title }}</slot>
        </h1>
        <div
          v-if="chips?.length"
          class="site-page-head-chips site-rise"
          style="animation-delay: 80ms"
        >
          <template v-for="chip in chips" :key="chip.text">
            <a
              v-if="chip.href"
              class="site-chip hv-outline"
              :href="chip.href"
              :target="isExternal(chip.href) ? '_blank' : undefined"
              :rel="isExternal(chip.href) ? 'noopener noreferrer' : undefined"
              >{{ chip.text }}</a
            >
            <span v-else class="site-chip">{{ chip.text }}</span>
          </template>
        </div>
        <div
          v-if="$slots.default || $slots.actions"
          class="site-page-head-intro"
        >
          <div
            v-if="$slots.default"
            :class="[
              leadSize === 'body' ? 'site-body' : 'site-lead',
              'site-page-head-lead',
              'site-rise',
            ]"
            style="animation-delay: 160ms"
          >
            <slot />
          </div>
          <div
            v-if="$slots.actions"
            class="site-page-head-actions site-rise"
            style="animation-delay: 240ms"
          >
            <slot name="actions" />
          </div>
        </div>
        <div
          v-if="$slots.note"
          class="site-page-head-note site-rise"
          style="animation-delay: 200ms"
        >
          <slot name="note" />
        </div>
      </div>
      <div
        v-if="$slots.aside"
        class="site-page-head-aside site-rise"
        style="animation-delay: 240ms"
      >
        <slot name="aside" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-page-head {
  padding-top: 72px;

  &-crumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 10px;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-ink-2);

    a {
      color: var(--db-muted);
    }

    svg {
      flex-shrink: 0;
      color: var(--db-chevron);
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 80px;
    align-items: start;
    padding-top: 28px;

    &.has-aside {
      grid-template-columns: minmax(0, 1fr) var(--site-page-head-aside, 400px);
    }

    @media (max-width: 959px) {
      &.has-aside {
        grid-template-columns: minmax(0, 1fr);
        gap: 48px;
      }
    }
  }

  &-main {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0;
  }

  &-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* The lead and the actions beside it, at the far right and level with
     the lead's last line. */
  &-intro {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px 64px;

    @media (max-width: 1099px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-lead {
    &.site-lead {
      max-width: 720px;
    }

    /* Markdown pages hand the lead over as paragraphs. */
    :deep(p) {
      margin: 0;
    }

    :deep(p + p) {
      margin-top: 12px;
    }

    :deep(a) {
      color: var(--db-brand-text);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }
  }

  &-note {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr);
    gap: 20px;
    align-items: baseline;
    padding: 18px 0;
    border-top: 1px solid var(--db-line);
    border-bottom: 1px solid var(--db-line);
    max-width: 680px;

    @media (max-width: 767px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }
  }

  &-actions {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 12px;
  }

  &-aside {
    min-width: 0;
  }

  @media (max-width: 767px) {
    padding-top: 48px;

    &-crumbs {
      gap: 4px 8px;
      font-size: 15px;
      line-height: 24px;
    }

    &-grid {
      padding-top: 20px;
    }

    &-main {
      gap: 24px;
    }
  }
}
</style>
