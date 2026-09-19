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
        :style-name="styleName"
        :options="{ seed }"
        :size="128"
        :radius="24"
        :alt="`${styleName} avatar for the seed ${seed}`"
      />
      <span class="site-mono">{{ seed }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-seeds {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 12px;
  margin-top: 64px;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    min-width: 0;

    :deep(.site-avatar) {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1;
    }
  }

  @media (max-width: 959px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px 12px;
    margin-top: 48px;
  }
}
</style>
