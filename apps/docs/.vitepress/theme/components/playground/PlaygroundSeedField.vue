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
      class="site-btn site-btn-ghost site-btn-icon site-btn-sm"
      aria-label="Random seed"
      data-tip="Random seed"
      @click="randomizeSeed"
    >
      <Shuffle :size="16" aria-hidden="true" />
    </button>
  </label>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

.pg-seed {
  @include c.control;
  @include c.control-size(md);

  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-right: 3px;
  cursor: text;

  &-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    font: inherit;
    font-size: inherit;
    color: var(--db-ink);
    outline: none;

    &::placeholder {
      color: var(--db-muted);
    }
  }
}
</style>
