<script setup lang="ts">
/**
 * A note beside the seed field on the first visit: what a seed does and
 * what to put in it. The stage decides where it fits and when it goes.
 */
const emit = defineEmits<{
  dismiss: [];
}>();
</script>

<template>
  <div class="pg-seed-hint" role="note" aria-labelledby="pg-seed-hint-title">
    <p id="pg-seed-hint-title" class="pg-seed-hint-title">
      Same seed, same avatar
    </p>
    <p class="pg-seed-hint-text">
      A seed always draws the same avatar. Use a user ID as the seed and every
      user keeps theirs.
    </p>
    <button type="button" class="pg-seed-hint-done" @click="emit('dismiss')">
      Got it
    </button>
  </div>
</template>

<style scoped lang="scss">
/* A bubble in the colors of the tooltips, to the right of the field and
   pointing at it. */
.pg-seed-hint {
  position: absolute;
  z-index: 5;
  top: 50%;
  left: calc(100% + 12px);
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-sizing: border-box;
  padding: 14px 16px 16px;
  border-radius: var(--db-radius-3);
  background: var(--db-ink);
  color: var(--db-paper);
  box-shadow: var(--db-shadow-pop);
  transform: translateY(-50%);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -5px;
    width: 10px;
    height: 10px;
    background: inherit;
    transform: translateY(-50%) rotate(45deg);
  }

  &-title {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }

  &-text {
    margin: 0;
    font-size: 13px;
    line-height: 18px;
    color: color-mix(in srgb, var(--db-paper) 72%, var(--db-ink));
  }

  &-done {
    align-self: flex-start;
    height: 32px;
    margin-top: 8px;
    padding: 0 12px;
    border: 0;
    border-radius: var(--db-radius-1);
    background: var(--db-paper);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--db-ink);
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--db-paper) 88%, var(--db-ink));
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }
}
</style>
