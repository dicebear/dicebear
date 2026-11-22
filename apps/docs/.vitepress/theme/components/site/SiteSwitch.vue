<script setup lang="ts">
/**
 * An on/off switch drawn on a checkbox with role="switch". A wrapping label
 * toggles it, and screen readers announce it as a switch. Off it is a soft
 * track with a white knob, on it fills in the button color of its ground.
 */
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'sm' });

const model = defineModel<boolean>({ required: true });
</script>

<template>
  <input
    v-model="model"
    type="checkbox"
    role="switch"
    class="site-switch"
    :class="`is-${size}`"
  />
</template>

<style scoped lang="scss">
.site-switch {
  --track-w: 56px;
  --track-h: 32px;
  --knob: 24px;

  position: relative;
  flex-shrink: 0;
  width: var(--track-w);
  height: var(--track-h);
  margin: 0;
  box-sizing: border-box;
  border: 1px solid var(--db-field-border);
  border-radius: calc(var(--track-h) / 2);
  background: var(--db-soft);
  cursor: pointer;
  appearance: none;
  transition:
    background-color var(--duration-fast),
    border-color var(--duration-fast);

  &.is-md {
    --track-w: 72px;
    --track-h: 44px;
    --knob: 32px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: calc((var(--track-h) - var(--knob)) / 2 - 1px);
    width: var(--knob);
    height: var(--knob);
    border-radius: 50%;
    background: var(--db-panel);
    box-shadow: 0 0 0 1px var(--db-field-border);
    transform: translateY(-50%);
    transition:
      transform var(--duration-fast) var(--ease-smooth),
      background-color var(--duration-fast);
  }

  &:hover {
    border-color: var(--db-ink-2);
  }

  &:checked {
    border-color: var(--db-btn-bg);
    background: var(--db-btn-bg);

    &::before {
      background: var(--db-paper);
      box-shadow: none;
      transform: translate(calc(var(--track-w) - var(--track-h)), -50%);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--db-focus);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &::before {
      transition: none;
    }
  }
}
</style>
