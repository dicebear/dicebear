<script setup lang="ts">
/**
 * The last block of the page: a row of avatars, one line in the display
 * voice and the two ways on from here. It also holds the space to the footer.
 */
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import { styleDisplayName } from '@theme/utils/styleMeta';
import SiteAvatar from '../site/SiteAvatar.vue';

const STYLES = [
  'shapes',
  'lorelei',
  'rings',
  'thumbs',
  'glass',
  'notionists',
  'identicon',
  'cats',
  'loops',
];

const avatars = STYLES.map((name, index) => {
  const seeds = getStyleCardSeeds(name);
  return {
    name,
    options: { seed: seeds[index % seeds.length] },
    alt: `${styleDisplayName(name)} avatar`,
  };
});

const actions = [
  { text: 'Open the playground', href: '/playground/', kind: 'primary' },
  { text: 'Read the docs', href: '/start/', kind: 'secondary' },
];
</script>

<template>
  <section class="site-container about-closing">
    <div class="about-closing-avatars">
      <SiteAvatar
        v-for="avatar in avatars"
        :key="avatar.name"
        :style-name="avatar.name"
        :options="avatar.options"
        :size="72"
        :radius="20"
        :alt="avatar.alt"
      />
    </div>
    <h2 class="site-headline">Build your first avatar</h2>
    <p class="site-lead">Pick a style and a seed, then copy the code.</p>
    <div class="about-closing-actions">
      <a
        v-for="action in actions"
        :key="action.href"
        :class="['site-btn', 'site-btn-lg', `site-btn-${action.kind}`]"
        :href="action.href"
        >{{ action.text }}</a
      >
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 168px;
  padding-bottom: 168px;
  text-align: center;

  &-avatars {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 56px;
  }

  .site-lead {
    margin-top: 28px;
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 40px;
  }

  @media (max-width: 959px) {
    // Seven avatars fit a tablet, four fit a phone.
    &-avatars > :nth-child(n + 8) {
      display: none;
    }
  }

  @media (max-width: 767px) {
    padding-top: 96px;
    padding-bottom: 96px;

    &-avatars {
      gap: 12px;
      margin-bottom: 40px;

      > :nth-child(n + 5) {
        display: none;
      }
    }

    .site-lead {
      margin-top: 20px;
    }

    &-actions {
      margin-top: 28px;
    }
  }
}
</style>
