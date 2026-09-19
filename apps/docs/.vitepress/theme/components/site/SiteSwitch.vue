<script setup lang="ts">
/**
 * An on/off switch drawn on a checkbox with role="switch". A wrapping label
 * toggles it, and screen readers announce it as a switch.
 */
const model = defineModel<boolean>({ required: true });
</script>

<template>
  <input v-model="model" type="checkbox" role="switch" class="site-switch" />
</template>

<style scoped lang="scss">
.site-switch {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  margin: 0;
  box-sizing: border-box;
  border: 1px solid var(--db-switch-border);
  border-radius: 11px;
  background: var(--db-switch-bg);
  cursor: pointer;
  appearance: none;
  transition:
    background-color var(--duration-fast),
    border-color var(--duration-fast),
    filter var(--duration-fast);

  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--db-knob);
    box-shadow: 0 1px 2px rgba(11, 22, 32, 0.25);
    transition: transform var(--duration-fast);
  }

  /* The hover of every switch on the site: the track darkens a little in
     light mode and brightens in dark mode. */
  &:hover {
    filter: brightness(0.93);

    .dark & {
      filter: brightness(1.25);
    }
  }

  &:checked {
    border-color: var(--db-brand);
    background: var(--db-brand);

    &::before {
      transform: translateX(18px);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &::before {
      transition: none;
    }
  }
}
</style>
