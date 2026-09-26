<script setup lang="ts">
/**
 * One style in the overview list: four avatars, the name, the credit and an
 * arrow. Hover and keyboard focus lay a soft surface under the row, reaching
 * past the list on both sides, and turn the arrow into a filled button. Where
 * the list runs narrow the credit moves under the name, and phones keep three
 * avatars and swap the artist for the animated tag.
 */
import { ArrowRight, ChevronRight } from '@lucide/vue';
import SiteAvatar from './SiteAvatar.vue';

/** A short text next to the credit, colored by what it says. */
export interface SiteStylesBadge {
  text: string;
  tone: 'up' | 'down' | 'flat' | 'new';
}

defineProps<{
  slug: string;
  displayName: string;
  creator: string;
  license: string;
  animated: boolean;
  /** The seeds of the avatars in the row. Phones show the first three. */
  seeds: string[];
  /** Position in a usage sort, shown in front of the avatars. */
  rank?: number;
  /** The trend next to the credit, for the trend sort. */
  badge?: SiteStylesBadge;
}>();
</script>

<template>
  <a :href="`/styles/${slug}/`" class="site-styles-row">
    <span v-if="rank" class="site-styles-row-rank site-mono">{{ rank }}</span>
    <span class="site-styles-row-avatars">
      <SiteAvatar
        v-for="seed in seeds"
        :key="seed"
        :style-name="slug"
        :options="{ seed }"
        :size="48"
        :radius="12"
        :alt="`${displayName} avatar`"
      />
    </span>
    <span class="site-styles-row-text">
      <span class="site-styles-row-name">
        {{ displayName }}
        <span v-if="animated" class="site-styles-row-tag">Animated</span>
      </span>
      <span class="site-styles-row-meta">
        <span class="site-styles-row-creator">{{ creator }} · </span>{{ license
        }}<span v-if="animated" class="site-styles-row-meta-tag">
          · Animated</span
        >
        <span
          v-if="badge"
          class="site-styles-row-badge"
          :class="`is-${badge.tone}`"
          >{{ badge.text }}</span
        >
      </span>
    </span>
    <span class="site-styles-row-go">
      <ArrowRight :size="18" class="is-wide" aria-hidden="true" />
      <ChevronRight :size="16" class="is-narrow" aria-hidden="true" />
    </span>
  </a>
</template>

<style scoped lang="scss">
// The state a row takes under the pointer or the keyboard focus. The hairlines
// above and below give way to the surface.
@mixin raised {
  border-top-color: transparent;

  &::before {
    background: var(--db-soft);
  }

  + .site-styles-row {
    border-top-color: transparent;
  }

  .site-styles-row-go {
    background: var(--db-btn-bg);
    color: var(--db-btn-fg);
  }
}

.site-styles-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 72px;
  padding: 12px 0;
  box-sizing: border-box;
  border-top: 1px solid var(--db-line);
  color: var(--db-ink);
  outline: none;
  transition: border-color 0.12s;

  // Reaches 12px past the list on both sides, so the avatars stay on the
  // list's edge. The list isolates it, which keeps it above the page.
  &::before {
    content: '';
    position: absolute;
    inset: -1px -12px 0;
    z-index: -1;
    border-radius: var(--db-radius-3);
    transition: background-color 0.12s;
  }

  @media (hover: hover) {
    &:hover {
      @include raised;
    }
  }

  &:focus-visible {
    @include raised;

    &::before {
      outline: 2px solid var(--db-brand);
    }
  }

  &-rank {
    width: 24px;
    flex-shrink: 0;
    margin-right: -8px;
    color: var(--db-muted);
    font-variant-numeric: tabular-nums;
  }

  &-avatars {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  &-text {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;
    min-width: 0;
  }

  &-name {
    width: 180px;
    flex-shrink: 0;
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
  }

  &-tag {
    margin-left: 4px;
    font-size: 13px;
    font-weight: 400;
    color: var(--db-muted);
  }

  /* The credit names the artist and the license, so it wraps on a narrow
     column and is never cut. */
  &-meta {
    flex: 1;
    min-width: 0;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  &-meta-tag {
    display: none;
  }

  &-badge {
    margin-left: 10px;
    color: var(--db-ink);
    font-weight: 500;
    font-variant-numeric: tabular-nums;

    &.is-up {
      color: var(--db-ok);
    }

    &.is-down {
      color: var(--db-danger);
    }

    &.is-flat {
      color: var(--db-muted);
    }

    &.is-new {
      color: var(--db-brand-text);
    }
  }

  // The arrow sits centered in a 32px circle that fills on hover. The
  // negative margin keeps the arrow itself on the list's edge.
  &-go {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    margin-right: -7px;
    border-radius: 50%;
    color: var(--db-ink-2);
    transition:
      background-color 0.12s,
      color 0.12s;

    .is-narrow {
      display: none;
    }
  }

  /* A list narrower than the four avatars plus name and credit side by side
     stacks the credit under the name. */
  @container (max-width: 720px) {
    &-text {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }

    &-name {
      width: auto;
    }

    &-meta {
      font-size: 14px;
      line-height: 20px;
    }
  }

  @media (max-width: 767px) {
    --site-avatar-size: 40px;
    --site-avatar-radius: 10px;

    gap: 14px;
    min-height: 64px;
    padding: 10px 0;

    &-avatars {
      gap: 6px;

      > :nth-child(n + 4) {
        display: none;
      }
    }

    &-name {
      font-size: 15px;
      line-height: 24px;
    }

    &-tag,
    &-creator {
      display: none;
    }

    &-meta-tag {
      display: inline;
    }

    &-meta {
      font-size: 13px;
      line-height: 18px;
      color: var(--db-muted);
    }

    &-go {
      width: 28px;
      height: 28px;
      margin-right: -6px;

      .is-wide {
        display: none;
      }

      .is-narrow {
        display: block;
      }
    }
  }
}
</style>
