<script setup lang="ts">
/**
 * The three tabs of the plugin as folder tabs over one block: Generate in
 * yellow, Inspect in blue, Build in coral. The chosen tab grows into its
 * block. A link to `#inspect` or `#build` opens that tab.
 */
import { onMounted, ref } from 'vue';
import SiteDie from '../site/SiteDie.vue';

export interface StudioTab {
  id: 'generate' | 'inspect' | 'build';
  name: string;
  lead: string;
  tone: 'sun' | 'sky' | 'coral';
}

const props = defineProps<{ tabs: StudioTab[] }>();

defineSlots<Record<StudioTab['id'], () => unknown>>();

const active = ref<StudioTab['id']>(props.tabs[0].id);

function open(id: StudioTab['id']) {
  active.value = id;
  history.replaceState(null, '', `#${id}`);
}

function onKeydown(event: KeyboardEvent, index: number) {
  const last = props.tabs.length - 1;
  const target = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last,
  }[event.key];

  if (target === undefined) return;

  event.preventDefault();
  open(props.tabs[target].id);
  document.getElementById(`studio-tab-${props.tabs[target].id}`)?.focus();
}

onMounted(() => {
  const hash = window.location.hash.slice(1);
  const tab = props.tabs.find((entry) => entry.id === hash);

  if (tab) {
    active.value = tab.id;
  }
});
</script>

<template>
  <div class="studio-tabs">
    <div class="studio-tabs-list" role="tablist" aria-label="The three tabs">
      <button
        v-for="(tab, index) in tabs"
        :id="`studio-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        class="site-box studio-tabs-tab"
        :class="`is-${tab.tone}`"
        :aria-selected="active === tab.id"
        :aria-controls="tab.id"
        :tabindex="active === tab.id ? 0 : -1"
        @click="open(tab.id)"
        @keydown="onKeydown($event, index)"
      >
        <SiteDie :face="index + 1" :size="28" />
        {{ tab.name }}
      </button>
    </div>

    <section
      v-for="(tab, index) in tabs"
      v-show="active === tab.id"
      :id="tab.id"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="`studio-tab-${tab.id}`"
      class="site-box is-block studio-tabs-panel"
      :class="[`is-${tab.tone}`, `is-at-${index}`]"
    >
      <h2 class="site-headline">{{ tab.name }}</h2>
      <p class="site-lead studio-tabs-lead">{{ tab.lead }}</p>
      <div class="studio-tabs-body">
        <slot :name="tab.id" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.studio-tabs {
  &-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
    gap: 8px;
    width: min(var(--db-content), 100% - 2 * var(--db-wrap));
    margin: clamp(40px, 5vw, 72px) auto 0;
  }

  /* A tab: a small block of its color. The chosen one reaches down to the
     panel with a square foot, and two inward curves join it to the panel
     like the tab of a folder. */
  &-tab {
    --studio-tabs-join: 12px;

    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    margin-bottom: var(--studio-tabs-join);
    padding: 20px clamp(14px, 2.4vw, 28px);
    border-radius: clamp(18px, 2.4vw, 28px);
    font-family: var(--db-font-display);
    font-size: clamp(17px, 2.2vw, 28px);
    line-height: 1.3;
    font-weight: 800;
    color: var(--db-accent);
    text-align: left;
    cursor: pointer;

    &[aria-selected='true'] {
      /* One pixel into the panel, so no seam shows between the two. */
      margin-bottom: -1px;
      padding-bottom: calc(20px + var(--studio-tabs-join) + 1px);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      cursor: default;

      &::before,
      &::after {
        content: '';
        position: absolute;
        bottom: 1px;
        width: var(--studio-tabs-join);
        height: var(--studio-tabs-join);
        pointer-events: none;
      }

      &::before {
        right: 100%;
        background: radial-gradient(
          circle at 0 0,
          transparent calc(var(--studio-tabs-join) - 0.5px),
          var(--db-paper) var(--studio-tabs-join)
        );
      }

      &::after {
        left: 100%;
        background: radial-gradient(
          circle at 100% 0,
          transparent calc(var(--studio-tabs-join) - 0.5px),
          var(--db-paper) var(--studio-tabs-join)
        );
      }

      /* The outer tabs sit on a square corner of the panel. */
      &:first-child::before,
      &:last-child::after {
        display: none;
      }
    }

    &:focus-visible {
      outline-offset: 3px;
    }
  }

  /* The corner under the first or last tab is square. */
  &-panel {
    /* VitePress focuses the target of a hash link; a panel is no control,
       so it shows no ring for that. */
    &:focus {
      outline: none;
    }

    &.is-at-0 {
      border-top-left-radius: 0;
    }

    &.is-at-2 {
      border-top-right-radius: 0;
    }
  }

  /* The panels follow each other in the markup, hidden but for one, so the
     space the site puts between two blocks would open a gap under the tabs.
     Stated with the full selector to outrank that rule. */
  & &-panel.site-box.is-block {
    margin-top: 0;
  }

  &-lead {
    max-width: 760px;
    margin-top: 24px;
  }

  &-body {
    display: flex;
    flex-direction: column;
    gap: clamp(40px, 5vw, 72px);
    margin-top: clamp(40px, 5vw, 72px);
  }
}
</style>
