<script setup lang="ts">
/**
 * The last block of a page: an optional row of avatars, one line in the
 * section voice and the actions that follow from it, centered. It also holds
 * the space to the footer.
 */
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="site-container site-closing">
    <div v-if="$slots.avatars" class="site-closing-avatars">
      <slot name="avatars" />
    </div>
    <h2 class="site-headline">{{ title }}</h2>
    <div class="site-closing-actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 168px;
  padding-bottom: 168px;
  text-align: center;

  &-avatars {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    margin-bottom: 56px;
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 40px;
  }

  @media (max-width: 767px) {
    padding-top: 96px;
    padding-bottom: 96px;

    &-avatars {
      gap: 12px;
      margin-bottom: 40px;
    }

    &-actions {
      margin-top: 32px;
    }
  }
}
</style>
