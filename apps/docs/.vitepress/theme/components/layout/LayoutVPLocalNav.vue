<script lang="ts" setup>
import { useData } from 'vitepress';
import { useLayout } from 'vitepress/theme';

defineProps<{
  open: boolean;
}>();

defineEmits<{
  (e: 'open-menu'): void;
}>();

const { theme, frontmatter } = useData();
const { hasSidebar } = useLayout();

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}
</script>

<template>
  <div v-if="hasSidebar" class="layout-vp-local-nav">
    <button
      class="layout-vp-local-nav-menu"
      :aria-expanded="open"
      aria-controls="VPSidebarNav"
      @click="$emit('open-menu')"
    >
      <span
        class="vpi-text-align-start layout-vp-local-nav-menu-icon"
        aria-hidden="true"
      ></span>
      <span class="layout-vp-local-nav-menu-text">
        {{ frontmatter.sidebarMenuLabel || theme.sidebarMenuLabel || 'Menu' }}
      </span>
    </button>

    <a class="layout-vp-local-nav-top-link" href="#" @click="scrollToTop">
      {{ theme.returnToTopLabel || 'Return to top' }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.layout-vp-local-nav {
  position: sticky;
  top: 0;
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-gutter);
  padding-top: var(--vp-layout-top-height, 0px);
  width: 100%;
  background-color: var(--vp-local-nav-bg-color);
  transition:
    border-color 0.5s,
    background-color 0.5s;

  @media (min-width: 960px) {
    display: none;
  }

  &-menu {
    display: flex;
    align-items: center;
    padding: 12px 24px 11px;
    line-height: 24px;
    font-size: 12px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    transition: color 0.5s;

    &:hover {
      color: var(--vp-c-text-1);
      transition: color 0.25s;
    }

    @media (min-width: 768px) {
      padding: 0 32px;
    }

    &-icon {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
  }

  &-top-link {
    display: block;
    padding: 12px 24px 11px;
    line-height: 24px;
    font-size: 12px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    transition: color 0.5s;

    &:hover {
      color: var(--vp-c-text-1);
      transition: color 0.25s;
    }

    @media (min-width: 768px) {
      padding: 12px 32px 11px;
    }
  }
}
</style>
