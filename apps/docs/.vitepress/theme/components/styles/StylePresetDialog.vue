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
 * text is treated as Markdown; a full parser for one construct is not worth
 * the bytes.
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
            <span class="preset-dialog-sep">·</span>
            <strong>{{ count.display }}</strong> distinct avatars
          </template>
        </p>
        <a
          :href="playgroundUrl"
          class="preset-dialog-action no-icon"
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
  &-band {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;

    /* Keeps UiAvatar's checkerboard, so a preset with no background reads as
       transparent here as it does on the tiles. */
    :deep(.ui-avatar) {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      border-radius: var(--vp-radius-xs);
    }

    @media (max-width: 560px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &-description {
    margin: 14px 0 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--vp-c-text-2);

    /* The dialog is teleported to the body and never sits inside `.vp-doc`,
       so the option names it quotes need the inline-code look spelled out. */
    code {
      padding: 2px 5px;
      border-radius: var(--vp-radius-xs);
      background: var(--vp-c-default-soft);
      font-family: var(--vp-font-family-mono);
      font-size: 0.9em;
      color: var(--vp-c-text-1);
    }
  }

  &-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 10px;
    margin-bottom: 16px;
  }

  &-count {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--ui-c-text-muted);

    strong {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--vp-c-text-1);
    }
  }

  &-sep {
    color: var(--ui-c-text-subtle);
  }

  &-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: var(--vp-radius-chrome);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    color: var(--ui-c-text-muted);
    text-decoration: none;
    transition:
      color var(--duration-fast) var(--ease-smooth),
      background-color var(--duration-fast) var(--ease-smooth);

    &:hover {
      color: var(--vp-c-brand-1);
      background: var(--vp-c-brand-soft);
    }
  }
}
</style>
