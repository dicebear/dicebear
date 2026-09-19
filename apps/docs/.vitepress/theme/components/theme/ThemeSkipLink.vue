<template>
  <a href="#content" class="theme-skip-link">Skip to content</a>
</template>

<style lang="scss" scoped>
.theme-skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 90;
  padding: 10px 16px;
  border-radius: var(--db-radius-2);
  background: var(--db-btn-bg);
  color: var(--db-btn-fg);
  font-size: 14px;
  font-weight: 600;
  transform: translateY(-200%);

  &:focus {
    transform: none;
  }
}
</style>
