<script setup lang="ts">
/**
 * The head every page below the home shares: a breadcrumb, the headline,
 * facts as outlined chips and the lead. Actions stand beside the lead and
 * end with it. A style page puts its card into an aside column next to the
 * whole head instead.
 */
import { ChevronRight } from '@lucide/vue';

export interface SiteCrumb {
  text: string;
  link?: string;
}

export interface SiteChip {
  text: string;
  href?: string;
  /** A block color for the chip, such as sky for Animated. */
  tone?: 'sky' | 'lilac' | 'mint' | 'sun';
}

withDefaults(
  defineProps<{
    crumbs?: SiteCrumb[];
    title: string;
    chips?: SiteChip[];
    /** Width of the aside column in pixels. */
    asideWidth?: number;
    /** Whether the aside sits at the top, the middle or the end of the head. */
    asideAlign?: 'start' | 'center' | 'end';
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
        <ChevronRight v-if="index > 0" :size="14" aria-hidden="true" />
        <a v-if="crumb.link" :href="crumb.link">{{ crumb.text }}</a>
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
              class="site-tag"
              :class="chip.tone ? `site-tag-${chip.tone}` : 'site-tag-outline'"
              :href="chip.href"
              :target="isExternal(chip.href) ? '_blank' : undefined"
              :rel="isExternal(chip.href) ? 'noopener noreferrer' : undefined"
              >{{ chip.text }}</a
            >
            <span
              v-else
              class="site-tag"
              :class="chip.tone ? `site-tag-${chip.tone}` : 'site-tag-outline'"
              >{{ chip.text }}</span
            >
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
@use '../../styles/mixins' as m;

.site-page-head {
  padding-top: var(--db-page-top);

  &-crumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0 10px;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);

    a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      transition: color 0.12s;

      &:hover {
        color: var(--db-ink);
      }
    }

    [aria-current='page'] {
      font-weight: 600;
      color: var(--db-ink);
    }

    svg {
      flex-shrink: 0;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
    align-items: start;
    padding-top: 8px;

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
    gap: 28px;
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
      max-width: 680px;
    }

    /* Markdown pages hand the lead over as paragraphs. */
    :deep(p) {
      margin: 0;
    }

    :deep(p + p) {
      margin-top: 12px;
    }

    :deep(a) {
      @include m.link-inline;
    }
  }

  /* A fact under the lead: the term in the display face, the text beside
     it, a hairline above. */
  &-note {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 24px;
    max-width: 680px;
    padding-top: 20px;
    border-top: 1px solid var(--db-line);

    > :first-child {
      flex: 0 0 96px;
      font-family: var(--db-font-display);
      font-size: 16px;
      line-height: 26px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: none;
      color: var(--db-ink);
    }

    > :last-child {
      flex: 1 1 320px;
      min-width: 0;
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
    &-crumbs {
      gap: 4px 8px;
      font-size: 15px;
      line-height: 24px;
    }

    &-main {
      gap: 24px;
    }
  }
}
</style>
