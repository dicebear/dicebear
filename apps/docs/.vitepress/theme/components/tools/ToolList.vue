<script setup lang="ts">
/**
 * The list on the tools overview: one hairline row per tool with a picture,
 * the name, a sentence and where the link leads.
 */
import { ArrowRight, ArrowUpRight, Frame } from '@lucide/vue';
import SiteAvatar from '@theme/components/site/SiteAvatar.vue';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import { hsvToHex, luminance } from '@theme/utils/colorSpaces';
import { tools as toolEntries, type ToolEntry } from '@theme/config/tools';

type Visual =
  | {
      kind: 'avatar';
      styleName: string;
      seed: string;
      alt: string;
      /** Draws the dashed selection frame of the editor over the avatar. */
      framed?: boolean;
    }
  | { kind: 'plugin' }
  | { kind: 'contrast' }
  | { kind: 'bundle' };

type Tool = ToolEntry & { visual: Visual };

const visuals: Record<string, Visual> = {
  playground: {
    kind: 'avatar',
    styleName: 'lorelei',
    seed: getStyleCardSeeds('lorelei')[0],
    alt: 'Lorelei avatar',
  },
  editor: {
    kind: 'avatar',
    styleName: 'shapes',
    seed: getStyleCardSeeds('shapes')[1],
    alt: 'Shapes avatar in the editor',
    framed: true,
  },
  studio: { kind: 'plugin' },
  contrast: { kind: 'contrast' },
  'bundle-size': { kind: 'bundle' },
};

const tools: Tool[] = toolEntries.map((tool) => ({
  ...tool,
  visual: visuals[tool.slug],
}));

// The contrast picker in miniature: the line on the saturation and brightness
// square where black and white score the same, found as the tool finds it.
const MINI = 120;
const MINI_HUE = 210;
const miniCursor = { x: 0.68 * MINI, y: (1 - 0.92) * MINI };

function miniBoundary(): string {
  // Against black and white the equal-contrast luminance is
  // sqrt(0.05 * 1.05) - 0.05.
  const target = Math.sqrt(0.05 * 1.05) - 0.05;
  const points: string[] = [];

  for (let i = 0; i <= 24; i++) {
    const s = (i / 24) * 100;
    let lo = 0;
    let hi = 100;

    for (let k = 0; k < 20; k++) {
      const mid = (lo + hi) / 2;

      if (luminance(hsvToHex({ h: MINI_HUE, s, v: mid })) < target) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    const v = (lo + hi) / 2;

    points.push(
      `${((s / 100) * MINI).toFixed(1)},${((1 - v / 100) * MINI).toFixed(1)}`,
    );
  }

  return points.join(' ');
}

const boundary = miniBoundary();

/** Relative widths of the three bars in the bundle picture. */
const bars = [100, 58, 24];
</script>

<template>
  <section class="site-container tool-list">
    <a
      v-for="tool in tools"
      :key="tool.slug"
      :href="tool.href"
      :target="tool.host ? '_blank' : undefined"
      :rel="tool.host ? 'noopener' : undefined"
      class="tool-list-row hv-row"
    >
      <span v-if="tool.visual.kind === 'avatar'" class="tool-list-visual">
        <SiteAvatar
          :style-name="tool.visual.styleName"
          :options="{ seed: tool.visual.seed }"
          :size="120"
          :radius="0"
          :alt="tool.visual.alt"
        />
        <span
          v-if="tool.visual.framed"
          class="tool-list-frame"
          aria-hidden="true"
        />
      </span>
      <span
        v-else-if="tool.visual.kind === 'plugin'"
        class="tool-list-visual tool-list-plugin"
        aria-hidden="true"
      >
        <Frame :size="48" :stroke-width="1.5" />
      </span>
      <span
        v-else-if="tool.visual.kind === 'contrast'"
        class="tool-list-visual tool-list-contrast"
        aria-hidden="true"
      >
        <svg
          :width="MINI"
          :height="MINI"
          :viewBox="`0 0 ${MINI} ${MINI}`"
          fill="none"
        >
          <polyline
            :points="boundary"
            stroke="#fff"
            stroke-width="2"
            stroke-dasharray="5 4"
            stroke-linejoin="round"
          />
          <circle
            :cx="miniCursor.x"
            :cy="miniCursor.y"
            r="7"
            stroke="#fff"
            stroke-width="2.5"
          />
        </svg>
      </span>
      <span v-else class="tool-list-visual tool-list-bundle" aria-hidden="true">
        <span
          v-for="(width, index) in bars"
          :key="width"
          :class="{ 'is-first': index === 0 }"
          :style="{ width: `${width}%` }"
        />
      </span>

      <span class="tool-list-copy">
        <span class="site-h3 tool-list-name">{{ tool.name }}</span>
        <span class="site-body tool-list-text" v-html="tool.text" />
      </span>

      <span class="site-control tool-list-action">
        <template v-if="tool.host">
          {{ tool.host }}
          <ArrowUpRight :size="18" aria-hidden="true" />
          <span class="sr-only">Opens in a new tab</span>
        </template>
        <template v-else>
          Open
          <ArrowRight :size="18" aria-hidden="true" />
        </template>
      </span>
    </a>
  </section>
</template>

<style lang="scss" scoped>
.tool-list {
  padding-top: 64px;
  padding-bottom: 168px;

  &-row {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr) 200px;
    gap: 48px;
    align-items: center;
    padding: 32px 0;
    border-top: 1px solid var(--db-line);
    color: var(--db-ink);
    text-decoration: none;

    &:last-child {
      border-bottom: 1px solid var(--db-line);
    }
  }

  &-visual {
    position: relative;
    display: block;
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 32px;
  }

  // The avatar fills the picture at every size of it.
  &-visual :deep(.site-avatar) {
    width: 100% !important;
    height: 100% !important;
  }

  &-frame {
    position: absolute;
    inset: 20px;
    border: 2px dashed var(--db-brand);
    border-radius: 16px;
  }

  // The tile stays light in dark mode, so the icon keeps its dark ink.
  &-plugin {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--db-tile);
    color: #0b1620;
  }

  &-contrast {
    background:
      linear-gradient(to top, #000, rgba(0, 0, 0, 0)),
      linear-gradient(to right, #fff, hsl(210, 100%, 50%));

    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }

  &-bundle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    padding: 0 20%;
    box-sizing: border-box;
    background: var(--db-tile);

    span {
      display: block;
      height: 12px;
      border-radius: 6px;
      background: #8fa3b3;

      &.is-first {
        background: #0284c7;
      }
    }
  }

  &-copy {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  &-name {
    color: inherit;
  }

  &-text {
    max-width: 680px;

    :deep(code) {
      font-family: var(--db-font-mono);
      font-size: 0.9em;
      color: var(--db-ink);
    }
  }

  &-action {
    justify-self: end;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--db-brand-text);

    svg {
      flex-shrink: 0;
    }
  }

  @media (max-width: 959px) {
    &-row {
      grid-template-columns: 120px minmax(0, 1fr);
      gap: 16px 32px;
    }

    &-visual {
      grid-row: span 2;
      align-self: start;
    }

    &-action {
      grid-column: 2;
      justify-self: start;
    }
  }

  @media (max-width: 767px) {
    padding-top: 48px;
    padding-bottom: 96px;

    &-row {
      grid-template-columns: 72px minmax(0, 1fr);
      gap: 12px 20px;
      padding: 24px 0;
    }

    // The pictures are drawn at 120px and scale down as a whole.
    &-visual {
      width: 72px;
      height: 72px;
      border-radius: 20px;
    }

    &-frame {
      inset: 12px;
      border-radius: 10px;
    }

    &-plugin svg {
      width: 30px;
      height: 30px;
    }

    &-bundle {
      gap: 6px;

      span {
        height: 8px;
        border-radius: 4px;
      }
    }

    &-name {
      font-size: 20px;
      line-height: 28px;
    }

    &-action {
      font-size: 16px;
    }
  }
}
</style>
