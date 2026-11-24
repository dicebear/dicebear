<script setup lang="ts">
/**
 * The accessibility section: a switch that stands for the reduced motion
 * setting of a visitor's system, and four avatars that hold their resting
 * frame while it is on. The switch starts in the state the system is in.
 */
import { computed, onMounted, ref } from 'vue';
import { capitalCase } from 'change-case';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import SiteAvatar from './SiteAvatar.vue';
import SiteSwitch from './SiteSwitch.vue';
import SiteSection from './SiteSection.vue';

const reduce = ref(false);

onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
});

const picks = ['critters', 'squircles', 'clay', 'blobs'];

const tiles = computed(() =>
  picks.map((styleName) => {
    const seed = getStyleCardSeeds(styleName)[1] ?? 'Felix';
    const title = capitalCase(styleName);
    return {
      styleName,
      options: reduce.value ? { seed } : { seed, animation: true },
      alt: reduce.value ? `${title} avatar, at rest` : `${title} avatar`,
    };
  }),
);
</script>

<template>
  <SiteSection
    tone="soft"
    layout="stack"
    title="Off by default, still on request"
  >
    <template #hint>
      Nothing moves until you switch it on. When a visitor has reduced motion
      set in the system, the file holds its resting frame on its own.
    </template>
    <label class="site-box is-card site-animated-motion-setting">
      <span class="site-animated-motion-setting-text">
        <span class="site-title">Reduce motion</span>
        <span class="site-text">
          The setting your visitors choose in their system.
        </span>
      </span>
      <SiteSwitch v-model="reduce" size="md" />
    </label>
    <div class="site-animated-motion-tiles">
      <SiteAvatar
        v-for="tile in tiles"
        :key="tile.styleName"
        sticker
        :style-name="tile.styleName"
        :options="tile.options"
        :alt="tile.alt"
      />
    </div>
    <p class="site-body">
      The rule travels inside the SVG, so you don't have to add anything.
    </p>
  </SiteSection>
</template>
<style scoped lang="scss">
.site-animated-motion {
  /* The setting as a card: what it is on the left, the switch on the
     right. */
  &-setting {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 32px;
    padding: 20px clamp(20px, 2.4vw, 32px);
    box-shadow: inset 0 0 0 1px var(--db-field-border);
    cursor: pointer;

    &-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  }

  &-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(200px, 42%), 1fr));
    gap: clamp(16px, 2.4vw, 32px);

    > :nth-child(odd) {
      transform: rotate(-2deg);
    }

    > :nth-child(even) {
      transform: rotate(2deg);
    }
  }
}
</style>
