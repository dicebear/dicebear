<script setup lang="ts">
/**
 * The bundle size estimator: the library and the converter on a soft tile,
 * a list of all styles to tick and filter, and the total with its parts on a
 * yellow tile that stays in view. All sizes are measured at build time.
 */
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import SiteAvatar from '@theme/components/site/SiteAvatar.vue';
import SiteCheckbox from '@theme/components/site/SiteCheckbox.vue';
import SiteSearch from '@theme/components/site/SiteSearch.vue';
import SiteNotice from '@theme/components/site/SiteNotice.vue';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';
import { styleDisplayName, styleSeed } from '@theme/utils/styleMeta';
import type { AvatarStyleSize, ThemeOptions } from '@theme/types';

const { theme } = useData<ThemeOptions>();

// `coreLite` is optional: the choice between the two cores only shows when
// the build measured the lite entry point too.
const sizes: ThemeOptions['avatarStyleSizes'] & { coreLite?: AvatarStyleSize } =
  theme.value.avatarStyleSizes;
const styleNames = Object.keys(theme.value.avatarStyles).sort();
const maxGzip = Math.max(
  1,
  ...styleNames.map((name) => sizes.styles[name]?.gzip ?? 0),
);

const selected = ref<Set<string>>(new Set());
const includeConverter = ref(false);
const useLite = ref(false);
const filter = ref('');

const styles = styleNames.map((name) => {
  const gzip = sizes.styles[name]?.gzip ?? 0;

  return {
    name,
    title: styleDisplayName(name),
    seed: styleSeed(name),
    size: formatSize(gzip),
    raw: formatSize(sizes.styles[name]?.raw ?? 0),
    width: `${Math.max(2, (gzip / maxGzip) * 100).toFixed(1)}%`,
  };
});

const visibleStyles = computed(() => {
  const q = filter.value.toLowerCase().trim();
  if (!q) return styles;
  return styles.filter(
    (style) =>
      style.name.toLowerCase().includes(q) ||
      style.title.toLowerCase().includes(q),
  );
});

const shownLabel = computed(() =>
  visibleStyles.value.length === styles.length
    ? `${styles.length} styles`
    : `${visibleStyles.value.length} of ${styles.length} styles`,
);

const variants = [
  { value: false, label: `Full · ${formatSize(sizes.core.gzip)}` },
  ...(sizes.coreLite
    ? [{ value: true, label: `Lite · ${formatSize(sizes.coreLite.gzip)}` }]
    : []),
];

const core = computed(() =>
  useLite.value && sizes.coreLite
    ? { label: '@dicebear/core/lite', size: sizes.coreLite }
    : { label: '@dicebear/core', size: sizes.core },
);

function selectedSum(key: keyof AvatarStyleSize): number {
  let total = 0;
  for (const name of selected.value) {
    total += sizes.styles[name]?.[key] ?? 0;
  }
  return total;
}

function librarySum(key: keyof AvatarStyleSize): number {
  return (
    core.value.size[key] + (includeConverter.value ? sizes.converter[key] : 0)
  );
}

const selectedGzip = computed(() => selectedSum('gzip'));

const grandTotalGzip = computed(() => librarySum('gzip') + selectedGzip.value);

const grandTotalRaw = computed(() => librarySum('raw') + selectedSum('raw'));

function toggle(name: string) {
  const next = new Set(selected.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  selected.value = next;
}

function selectAll() {
  selected.value = new Set(styleNames);
}

function clear() {
  selected.value = new Set();
}

function formatSize(bytes: number): string {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} kB`;
  return `${bytes} B`;
}
</script>

<template>
  <section class="site-container bundle-size">
    <!-- The total stays first in the DOM, so the stacked layout on narrow
         viewports shows the result above the list. The grid moves it into
         the right column. -->
    <aside class="bundle-size-aside" aria-label="Your bundle">
      <div class="site-box is-tile is-sun bundle-size-summary">
        <h2 class="site-title">Your bundle</h2>
        <output class="bundle-size-total" aria-live="polite">{{
          formatSize(grandTotalGzip)
        }}</output>
        <p class="site-body">gzipped</p>
        <dl class="site-rows is-strong bundle-size-parts">
          <div class="site-row">
            <dt>Minified</dt>
            <dd>{{ formatSize(grandTotalRaw) }}</dd>
          </div>
          <div class="site-row">
            <dt>{{ core.label }}</dt>
            <dd>{{ formatSize(core.size.gzip) }}</dd>
          </div>
          <div v-if="includeConverter" class="site-row">
            <dt>@dicebear/converter</dt>
            <dd>{{ formatSize(sizes.converter.gzip) }}</dd>
          </div>
          <div class="site-row">
            <dt>
              {{ selected.size }} {{ selected.size === 1 ? 'style' : 'styles' }}
            </dt>
            <dd>{{ formatSize(selectedGzip) }}</dd>
          </div>
        </dl>
        <div class="site-actions bundle-size-actions">
          <button
            type="button"
            class="site-btn site-btn-primary"
            @click="selectAll"
          >
            Select all styles
          </button>
          <button
            type="button"
            class="site-btn site-btn-secondary"
            @click="clear"
          >
            Clear
          </button>
        </div>
      </div>
    </aside>

    <div class="bundle-size-main">
      <section
        class="site-box is-tile is-soft bundle-size-library"
        aria-labelledby="bundle-size-library"
      >
        <h2 id="bundle-size-library" class="site-h2">Library</h2>
        <SiteSegmented
          v-if="variants.length > 1"
          v-model="useLite"
          :options="variants"
          aria-label="Library variant"
          fluid
          class="bundle-size-variant"
        />
        <p class="site-text">
          <code class="site-code">@dicebear/core/lite</code> has the same API
          without the two schema validators, which are about half of the
          package.
        </p>
        <SiteNotice
          v-if="useLite"
          tone="warn"
          compact
          title="Lite skips validation"
        >
          Validation keeps scripts, event handlers and external references out
          of the SVG. Use lite only for definitions and options you wrote or
          generated yourself.
        </SiteNotice>
        <label class="bundle-size-converter">
          <SiteCheckbox v-model="includeConverter" />
          <span class="bundle-size-converter-copy">
            <span class="site-title">Add the converter</span>
            <span class="site-text"
              >Turns avatars into PNG, JPEG, WebP and AVIF.</span
            >
          </span>
          <span class="bundle-size-size">{{
            formatSize(sizes.converter.gzip)
          }}</span>
        </label>
      </section>

      <section class="bundle-size-styles" aria-labelledby="bundle-size-styles">
        <div class="bundle-size-styles-head">
          <h2 id="bundle-size-styles" class="site-h2">Styles</h2>
          <p class="site-text">gzipped · minified</p>
        </div>
        <div class="bundle-size-toolbar">
          <SiteSearch
            v-model="filter"
            :placeholder="`Filter ${styles.length} styles`"
            label="Filter styles"
            class="bundle-size-search"
          />
          <span class="site-text bundle-size-shown" aria-live="polite">{{
            shownLabel
          }}</span>
        </div>

        <ul class="site-rows bundle-size-list">
          <li v-for="style in visibleStyles" :key="style.name">
            <label
              class="site-row bundle-size-row"
              :class="{ 'is-selected': selected.has(style.name) }"
            >
              <SiteCheckbox
                :model-value="selected.has(style.name)"
                @update:model-value="toggle(style.name)"
              />
              <SiteAvatar
                :style-name="style.name"
                :options="{ seed: style.seed }"
                :size="40"
              />
              <span class="site-title bundle-size-row-title">{{
                style.title
              }}</span>
              <span class="bundle-size-row-bar" aria-hidden="true">
                <span :style="{ width: style.width }" />
              </span>
              <span class="bundle-size-size">{{ style.size }}</span>
              <span class="bundle-size-size is-muted">{{ style.raw }}</span>
            </label>
          </li>
          <li v-if="visibleStyles.length === 0" class="site-row site-text">
            No styles match "{{ filter }}".
          </li>
        </ul>
      </section>

      <div class="site-box is-tile is-soft bundle-size-method">
        <h2 class="site-h3">How the numbers are measured</h2>
        <p class="site-body">
          A style is one JSON definition from
          <code class="site-code">@dicebear/styles</code>, counted as the
          minified file and gzipped. The library and the converter are each
          bundled with esbuild, minified and gzipped the same way. The library
          is counted once, however many styles you pick.
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.bundle-size {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 400px);
  gap: 32px clamp(32px, 4vw, 64px);
  align-items: start;
  padding-top: clamp(40px, 5vw, 72px);
  padding-bottom: clamp(56px, 6.4vw, 96px);

  // Explicit placement flips the visual order: the total is first in the DOM
  // and in the stacked layout, but sits in the right column on wide screens.
  // The aside stretches to the row height, which gives the sticky tile room.
  &-main {
    display: flex;
    flex-direction: column;
    gap: clamp(32px, 4vw, 56px);
    grid-row: 1;
    grid-column: 1;
    min-width: 0;
  }

  &-aside {
    grid-row: 1;
    grid-column: 2;
    align-self: stretch;
    min-width: 0;
  }

  &-summary {
    position: sticky;
    top: calc(var(--db-header-h) + 32px);
  }

  &-total {
    display: block;
    margin-top: 16px;
    font-family: var(--db-font-display);
    font-size: clamp(40px, 4.4vw, 64px);
    line-height: 0.96;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--db-accent);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;

    + .site-body {
      margin-top: 6px;
    }
  }

  &-parts {
    margin: 24px 0 0;

    .site-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      font-size: 17px;
      line-height: 26px;
    }

    dt {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    dd {
      margin: 0;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  &-actions {
    margin-top: 24px;
  }

  &-library {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  &-variant {
    width: min(520px, 100%);
    margin-top: 4px;

    /* Both sizes in full on the narrowest phones. */
    @media (max-width: 359px) {
      :deep(.site-segmented-item) {
        padding: 0 6px;
        font-size: 14px;
      }
    }
  }

  &-converter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    align-self: stretch;
    padding-top: 16px;
    border-top: 2px solid var(--db-rule);
    cursor: pointer;

    &:hover .site-title {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }

    &-copy {
      display: flex;
      flex: 1 1 240px;
      flex-direction: column;
    }
  }

  &-size {
    flex: 0 0 auto;
    white-space: nowrap;
    font-family: var(--db-font-mono);
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink);
    font-variant-numeric: tabular-nums;
    text-align: right;

    &.is-muted {
      font-weight: 400;
      color: var(--db-muted);
    }
  }

  &-styles-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px 24px;

    .site-text {
      color: var(--db-muted);
    }
  }

  &-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 24px;
    margin-top: 20px;
    padding-bottom: 16px;
  }

  // Doubled selector, so the width wins over the field's own.
  & &-search {
    width: min(320px, 100%);
  }

  &-shown {
    margin-left: auto;
    color: var(--db-muted);
    font-variant-numeric: tabular-nums;
  }

  &-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Checkbox, avatar, name, bar, gzipped and minified size in one row. */
  &-row {
    display: grid;
    grid-template-columns:
      20px 40px minmax(176px, 1fr) minmax(0, 1fr)
      76px 92px;
    gap: 16px;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
    transition: background-color 0.12s;

    /* A ground across the row, reaching a little past the list, like the
       rows of the styles list. */
    &:hover {
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--db-ink) 5%, transparent) 12%,
        color-mix(in srgb, var(--db-ink) 5%, transparent) 88%,
        transparent
      );
    }

    &-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-bar {
      display: block;
      height: 12px;
      overflow: hidden;
      border-radius: 6px;
      background: var(--db-soft);

      span {
        display: block;
        height: 100%;
        border-radius: 6px;
        background: var(--db-muted);
        transition: background-color 0.12s;
      }
    }

    &.is-selected &-bar span {
      background: var(--db-ink);
    }

    @media (max-width: 767px) {
      grid-template-columns: 20px 40px minmax(0, 1fr) auto;

      > :nth-child(4),
      > :nth-child(6) {
        display: none;
      }

      /* A long name takes a second line instead of losing its end. */
      &-title {
        overflow: visible;
        white-space: normal;
      }
    }
  }

  &-method .site-body {
    max-width: 680px;
    margin-top: 12px;
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);

    &-main,
    &-aside {
      grid-row: auto;
      grid-column: auto;
    }

    // Stacked, the tile would cover most of the viewport, so it scrolls
    // away with the rest of the page.
    &-summary {
      position: static;
    }
  }
}
</style>
