<script setup lang="ts">
/**
 * The list on the tools overview: one row per tool on strong rules, with a
 * picture, the name, a sentence and a button that says where the link
 * leads. The whole row is the link.
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

/** A tool on this site is the next step, one elsewhere a side trip. */
function buttonClass(tool: Tool): string {
  return tool.host ? 'site-btn-secondary' : 'site-btn-primary';
}
</script>

<template>
  <section class="site-container tool-list">
    <div class="site-rows is-strong">
      <a
        v-for="(tool, index) in tools"
        :key="tool.slug"
        :href="tool.href"
        :target="tool.host ? '_blank' : undefined"
        :rel="tool.host ? 'noopener' : undefined"
        class="site-row tool-list-row"
      >
        <span v-if="tool.visual.kind === 'avatar'" class="tool-list-visual">
          <SiteAvatar
            sticker
            :class="index % 2 ? 'is-tilt-r' : 'is-tilt-l'"
            :style-name="tool.visual.styleName"
            :options="{ seed: tool.visual.seed }"
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
          class="site-box is-lilac tool-list-visual tool-list-plugin"
          aria-hidden="true"
        >
          <Frame :size="48" :stroke-width="1.75" />
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
        <span
          v-else
          class="site-box is-soft tool-list-visual tool-list-bundle"
          aria-hidden="true"
        >
          <span
            v-for="(width, bar) in bars"
            :key="width"
            :class="{ 'is-first': bar === 0 }"
            :style="{ width: `${width}%` }"
          />
        </span>

        <span class="tool-list-copy">
          <span class="site-heading">{{ tool.name }}</span>
          <span class="site-body tool-list-text" v-html="tool.text" />
        </span>

        <span class="site-btn" :class="buttonClass(tool)">
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
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../../styles/mixins' as m;

.tool-list {
  padding-top: clamp(40px, 5vw, 72px);
  padding-bottom: clamp(56px, 6.4vw, 96px);

  &-row {
    gap: 20px clamp(24px, 3vw, 48px);
    padding: clamp(20px, 2.4vw, 32px) 0;

    .is-strong > & {
      padding: clamp(20px, 2.4vw, 32px) 0;
    }
  }

  /* The picture of a tool, a square of 88 to 128px. */
  &-visual {
    position: relative;
    display: flex;
    flex: 0 0 clamp(88px, 10vw, 128px);
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border-radius: 24%;

    > :deep(.site-sticker) {
      width: 100%;
    }
  }

  &-frame {
    position: absolute;
    inset: 22%;
    border: 2px dashed var(--db-ink);
    border-radius: 12px;
  }

  &-contrast {
    overflow: hidden;
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

  &-plugin {
    color: var(--db-accent);
  }

  &-bundle {
    flex-direction: column;
    align-items: flex-start;
    gap: clamp(6px, 0.8vw, 10px);
    padding: 0 clamp(18px, 2vw, 26px);

    span {
      display: block;
      height: clamp(8px, 1vw, 12px);
      border-radius: 999px;
      background: var(--db-muted);

      &.is-first {
        background: var(--db-ink);
      }
    }
  }

  &-copy {
    display: flex;
    flex: 999 1 320px;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }

  &-text {
    max-width: 640px;

    :deep(code) {
      @include m.code-inline;
    }
  }

  &-row:hover .site-heading {
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-underline-offset: 6px;
  }
}
</style>
