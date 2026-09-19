<script setup lang="ts">
/**
 * The last block of the page: a row of avatars, one line in the section
 * voice, a lead and the two actions, centered. It also holds the space to
 * the footer.
 */
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import StudioActions from './StudioActions.vue';

const closing = {
  title: 'Try it in your next mockup',
  lead: 'Select the placeholders, pick a style, fill.',
};

const avatars: { styleName: string; seed: string }[] = [
  { styleName: 'lorelei', seed: 'Ada' },
  { styleName: 'notionists', seed: 'Bo' },
  { styleName: 'glass', seed: 'Cleo' },
  { styleName: 'thumbs', seed: 'Eli' },
  { styleName: 'shapes', seed: 'Finn' },
  { styleName: 'lorelei', seed: 'Gus' },
  { styleName: 'notionists', seed: 'Hana' },
  { styleName: 'glass', seed: 'Ines' },
  { styleName: 'thumbs', seed: 'Juno' },
];
</script>

<template>
  <section class="site-container studio-closing">
    <div class="studio-closing-avatars" aria-hidden="true">
      <span
        v-for="avatar in avatars"
        :key="avatar.seed"
        class="studio-closing-tile"
      >
        <img
          :src="getAvatarApiUrl(avatar.styleName, { seed: avatar.seed })"
          alt=""
          width="72"
          height="72"
          loading="lazy"
          decoding="async"
        />
      </span>
    </div>
    <h2 class="site-headline studio-closing-title">{{ closing.title }}</h2>
    <p class="site-lead studio-closing-lead">{{ closing.lead }}</p>
    <div class="studio-closing-actions">
      <StudioActions />
    </div>
  </section>
</template>

<style scoped lang="scss">
.studio-closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 168px;
  padding-bottom: 168px;
  text-align: center;

  &-avatars {
    display: flex;
    gap: 16px;
  }

  &-tile {
    flex-shrink: 0;
    display: block;
    width: 72px;
    height: 72px;
    overflow: hidden;
    border-radius: var(--db-radius-5);
    background: var(--db-tile);

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &-title {
    margin-top: 56px;
  }

  &-lead {
    margin-top: 28px;
  }

  &-actions {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    > div {
      justify-content: center;
    }
  }

  /* The row never wraps. Narrow screens show fewer avatars. */
  @media (max-width: 959px) {
    &-tile:nth-child(n + 8) {
      display: none;
    }
  }

  @media (max-width: 767px) {
    padding-top: 96px;
    padding-bottom: 96px;

    &-avatars {
      gap: 12px;
    }

    &-tile {
      width: 56px;
      height: 56px;
      border-radius: var(--db-radius-4);

      &:nth-child(n + 6) {
        display: none;
      }
    }

    &-title {
      margin-top: 40px;
    }

    &-lead {
      margin-top: 20px;
    }

    &-actions {
      margin-top: 32px;
    }
  }
}
</style>
