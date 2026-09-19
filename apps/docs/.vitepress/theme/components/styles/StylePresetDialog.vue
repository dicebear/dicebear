<script setup lang="ts">
/**
 * Everything about a preset that does not fit on its tile: the full seed row,
 * the reasoning behind the preset, what it costs in variety, and the option
 * set as code.
 *
 * The seed row repeats the seeds the style page opened with, so a reader can
 * compare a preset against the default avatars further up the page and see
 * which parts of it still move with the seed.
 */
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { Sparkles } from '@lucide/vue';
import type { StyleDefinition } from '@dicebear/core';
import type { StylePreset } from '@theme/config/presets';
import { computeCount } from '@theme/utils/avatar/combinationCount';
import { narrowDefinition } from '@theme/utils/avatar/narrowDefinition';
import { track, styleLabel } from '@theme/utils/track';
import { UiAvatar, UiDialog } from '../ui';
import StyleOptionsCodePanel from './StyleOptionsCodePanel.vue';

const props = defineProps<{
  open: boolean;
  styleName: string;
  preset?: StylePreset;
  seeds: readonly string[];
  definition?: StyleDefinition;
}>();

defineEmits<{
  'update:open': [value: boolean];
}>();

const playgroundUrl = computed(() =>
  props.preset
    ? `/playground?style=${kebabCase(props.styleName)}&preset=${encodeURIComponent(
        props.preset.id,
      )}`
    : '',
);

// The same number the playground reports for these options, so a preset that
// pins colors visibly costs variety instead of claiming the style's full count.
const count = computed(() =>
  props.definition && props.preset
    ? computeCount(narrowDefinition(props.definition, props.preset.options))
    : undefined,
);

const optionCount = computed(() =>
  props.preset ? Object.keys(props.preset.options).length : 0,
);

/**
 * The description split into plain text and the option names it quotes.
 *
 * Descriptions are written as Markdown, because the llms.txt mirror prints
 * them straight into a Markdown file. Interpolating one here would show the
 * backticks around `outlineColor` or `animation` as literal characters, so the
 * code spans are pulled out and rendered as `<code>`. Nothing else about the
 * text is treated as Markdown, because a full parser for one construct is
 * not worth the bytes.
 */
const descriptionParts = computed(() =>
  (props.preset?.description ?? '')
    .split(/`([^`]+)`/g)
    .map((text, index) => ({ text, code: index % 2 === 1 }))
    .filter((part) => part.text !== ''),
);

// Held rather than built in the template, where the object literal would be a
// new one on every render and make UiAvatar re-render all eight SVGs whenever
// anything else in the dialog changes.
const avatarOptions = computed(() => {
  const options = props.preset?.options ?? {};

  return props.seeds.map((seed) => ({ seed, ...options }));
});

function onOpenPlayground() {
  if (props.preset) {
    track('Style Presets: Open in Playground', {
      style: styleLabel(props.styleName),
      preset: props.preset.id,
    });
  }
}
</script>

<template>
  <UiDialog
    :open="open"
    :header="preset?.name"
    max-width="760px"
    @update:open="$emit('update:open', $event)"
  >
    <div v-if="preset" class="preset-dialog">
      <div class="preset-dialog-band">
        <UiAvatar
          v-for="options in avatarOptions"
          :key="options.seed"
          :size="72"
          :style-name="styleName"
          :style-options="options"
          mode="library"
          alt=""
        />
      </div>

      <p class="preset-dialog-description">
        <template v-for="(part, index) in descriptionParts" :key="index"
          ><code v-if="part.code">{{ part.text }}</code
          ><template v-else>{{ part.text }}</template></template
        >
      </p>

      <div class="preset-dialog-meta">
        <p class="preset-dialog-count">
          {{ optionCount }} options
          <template v-if="count">
            ·
            <strong>{{ count.display }}</strong> distinct avatars
          </template>
        </p>
        <a
          :href="playgroundUrl"
          class="preset-dialog-action hv-link"
          @click="onOpenPlayground"
        >
          <Sparkles :size="14" />
          Open in playground
        </a>
      </div>

      <StyleOptionsCodePanel
        :style-name="styleName"
        :options="preset.options"
      />
    </div>
  </UiDialog>
</template>

<style scoped lang="scss">
.preset-dialog {
  min-width: 0;

  &-band {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 8px;

    /* The checkerboard of UiAvatar stays, so a preset with no background
       reads as transparent here as it does on the tiles. It lies on the tile
       color, which stays light in dark mode. */
    :deep(.ui-avatar) {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      border-radius: var(--db-radius-2);
      background-color: var(--db-tile);
    }

    @media (max-width: 560px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  &-description {
    margin: 14px 0 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--db-ink-2);

    /* The dialog sits outside the prose styles, so the option names it
       quotes need the inline code look spelled out. */
    code {
      padding: 2px 5px;
      border-radius: 4px;
      background: var(--db-soft);
      font-family: var(--db-font-mono);
      font-size: 0.9em;
      color: var(--db-ink);
    }
  }

  &-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 10px 0 16px;
  }

  &-count {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--db-muted);

    strong {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--db-ink);
    }
  }

  &-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: var(--db-brand-text);
  }
}
</style>
