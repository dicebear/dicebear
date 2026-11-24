<script setup lang="ts">
/**
 * The last block of a page: a stack of avatars, one line in the section
 * voice, an optional lead and the actions that follow, centered. With a tone
 * it is a color block, without one it stands on the page.
 */
import type { SiteTone } from './SiteSection.vue';

defineProps<{
  title: string;
  lead?: string;
  tone?: SiteTone;
}>();
</script>

<template>
  <section
    class="site-closing"
    :class="tone ? ['site-box', 'is-block', `is-${tone}`] : 'site-container'"
  >
    <div v-if="$slots.avatars" class="site-stack site-closing-avatars">
      <slot name="avatars" />
    </div>
    <h2 class="site-headline">{{ title }}</h2>
    <p v-if="lead" class="site-lead site-closing-lead">{{ lead }}</p>
    <div class="site-actions site-closing-actions">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.site-closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &.site-container {
    padding-top: clamp(56px, 6.4vw, 96px);
    padding-bottom: clamp(72px, 8vw, 120px);
  }

  &.site-box {
    margin-top: var(--db-edge);
    margin-bottom: var(--db-edge);
  }

  &-avatars {
    margin-bottom: clamp(28px, 3vw, 40px);
  }

  &-lead {
    max-width: 640px;
    margin-top: 24px;
  }

  &-actions {
    justify-content: center;
    margin-top: 36px;
  }
}
</style>
