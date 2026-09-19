<script setup lang="ts">
/**
 * The same avatar three times: as a selected layer in the Figma file, from
 * the HTTP API and from the JS library, each with the line that produces it.
 */
import { getAvatarApiUrl } from '@theme/utils/avatar/api';

interface StudioSameColumn {
  caption: string;
  line: string;
  /** Draws the selection ring Figma puts around a selected layer. */
  selected?: boolean;
}

const avatar = getAvatarApiUrl('lorelei', {
  seed: 'Felix',
  backgroundColor: ['b6e3f4'],
});

const columns: StudioSameColumn[] = [
  { caption: 'In the Figma file', line: 'Layer “Felix”', selected: true },
  {
    caption: 'HTTP API',
    line: 'api.dicebear.com/11.x/lorelei/svg?seed=Felix&backgroundColor=b6e3f4',
  },
  {
    caption: 'JS library',
    line: "new Avatar(style, { seed: 'Felix', backgroundColor: ['b6e3f4'] })",
  },
];

const note =
  'DiceBear renders the same avatar from the same seed everywhere, so the one in the app matches the one in the design, whichever integration the developer picks.';
</script>

<template>
  <div class="studio-same">
    <div class="studio-same-grid">
      <div
        v-for="column in columns"
        :key="column.caption"
        class="studio-same-item"
      >
        <span :class="['studio-same-tile', { 'is-selected': column.selected }]">
          <img
            :src="avatar"
            :alt="`${column.caption}: the same avatar`"
            width="96"
            height="96"
            loading="lazy"
            decoding="async"
          />
        </span>
        <span class="studio-same-text">
          <b class="studio-same-caption">{{ column.caption }}</b>
          <code class="studio-same-line">{{ column.line }}</code>
        </span>
      </div>
    </div>
    <p class="site-body studio-same-note">{{ note }}</p>
  </div>
</template>

<style scoped lang="scss">
.studio-same {
  /* The blue Figma uses for a selection. */
  --studio-selection: #0d99ff;

  padding-top: 24px;

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 48px;
  }

  &-item {
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 0;
  }

  &-tile {
    flex-shrink: 0;
    display: block;
    width: 96px;
    height: 96px;
    overflow: hidden;
    border-radius: var(--db-radius-6);
    background: var(--db-tile);

    &.is-selected {
      box-shadow:
        0 0 0 2px var(--db-paper),
        0 0 0 4px var(--studio-selection);
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &-caption {
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
    color: var(--db-ink);
  }

  &-line {
    font-family: var(--db-font-mono);
    font-size: 12px;
    line-height: 16px;
    color: var(--db-ink-2);
    overflow-wrap: anywhere;
  }

  &-note {
    max-width: 820px;
    margin-top: 32px;
  }

  @media (max-width: 959px) {
    padding-top: 0;

    &-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }
}
</style>
