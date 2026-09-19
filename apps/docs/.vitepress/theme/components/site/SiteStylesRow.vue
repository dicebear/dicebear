<script setup lang="ts">
/**
 * One style in the overview table: three avatars, the name, the credit and
 * an arrow. On hover the name and the arrow take the link color, and the
 * column beside the list shows more of the style.
 */
import { ArrowRight } from '@lucide/vue';
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
  /** The seeds of the avatars in the row. Phones show the first two. */
  seeds: string[];
  /** Position in a usage sort, shown instead of nothing. */
  rank?: number;
  /** The trend next to the credit, for the trend sort. */
  badge?: SiteStylesBadge;
}>();
</script>

<template>
  <a :href="`/styles/${slug}/`" class="site-styles-row hv-row">
    <span v-if="rank" class="site-styles-row-rank site-mono">{{ rank }}</span>
    <span class="site-styles-row-avatars">
      <SiteAvatar
        v-for="seed in seeds"
        :key="seed"
        :style-name="slug"
        :options="{ seed }"
        :size="52"
        :radius="14"
        :alt="`${displayName} avatar`"
      />
    </span>
    <span class="site-styles-row-text">
      <span class="site-styles-row-name">
        {{ displayName }}
        <span v-if="animated" class="site-styles-row-tag">Animated</span>
      </span>
      <span class="site-styles-row-meta">
        {{ creator }} · {{ license }}
        <span
          v-if="badge"
          class="site-styles-row-badge"
          :class="`is-${badge.tone}`"
          >{{ badge.text }}</span
        >
      </span>
    </span>
    <ArrowRight
      :size="18"
      class="site-styles-row-go hv-chev"
      aria-hidden="true"
    />
  </a>
</template>

<style scoped lang="scss">
.site-styles-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid var(--db-line);

  &-rank {
    width: 40px;
    flex-shrink: 0;
  }

  &-avatars {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    margin-right: 20px;
  }

  &-text {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  &-name {
    width: 190px;
    flex-shrink: 0;
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
  }

  &-tag {
    margin-left: 6px;
    font-size: 14px;
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
    color: var(--db-muted);
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

  &-go {
    flex-shrink: 0;
    margin-left: 16px;
    color: var(--db-muted);
  }

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: 2px;
    border-radius: var(--db-radius-2);
  }

  /* Phones stack the name over the credit and keep two avatars. */
  @media (max-width: 767px) {
    &-avatars {
      margin-right: 16px;

      > :nth-child(n + 3) {
        display: none;
      }
    }

    &-text {
      display: block;
    }

    &-name {
      display: block;
      width: auto;
    }

    &-meta {
      display: block;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
