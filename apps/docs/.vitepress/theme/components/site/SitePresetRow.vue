<script setup lang="ts">
/**
 * One preset of the gallery page: name, one line, what it sets and what it
 * leaves to the seed, the same seeds as every other row, and the two ways
 * onward. The code opens in the dialog the style page uses as well.
 */
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import type { StyleDefinition } from '@dicebear/core';
import type { StylePreset } from '@theme/config/presets';
import { computeCount } from '@theme/utils/avatar/combinationCount';
import { narrowDefinition } from '@theme/utils/avatar/narrowDefinition';
import SiteAvatar from './SiteAvatar.vue';

const props = defineProps<{
  styleName: string;
  preset: StylePreset;
  seeds: readonly string[];
  definition?: StyleDefinition;
}>();

defineEmits<{ open: [] }>();

const optionCount = computed(() => Object.keys(props.preset.options).length);

/** How many distinct avatars the preset still leaves, from the definition it narrows. */
const count = computed(() =>
  props.definition
    ? computeCount(narrowDefinition(props.definition, props.preset.options))
    : undefined,
);

const playgroundUrl = computed(
  () =>
    `/playground/?style=${kebabCase(props.styleName)}&preset=${encodeURIComponent(props.preset.id)}`,
);
</script>

<template>
  <div class="site-preset-row">
    <div class="site-preset-row-text">
      <h3 class="site-h3">{{ preset.name }}</h3>
      <span class="site-preset-row-summary">{{ preset.summary }}</span>
      <span class="site-preset-row-meta">
        {{ optionCount }} option{{ optionCount === 1 ? '' : 's' }}
        <template v-if="count">
          · {{ count.display }} distinct avatars</template
        >
      </span>
    </div>
    <div class="site-preset-row-band">
      <SiteAvatar
        v-for="seed in seeds"
        :key="seed"
        :style-name="styleName"
        :options="{ seed, ...preset.options }"
        mode="library"
        :size="132"
        :radius="24"
        :alt="`${preset.name} on the seed ${seed}`"
      />
    </div>
    <div class="site-preset-row-actions">
      <button
        type="button"
        class="site-btn site-btn-sm site-btn-secondary"
        @click="$emit('open')"
      >
        Code
      </button>
      <a :href="playgroundUrl" class="site-btn site-btn-sm site-btn-primary">
        Playground
        <ArrowRight :size="16" />
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-preset-row {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) auto;
  gap: 48px;
  align-items: center;
  padding: 28px 0;
  border-top: 1px solid var(--db-line);

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  &-summary {
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  &-meta {
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }

  /* Three tiles of 132 pixels that shrink with a narrow column. */
  &-band {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 132px));
    gap: 12px;
    min-width: 0;

    :deep(.site-avatar) {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1;
    }
  }

  &-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
