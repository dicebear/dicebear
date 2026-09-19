<script setup lang="ts">
/**
 * Six more avatars of one style, shown beside the list of a section while
 * the pointer rests on that style's row. The seeds come from the style's own
 * preview row, so none of them repeats an avatar in the list. Phones show the
 * first three above the list.
 */
import { computed } from 'vue';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import SiteAvatar from './SiteAvatar.vue';

const props = defineProps<{
  slug: string;
  displayName: string;
}>();

const seeds = computed(() => {
  try {
    return getPreviewRowSeeds(props.slug).slice(0, 6);
  } catch {
    return [];
  }
});
</script>

<template>
  <Transition name="site-styles-peek" mode="out-in">
    <div v-if="seeds.length" :key="slug" class="site-styles-peek">
      <div class="site-styles-peek-grid">
        <SiteAvatar
          v-for="seed in seeds"
          :key="seed"
          class="site-styles-peek-tile"
          :style-name="slug"
          :options="{ seed }"
          :size="104"
          :radius="20"
          :alt="`${displayName} avatar for the seed ${seed}`"
        />
      </div>
      <span class="site-styles-peek-caption">
        {{ displayName }},
        <span class="site-styles-peek-wide">six</span>
        <span class="site-styles-peek-narrow">three</span>
        more seeds
      </span>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.site-styles-peek {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  &-tile {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1;
  }

  &-caption {
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);
  }

  &-narrow {
    display: none;
  }

  &-enter-active,
  &-leave-active {
    transition: opacity 0.08s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  @media (max-width: 959px) {
    gap: 8px;

    &-tile:nth-child(n + 4),
    &-wide {
      display: none;
    }

    &-narrow {
      display: inline;
    }

    &-caption {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
