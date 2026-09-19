<script setup lang="ts">
/**
 * The panel that opens under the seed row: a handful of styles to choose
 * from, each drawn with the current seed, and the way to all of them.
 */
import { ArrowRight } from '@lucide/vue';

defineProps<{
  styles: { name: string; title: string }[];
  selected: string;
  /** One avatar URL per style name, drawn with the current seed. */
  sources: Record<string, string>;
  seed: string;
  allStylesUrl: string;
  styleCount: number;
}>();

defineEmits<{
  pick: [name: string];
}>();
</script>

<template>
  <div class="home-style-picker" role="group" aria-label="Choose a style">
    <div class="home-style-picker-head">
      <span class="home-style-picker-label">Style</span>
      <a :href="allStylesUrl" class="home-style-picker-all hv-link">
        All {{ styleCount }} styles
        <ArrowRight :size="16" aria-hidden="true" />
      </a>
    </div>
    <div class="home-style-picker-grid">
      <button
        v-for="style in styles"
        :key="style.name"
        type="button"
        class="home-style-picker-item"
        :aria-pressed="style.name === selected"
        @click="$emit('pick', style.name)"
      >
        <span class="home-style-picker-tile">
          <img
            v-if="sources[style.name]"
            :src="sources[style.name]"
            :alt="`${style.title} avatar for the seed ${seed}`"
          />
        </span>
        <span class="home-style-picker-name">{{ style.title }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-style-picker {
  margin: 20px -20px -20px;
  padding: 24px 28px 28px;
  border-top: 1px solid var(--db-line);

  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-label {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-muted);
  }

  &-all {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-brand-text);
    text-decoration: none;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 20px 16px;
    margin-top: 20px;
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--db-muted);
    font-weight: 500;
    cursor: pointer;

    &:hover,
    &[aria-pressed='true'] {
      color: var(--db-ink);
    }

    &[aria-pressed='true'] {
      font-weight: 600;
    }
  }

  &-tile {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 20px;
    overflow: hidden;
    background: var(--db-tile);

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &-item:not([aria-pressed='true']):hover &-tile {
    box-shadow:
      0 0 0 3px var(--db-panel),
      0 0 0 5px var(--db-hover-border);
  }

  &-item[aria-pressed='true'] &-tile {
    box-shadow:
      0 0 0 3px var(--db-panel),
      0 0 0 5px var(--db-brand);
  }

  &-name {
    max-width: 100%;
    overflow: hidden;
    font-size: 13px;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (max-width: 767px) {
    margin: 12px -12px -12px;
    padding: 20px 20px 24px;

    &-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px 12px;
    }

    &-tile {
      border-radius: 16px;
    }
  }
}
</style>
