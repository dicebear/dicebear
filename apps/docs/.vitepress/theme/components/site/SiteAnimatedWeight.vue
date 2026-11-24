<script setup lang="ts">
/**
 * The same loop as SVG, video and GIF, weighed, from the lightest to the
 * heaviest. The SVG and GIF numbers are measurements on Planets, seed Felix,
 * at 160 pixels with 30 frames. Video depends on the encoder, so that bar
 * shows a typical range.
 */
import SiteAvatar from './SiteAvatar.vue';
import SiteSection from './SiteSection.vue';

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
  <SiteSection tone="lilac" layout="stack" title="Lighter than video or GIF">
    <template #hint>
      Animated avatars come as SVG only. The bars below compare the same loop as
      a video and as a GIF, measured on Planets, seed Felix, at 160 pixels with
      30 frames.
    </template>
    <div class="site-split site-animated-weight">
      <div class="site-animated-weight-aside">
        <SiteAvatar
          sticker
          style-name="planets"
          :options="{ seed: 'Felix', animation: true }"
          alt="Animated Planets avatar, the one that was measured"
        />
        <span class="site-text"
          >Video sizes depend on the encoder, so that bar shows a typical range
          rather than a measurement.</span
        >
      </div>
      <div class="site-rows is-strong is-between">
        <div
          v-for="row in rows"
          :key="row.format"
          class="site-row site-animated-weight-row"
        >
          <span class="site-animated-weight-format">
            <span class="site-heading">{{ row.format }}</span>
            <span class="site-text">{{
              row.strong ? 'What DiceBear ships' : 'For comparison'
            }}</span>
          </span>
          <span class="site-animated-weight-cell">
            <span
              class="site-animated-weight-bar"
              :class="{ 'is-strong': row.strong }"
              :style="{ width: `${row.share}%` }"
            ></span>
            <span class="site-text">{{ row.note }}</span>
          </span>
          <span class="site-title site-animated-weight-size">{{
            row.size
          }}</span>
        </div>
      </div>
    </div>
  </SiteSection>
</template>
<style scoped lang="scss">
.site-animated-weight {
  &-aside {
    display: flex;
    flex-direction: column;
    gap: 20px;

    > :first-child {
      width: min(100%, 240px);
      transform: rotate(-3deg);
    }
  }

  /* Format, bar and size in one row; the bar shows the share of the
     largest. */
  &-row {
    display: grid;
    grid-template-columns: minmax(168px, 0.9fr) minmax(0, 3fr) minmax(
        112px,
        0.7fr
      );
    gap: 8px 24px;
    align-items: center;

    @media (max-width: 767px) {
      grid-template-columns: minmax(0, 1fr) auto;

      > :nth-child(2) {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }
  }

  &-format {
    display: flex;
    flex-direction: column;
  }

  &-cell {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  &-bar {
    min-width: 24px;
    height: 24px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--db-accent) 40%, transparent);

    &.is-strong {
      background: var(--db-accent);
    }
  }

  &-size {
    text-align: right;
  }
}
</style>
