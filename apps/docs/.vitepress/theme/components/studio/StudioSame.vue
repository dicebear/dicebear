<script setup lang="ts">
/**
 * The same avatar three times: as a layer in the Figma file, from the HTTP
 * API and from the JS library, each card with the line that produces it.
 */
import SiteAvatar from '../site/SiteAvatar.vue';

interface StudioSameCard {
  caption: string;
  line: string;
}

const OPTIONS = { seed: 'Felix', backgroundColor: ['b6e3f4'] };

const cards: StudioSameCard[] = [
  { caption: 'In the Figma file', line: 'Layer “Felix”' },
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
    <div class="site-grid studio-same-grid">
      <div
        v-for="card in cards"
        :key="card.caption"
        class="site-box is-card studio-same-card"
      >
        <SiteAvatar
          style-name="lorelei"
          :options="OPTIONS"
          :size="72"
          :alt="`${card.caption}: the same avatar`"
        />
        <span class="studio-same-text">
          <b class="site-title">{{ card.caption }}</b>
          <code class="studio-same-line">{{ card.line }}</code>
        </span>
      </div>
    </div>
    <p class="site-body studio-same-note">{{ note }}</p>
  </div>
</template>

<style scoped lang="scss">
.studio-same {
  &-grid {
    gap: 16px;
  }

  &-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px 16px 16px;
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &-line {
    overflow: hidden;
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 20px;
    color: var(--db-ink-2);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-note {
    max-width: 760px;
    margin-top: 24px;
  }
}
</style>
