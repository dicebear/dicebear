<script setup lang="ts">
/**
 * The bundle size estimator: a list of all styles to tick on the left, the
 * total with its parts on the right. All sizes are measured at build time.
 */
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import SiteAvatar from '@theme/components/site/SiteAvatar.vue';
import SiteCheckbox from '@theme/components/site/SiteCheckbox.vue';
import SiteSearch from '@theme/components/site/SiteSearch.vue';
import SiteSwitch from '@theme/components/site/SiteSwitch.vue';
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

const cores = [
  {
    lite: false,
    pkg: '@dicebear/core',
    hint: 'Checks definitions and options against the schema.',
    gzip: sizes.core.gzip,
  },
  ...(sizes.coreLite
    ? [
        {
          lite: true,
          pkg: '@dicebear/core/lite',
          hint: 'Skips the schema check. Use it only for definitions and options from your own code.',
          gzip: sizes.coreLite.gzip,
        },
      ]
    : []),
];

const selectedGzip = computed(() => {
  let total = 0;
  for (const name of selected.value) {
    total += sizes.styles[name]?.gzip ?? 0;
  }
  return total;
});

const libraryGzip = computed(
  () =>
    (useLite.value && sizes.coreLite ? sizes.coreLite.gzip : sizes.core.gzip) +
    (includeConverter.value ? sizes.converter.gzip : 0),
);

const grandTotalGzip = computed(() => libraryGzip.value + selectedGzip.value);

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
    <aside class="bundle-size-aside">
      <div class="bundle-size-summary">
        <span class="site-label">Total, minified and gzipped</span>
        <output class="site-display bundle-size-total" aria-live="polite">{{
          formatSize(grandTotalGzip)
        }}</output>

        <div class="bundle-size-parts">
          <div
            :role="cores.length > 1 ? 'radiogroup' : undefined"
            :aria-label="cores.length > 1 ? 'Core' : undefined"
          >
            <component
              :is="cores.length > 1 ? 'label' : 'div'"
              v-for="core in cores"
              :key="core.pkg"
              class="bundle-size-part"
              :class="{ 'is-control': cores.length > 1 }"
            >
              <input
                v-if="cores.length > 1"
                v-model="useLite"
                type="radio"
                name="bundle-size-core"
                class="bundle-size-radio"
                :value="core.lite"
              />
              <span class="bundle-size-part-copy">
                <code class="bundle-size-part-name">{{ core.pkg }}</code>
                <span class="bundle-size-part-hint">{{ core.hint }}</span>
              </span>
              <span class="bundle-size-part-size">{{
                formatSize(core.gzip)
              }}</span>
            </component>
          </div>

          <label class="bundle-size-part is-control hv-switch">
            <SiteSwitch v-model="includeConverter" class="hv-track" />
            <span class="bundle-size-part-copy">
              <code class="bundle-size-part-name">@dicebear/converter</code>
              <span class="bundle-size-part-hint"
                >PNG, JPEG, WebP and AVIF output</span
              >
            </span>
            <span class="bundle-size-part-size">{{
              formatSize(sizes.converter.gzip)
            }}</span>
          </label>

          <div class="bundle-size-part">
            <span class="bundle-size-part-copy">
              <span class="bundle-size-part-name"
                >{{ selected.size }}
                {{ selected.size === 1 ? 'style' : 'styles' }} selected</span
              >
            </span>
            <span class="bundle-size-part-size">{{
              formatSize(selectedGzip)
            }}</span>
          </div>
        </div>

        <p class="bundle-size-note">
          Styles are measured as their minified JSON files, the packages as one
          minified bundle each, all gzipped.
        </p>
      </div>
    </aside>

    <div class="bundle-size-main">
      <div class="bundle-size-toolbar">
        <SiteSearch
          v-model="filter"
          :placeholder="`Filter ${styles.length} styles`"
          label="Filter styles"
          class="bundle-size-search"
        />
        <button
          type="button"
          class="site-btn site-btn-sm site-btn-secondary"
          @click="selectAll"
        >
          Select all
        </button>
        <button
          type="button"
          class="site-btn site-btn-sm site-btn-secondary"
          @click="clear"
        >
          Clear
        </button>
        <span class="bundle-size-shown" aria-live="polite">{{
          shownLabel
        }}</span>
      </div>

      <ul class="bundle-size-list">
        <li v-for="style in visibleStyles" :key="style.name">
          <label
            class="bundle-size-row"
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
              :radius="10"
            />
            <span class="bundle-size-row-name">
              <span class="bundle-size-row-title">{{ style.title }}</span>
              <code class="bundle-size-row-slug">{{ style.name }}</code>
            </span>
            <span class="bundle-size-row-bar" aria-hidden="true">
              <span :style="{ width: style.width }" />
            </span>
            <span class="bundle-size-row-size">{{ style.size }}</span>
          </label>
        </li>
        <li v-if="visibleStyles.length === 0" class="bundle-size-empty">
          No styles match "{{ filter }}".
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.bundle-size {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 384px;
  gap: 64px;
  align-items: start;
  padding-top: 64px;
  padding-bottom: 168px;

  // Explicit placement flips the visual order: the total is first in the DOM
  // and in the stacked layout, but sits in the right column on wide screens.
  // The aside stretches to the row height, which gives the sticky block room.
  &-main {
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
    display: flex;
    flex-direction: column;
  }

  &-total {
    display: block;
    margin-top: 12px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &-parts {
    margin-top: 32px;
    border-bottom: 1px solid var(--db-line);
  }

  &-part {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
    border-top: 1px solid var(--db-line);

    &.is-control {
      cursor: pointer;
    }

    &-copy {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    &-name {
      font-size: 15px;
      line-height: 24px;
      font-weight: 600;
      color: var(--db-ink);
      overflow-wrap: anywhere;
    }

    code {
      font-size: 0.9em;
    }

    &-hint {
      font-size: 13px;
      line-height: 18px;
      color: var(--db-muted);
    }

    &-size {
      flex-shrink: 0;
      font-family: var(--db-font-mono);
      font-size: 14px;
      line-height: 20px;
      color: var(--db-ink);
      font-variant-numeric: tabular-nums;
    }
  }

  &-radio {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    margin: 0;
    box-sizing: border-box;
    border: 1.5px solid var(--db-btn-border);
    border-radius: 50%;
    background: var(--db-paper);
    cursor: pointer;
    appearance: none;
    transition: border-color var(--duration-fast);

    &:hover {
      border-color: var(--db-hover-border);
    }

    &:checked {
      border: 6px solid var(--db-brand);
    }

    &:focus-visible {
      outline-offset: 2px;
    }
  }

  &-note {
    margin: 20px 0 0;
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }

  &-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding-bottom: 20px;
  }

  // Doubled selector, so the width wins over the field's own.
  & &-search {
    width: 320px;
  }

  &-shown {
    margin-left: auto;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);
    font-variant-numeric: tabular-nums;
  }

  &-list {
    margin: 0;
    padding: 0;
    list-style: none;
    border-bottom: 1px solid var(--db-line);
  }

  &-row {
    display: grid;
    grid-template-columns: 18px 40px minmax(0, 1fr) 240px 72px;
    gap: 16px;
    align-items: center;
    min-height: 56px;
    border-top: 1px solid var(--db-line);
    color: var(--db-ink);
    cursor: pointer;

    &-name {
      display: flex;
      align-items: baseline;
      gap: 12px;
      min-width: 0;
    }

    &-title {
      font-size: 16px;
      line-height: 26px;
      font-weight: 600;
      white-space: nowrap;
    }

    &-slug {
      overflow: hidden;
      font-size: 13px;
      line-height: 18px;
      color: var(--db-muted);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-bar {
      display: block;
      height: 8px;
      overflow: hidden;
      border-radius: 4px;
      background: var(--db-line);

      span {
        display: block;
        height: 100%;
        border-radius: 4px;
        background: var(--db-btn-border);
        transition: background-color var(--duration-fast);
      }
    }

    &-size {
      font-family: var(--db-font-mono);
      font-size: 14px;
      line-height: 20px;
      text-align: right;
      color: var(--db-ink-2);
      font-variant-numeric: tabular-nums;
    }

    &.is-selected &-bar span {
      background: var(--db-brand);
    }

    &.is-selected &-size {
      color: var(--db-ink);
    }
  }

  &-empty {
    padding: 24px 0;
    border-top: 1px solid var(--db-line);
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);
  }

  @media (max-width: 1279px) {
    gap: 48px;

    &-row {
      grid-template-columns: 18px 40px minmax(0, 1fr) 160px 72px;
    }
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);

    &-main,
    &-aside {
      grid-row: auto;
      grid-column: auto;
    }

    // Stacked, the block would cover most of the viewport, so it scrolls
    // away with the rest of the page.
    &-summary {
      position: static;
    }
  }

  @media (max-width: 767px) {
    padding-top: 48px;
    padding-bottom: 96px;

    & &-search {
      width: 100%;
    }

    &-row {
      grid-template-columns: 18px 40px minmax(0, 1fr) 72px;
      gap: 12px;

      &-bar {
        display: none;
      }

      &-title {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  @media (max-width: 640px) {
    &-row-slug {
      display: none;
    }

    &-shown {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
