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
  <section class="site-container site-animated-motion">
    <h2 class="site-headline">Off by default<br />Still on request</h2>
    <p class="site-lead site-animated-motion-lead">
      Nothing moves until you switch it on. When a visitor has reduced motion
      set in the system, the file holds its resting frame on its own.
    </p>
    <label class="site-animated-motion-setting">
      <span class="site-animated-motion-setting-text">
        <span class="site-animated-motion-setting-title">Reduce motion</span>
        <span class="site-text">
          The setting your visitors choose in their system.
        </span>
      </span>
      <SiteSwitch v-model="reduce" class="site-animated-motion-track" />
    </label>
    <div class="site-animated-motion-tiles">
      <SiteAvatar
        v-for="tile in tiles"
        :key="tile.styleName"
        :style-name="tile.styleName"
        :options="tile.options"
        :size="302"
        :radius="48"
        :alt="tile.alt"
      />
    </div>
    <p class="site-text site-animated-motion-note">
      The rule travels inside the SVG, so you don't have to add anything.
    </p>
  </section>
</template>

<style scoped lang="scss">
.site-animated-motion {
  padding-top: 168px;

  &-lead {
    max-width: 760px;
    margin-top: 32px;
  }

  &-setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 56px;
    padding: 20px 0;
    border-top: 1px solid var(--db-line);
    border-bottom: 1px solid var(--db-line);
    cursor: pointer;

    &-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;

      .site-text {
        color: var(--db-muted);
      }
    }

    &-title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      color: var(--db-ink);
    }
  }

  /* The switch two steps larger than in a filter row. */
  & &-track {
    width: 52px;
    height: 30px;
    border-radius: 15px;

    &::before {
      top: 2px;
      left: 2px;
      width: 24px;
      height: 24px;
    }

    &:checked::before {
      transform: translateX(22px);
    }
  }

  &-tiles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin-top: 32px;

    :deep(.site-avatar) {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1;
    }
  }

  &-note {
    margin-top: 24px;
    color: var(--db-muted);
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    &-lead {
      margin-top: 24px;
    }

    &-setting {
      margin-top: 40px;
    }

    &-tiles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;

      :deep(.site-avatar) {
        border-radius: 28px !important;
      }
    }
  }
}
</style>
