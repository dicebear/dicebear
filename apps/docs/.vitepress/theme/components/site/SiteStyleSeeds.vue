<script setup lang="ts">
/**
 * The row of eight seeds every style page opens with. The seeds are picked
 * per style so no two avatars look alike, and their initials spell DICEBEAR.
 */
import { computed } from 'vue';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import SiteAvatar from './SiteAvatar.vue';

const props = defineProps<{
  styleName: string;
}>();

const seeds = computed(() => getPreviewRowSeeds(props.styleName));
</script>

<template>
  <div class="site-container site-style-seeds">
    <div
      v-for="(seed, index) in seeds"
      :key="seed"
      class="site-style-seeds-item site-pop"
      :style="{ animationDelay: `${400 + index * 60}ms` }"
    >
      <SiteAvatar
        sticker
        :style-name="styleName"
        :options="{ seed }"
        :alt="`${styleName} avatar for the seed ${seed}`"
      />
      <span class="site-mono">{{ seed }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-seeds {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(120px, 100%), 1fr));
  gap: 24px clamp(12px, 1.6vw, 24px);
  margin-top: clamp(48px, 6vw, 88px);

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    min-width: 0;

    > :first-child {
      width: 100%;
    }

    &:nth-child(odd) > :first-child {
      transform: rotate(-3deg);
    }

    &:nth-child(even) > :first-child {
      transform: rotate(2deg) translateY(6px);
    }
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
