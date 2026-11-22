<script setup lang="ts">
/**
 * The seed as a field: the word Seed, the value, and a die that rolls a
 * new one. It sits under the picture, as wide as the picture.
 */
import { storeToRefs } from 'pinia';
import { Shuffle } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import { track, styleLabel } from '@theme/utils/track';

const store = useStore();
const { seed } = storeToRefs(store);

function randomizeSeed() {
  seed.value = Math.random().toString(36).substring(2, 10);

  track('Playground: Seed Randomized', {
    style: styleLabel(store.avatarStyleName),
  });
}

const onFocus = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement;

  requestAnimationFrame(() => {
    input.setSelectionRange(0, input.value.length);
  });
};
</script>

<template>
  <label class="pg-seed">
    <span class="site-label">Seed</span>
    <input
      v-model="seed"
      type="text"
      class="pg-seed-input"
      placeholder="Enter a seed"
      aria-label="Seed"
      autocomplete="off"
      spellcheck="false"
      @focus="onFocus"
    />
    <button
      type="button"
      class="site-btn site-btn-accent site-btn-icon pg-seed-roll"
      aria-label="Random seed"
      data-tip="Random seed"
      @click="randomizeSeed"
    >
      <Shuffle :size="20" aria-hidden="true" />
    </button>
  </label>
</template>

<style scoped lang="scss">
/* The seed field of the Playground: a large pill ringed in ink, the word
   Seed in small capitals, the value in the display face and a yellow die
   that rolls a new one. */
.pg-seed {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 64px;
  padding: 0 8px 0 22px;
  border-radius: 32px;
  background: var(--db-panel);
  box-shadow: 0 0 0 2px var(--db-ink);
  cursor: text;

  &:focus-within {
    box-shadow: 0 0 0 3px var(--db-focus);
  }

  .site-label {
    font-size: 12px;
  }

  &-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    font-family: var(--db-font-display);
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
    color: var(--db-ink);
    outline: none;

    &::placeholder {
      color: var(--db-muted);
    }
  }

  &-roll {
    width: 48px;
    height: 48px;
    border-radius: 24px;
  }
}
</style>
