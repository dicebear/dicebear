<script setup lang="ts">
/**
 * The plugin has three tabs and the page has one chapter for each. This index
 * names them and jumps to the chapter.
 */
import type { Component } from 'vue';
import { ArrowDown, Code, Loader, Pencil } from '@lucide/vue';

interface StudioTab {
  id: string;
  name: string;
  text: string;
  icon: Component;
}

const tabs: StudioTab[] = [
  {
    id: 'generate',
    name: 'Generate',
    text: 'Fills the selected layers with avatars, or inserts new ones.',
    icon: Loader,
  },
  {
    id: 'inspect',
    name: 'Inspect',
    text: 'Hands the seed, the API URL and the code to developers.',
    icon: Code,
  },
  {
    id: 'style',
    name: 'Style',
    text: 'Turns a Figma frame into an avatar style, and back.',
    icon: Pencil,
  },
];
</script>

<template>
  <nav class="studio-tabs" aria-label="The three tabs">
    <a
      v-for="tab in tabs"
      :key="tab.id"
      class="studio-tabs-item hv-row"
      :href="`#${tab.id}`"
    >
      <span class="studio-tabs-head">
        <span class="studio-tabs-name site-heading">
          <component :is="tab.icon" :size="24" aria-hidden="true" />
          {{ tab.name }}
        </span>
        <ArrowDown
          class="studio-tabs-chev hv-chev"
          :size="20"
          aria-hidden="true"
        />
      </span>
      <span class="site-text">{{ tab.text }}</span>
    </a>
  </nav>
</template>

<style scoped lang="scss">
.studio-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--db-line);
  border-bottom: 1px solid var(--db-line);

  &-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 32px 40px;
    color: var(--db-ink);
    text-decoration: none;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    & + & {
      border-left: 1px solid var(--db-line);
    }
  }

  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  /* The name follows the link color, so the row hover reaches it. */
  &-name {
    display: flex;
    align-items: center;
    gap: 12px;
    color: inherit;
  }

  &-chev {
    flex-shrink: 0;
    color: var(--db-muted);
  }

  /* Scoped rules outrank the shared hv-row hover, so it is repeated here. */
  &-item:hover,
  &-item:hover &-chev {
    color: var(--db-brand-text);
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);

    &-item {
      padding: 24px 0;

      & + & {
        border-left: 0;
        border-top: 1px solid var(--db-line);
      }
    }
  }
}
</style>
