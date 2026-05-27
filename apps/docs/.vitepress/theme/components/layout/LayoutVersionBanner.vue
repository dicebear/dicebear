<script setup lang="ts">
import { Info } from 'lucide-vue-next';
</script>

<template>
  <div class="layout-version-banner">
    <Info class="layout-version-banner-icon" :size="16" :stroke-width="2.5" />
    <span class="layout-version-banner-text">
      You are viewing the documentation for DiceBear 9.x. The latest
      documentation for DiceBear 10.x is available at
      <a
        class="layout-version-banner-link"
        href="https://www.dicebear.com"
        rel="noopener noreferrer"
      >www.dicebear.com</a>.
    </span>
  </div>
</template>

<style lang="scss" scoped>
.layout-version-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: calc(var(--vp-z-index-nav) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  height: var(--vp-layout-top-height);
  background: #fde68a;
  color: #78350f;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
}

.layout-version-banner-icon {
  flex-shrink: 0;
  color: #78350f;
}

.layout-version-banner-link {
  color: #78350f;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity var(--duration-fast) var(--ease-smooth);

  &:hover {
    opacity: 0.75;
  }
}

@media (max-width: 640px) {
  .layout-version-banner {
    font-size: 12px;
    padding: 8px 12px;
  }
}
</style>
