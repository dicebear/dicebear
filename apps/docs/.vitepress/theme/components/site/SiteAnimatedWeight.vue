<script setup lang="ts">
/**
 * The same loop as SVG, video and GIF, weighed, from the lightest to the
 * heaviest. The SVG and GIF numbers are measurements on Planets, seed Felix,
 * at 160 pixels with 30 frames. Video depends on the encoder, so that bar
 * shows a typical range.
 */
import SiteAvatar from './SiteAvatar.vue';

const rows = [
  {
    format: 'SVG',
    size: '8.7 KB',
    share: 8,
    strong: true,
    note: 'Sharp at any size, plays anywhere an SVG renders, no script.',
  },
  {
    format: 'MP4',
    size: '~40 to 80 KB',
    share: 55,
    strong: false,
    note: 'Needs a video element, autoplay rules, a poster for the still.',
  },
  {
    format: 'GIF',
    size: '109 KB',
    share: 100,
    strong: false,
    note: 'Blurs when scaled, 256 colors, weighs more with every pixel.',
  },
];
</script>

<template>
  <section class="site-container site-animated-weight">
    <h2 class="site-headline">Lighter than video or GIF</h2>
    <p class="site-lead site-animated-weight-lead">
      Animated avatars come as SVG only. The bars below compare the same loop as
      a video and as a GIF, measured on Planets, seed Felix, at 160 pixels with
      30 frames.
    </p>
    <div class="site-animated-weight-body">
      <div class="site-animated-weight-aside">
        <SiteAvatar
          style-name="planets"
          :options="{ seed: 'Felix', animation: true }"
          :size="200"
          :radius="52"
          alt="Animated Planets avatar, the one that was measured"
        />
        <span class="site-text"
          >Video sizes depend on the encoder, so that bar shows a typical range
          rather than a measurement.</span
        >
      </div>
      <div class="site-animated-weight-chart">
        <div
          v-for="row in rows"
          :key="row.format"
          class="site-animated-weight-row"
          :class="{ 'is-strong': row.strong }"
        >
          <span class="site-animated-weight-format">
            <span class="site-h2">{{ row.format }}</span>
            <span class="site-animated-weight-role">{{
              row.strong ? 'What DiceBear ships' : 'For comparison'
            }}</span>
          </span>
          <span class="site-animated-weight-cell">
            <span
              class="site-animated-weight-bar"
              :style="{ width: `${row.share}%` }"
            ></span>
            <span class="site-text">{{ row.note }}</span>
          </span>
          <span class="site-animated-weight-size">{{ row.size }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.site-animated-weight {
  padding-top: 168px;

  &-lead {
    max-width: 760px;
    margin-top: 32px;
  }

  &-body {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 64px;
    align-items: start;
    margin-top: 64px;
  }

  &-aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 28px;

    .site-text {
      color: var(--db-muted);
    }
  }

  &-chart {
    min-width: 0;
    border-bottom: 1px solid var(--db-line);
  }

  &-row {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr) 180px;
    gap: 32px;
    align-items: center;
    padding: 28px 0;
    border-top: 1px solid var(--db-line);
  }

  &-format {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .site-h2 {
      color: var(--db-ink-2);
    }
  }

  &-role {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-muted);
  }

  &-cell {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  &-bar {
    display: block;
    min-width: 32px;
    height: 32px;
    border-radius: var(--db-radius-2);
    background: var(--db-switch-bg);
  }

  &-size {
    font-family: var(--db-font-mono);
    font-size: 20px;
    line-height: 28px;
    text-align: right;
    color: var(--db-ink-2);
  }

  &-row.is-strong {
    .site-h2 {
      color: var(--db-ink);
    }

    .site-animated-weight-role {
      color: var(--db-brand-text);
    }

    .site-animated-weight-bar {
      background: var(--db-brand);
    }

    .site-animated-weight-size {
      font-weight: 600;
      color: var(--db-ink);
    }
  }

  @media (max-width: 959px) {
    &-body {
      grid-template-columns: minmax(0, 1fr);
      gap: 40px;
    }

    &-aside {
      flex-direction: row;
      align-items: center;
      padding-top: 0;

      :deep(.site-avatar) {
        width: 96px !important;
        height: 96px !important;
        border-radius: 26px !important;
      }
    }
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    &-lead {
      margin-top: 24px;
    }

    &-body {
      margin-top: 40px;
    }

    /* The format and its size share the first line, the bar takes the second. */
    &-row {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      padding: 20px 0;
    }

    &-cell {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }
}
</style>
