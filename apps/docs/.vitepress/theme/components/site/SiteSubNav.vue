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
    <div class="site-sub-nav-row">
      <div class="site-sub-nav-items">
        <a
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{ 'is-active': active === item.id }"
          >{{ item.label }}</a
        >
      </div>
      <span class="site-small">On this page</span>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.site-sub-nav {
  position: sticky;
  top: var(--db-header-h);
  z-index: 10;
  margin-top: 120px;
  background: var(--db-paper);

  &-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 0;
    border-top: 1px solid var(--db-line);
    border-bottom: 1px solid var(--db-line);
    font-size: 15px;
    line-height: 24px;
  }

  &-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 32px;
    min-width: 0;

    a {
      color: var(--db-muted);
      text-decoration: none;
      transition: color var(--duration-fast);

      &:hover,
      &.is-active {
        color: var(--db-ink);
      }

      &.is-active {
        font-weight: 500;
      }
    }
  }

  .site-small {
    flex-shrink: 0;
  }

  @media (max-width: 767px) {
    margin-top: 72px;

    .site-small {
      display: none;
    }
  }
}
</style>
