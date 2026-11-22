<script setup lang="ts">
/**
 * The hairline row of anchors that jumps between the sections of a page.
 * It sticks under the site header while the page scrolls. The active entry
 * is the last section whose top has passed the upper third of the viewport.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';

export interface SiteSubNavItem {
  id: string;
  label: string;
}

const props = defineProps<{
  items: SiteSubNavItem[];
}>();

const active = ref<string>('');
let ticking = false;

function update() {
  ticking = false;
  const line = window.innerHeight * 0.3;
  let current = props.items[0]?.id ?? '';
  for (const item of props.items) {
    const el = document.getElementById(item.id);
    if (el && el.getBoundingClientRect().top <= line) {
      current = item.id;
    }
  }
  active.value = current;
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

onMounted(() => {
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});
</script>

<template>
  <nav class="site-container site-sub-nav" aria-label="On this page">
    <span class="site-sub-nav-label">On this page</span>
    <a
      v-for="item in items"
      :key="item.id"
      :href="`#${item.id}`"
      class="site-pill site-pill-outline"
      :aria-current="active === item.id ? 'true' : undefined"
      >{{ item.label }}</a
    >
  </nav>
</template>

<style scoped lang="scss">
/* Chips to the sections of the page; the one in view fills. */
.site-sub-nav {
  position: sticky;
  top: var(--db-header-h);
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: clamp(32px, 4vw, 56px);
  padding-top: 12px;
  padding-bottom: 12px;
  background: var(--db-paper);

  &-label {
    margin-right: 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--db-muted);
  }

  @media (max-width: 767px) {
    &-label {
      display: none;
    }
  }
}
</style>
