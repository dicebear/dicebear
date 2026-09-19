<script setup lang="ts">
import { inject } from 'vue';
import SiteSlider from '@theme/components/site/SiteSlider.vue';
import SiteNumberField from '@theme/components/site/SiteNumberField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import { useVariantWeights } from '@theme/composables/useVariantWeights';
import {
  componentPreviewKey,
  componentPreviewDefault,
} from '@theme/components/styles/styleOptionsKeys';

const props = defineProps<{
  componentName: string;
  variants: string[];
  hasProbability: boolean;
  hasNonDefaultWeights: boolean;
  defaultWeights: Record<string, number>;
  defaultProbability: number;
}>();

const store = useStore();
const preview = inject(componentPreviewKey, componentPreviewDefault);

const {
  showWeights,
  variantWeights,
  toggleWeights,
  toggleVariant,
  setWeight,
  selectAll,
  selectNone,
} = useVariantWeights(
  store.avatarStyleOptions,
  () => props.componentName,
  () => props.variants,
  () => props.hasNonDefaultWeights,
  () => props.defaultWeights,
);

const { singleComputed } = useRangeField(store.avatarStyleOptions);

const variantKey = `${props.componentName}Variant`;
const probabilityKey = `${props.componentName}Probability`;

const probability = singleComputed(
  probabilityKey,
  () => props.defaultProbability,
);

function resetVariants() {
  store.resetOption(variantKey);
  showWeights.value = props.hasNonDefaultWeights;
}
</script>

<template>
  <div class="pg-comp-body">
    <div v-if="hasProbability" class="pg-field">
      <div class="pg-field-label">
        <span>Probability</span>
        <span class="pg-field-tools">
          <span class="pg-field-value">{{ probability }}%</span>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(probabilityKey)"
            @click="store.resetOption(probabilityKey)"
          />
        </span>
      </div>
      <SiteSlider
        v-model="probability"
        :min="0"
        :max="100"
        :step="1"
        aria-label="Probability"
      />
    </div>

    <div v-if="variants.length > 0" class="pg-field">
      <div class="pg-field-label pg-comp-variants-label">
        <span>Variants</span>
        <span class="pg-field-tools pg-comp-variants-tools">
          <PlaygroundFieldReset
            v-if="store.isOptionSet(variantKey)"
            @click="resetVariants"
          />
          <button
            type="button"
            class="pg-field-action hv-ghost"
            :aria-pressed="showWeights"
            @click="toggleWeights"
          >
            {{ showWeights ? 'Hide weights' : 'Show weights' }}
          </button>
          <button
            type="button"
            class="pg-field-action hv-ghost"
            @click="selectAll"
          >
            All
          </button>
          <button
            type="button"
            class="pg-field-action hv-ghost"
            @click="selectNone"
          >
            None
          </button>
        </span>
      </div>
      <div class="pg-comp-variants-grid">
        <div v-for="variant in variants" :key="variant" class="pg-comp-variant">
          <button
            type="button"
            class="pg-comp-variant-btn"
            :class="{ 'hv-thumb': variantWeights[variant] === undefined }"
            :aria-pressed="variantWeights[variant] !== undefined"
            :title="variant"
            @click="toggleVariant(variant)"
          >
            <span class="pg-comp-variant-tile">
              <img
                v-if="preview"
                :src="preview.toDataUri(componentName, variant)"
                alt=""
                class="pg-comp-variant-img"
              />
            </span>
            <span class="pg-comp-variant-name">{{ variant }}</span>
          </button>
          <SiteNumberField
            v-if="showWeights && variantWeights[variant] !== undefined"
            :model-value="variantWeights[variant]"
            :min="0"
            :max-fraction-digits="2"
            size="sm"
            fluid
            :aria-label="`Weight of ${variant}`"
            class="pg-comp-variant-weight"
            @update:model-value="
              (val: number | null) => setWeight(variant, Math.max(0, val ?? 0))
            "
          />
        </div>
      </div>
      <p v-if="showWeights" class="pg-help">
        Weight: a higher number makes this variant more likely
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-comp-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pg-comp-variants-label {
  flex-wrap: wrap;
}

.pg-comp-variants-tools {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;

  .pg-field-reset {
    margin-right: 6px;
  }
}

.pg-comp-variants-grid {
  display: grid;
  /* `minmax(0, 1fr)` lets the columns shrink below the width of a long
     variant name. */
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

@container pg-options (max-width: 520px) {
  .pg-comp-variants-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.pg-comp-variant {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.pg-comp-variant-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 6px 6px 4px;
  box-sizing: border-box;
  border: 1px solid var(--db-line);
  border-radius: var(--db-radius-3);
  background: var(--db-paper);
  font: inherit;
  cursor: pointer;
  transition:
    opacity var(--duration-fast) ease,
    border-color 0.12s,
    box-shadow 0.12s;

  &[aria-pressed='false'] {
    border-style: dashed;
    opacity: 0.35;
  }

  &[aria-pressed='false']:hover,
  &[aria-pressed='false']:focus-visible {
    opacity: 0.7;
  }

  &[aria-pressed='true'] {
    border-color: var(--db-brand);
    box-shadow: 0 0 0 1px var(--db-brand);
  }
}

/* The light tile stays light in dark mode, like everywhere behind avatars. */
.pg-comp-variant-tile {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--db-radius-2);
  background: var(--db-tile);
}

.pg-comp-variant-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pg-comp-variant-name {
  /* The full width lets the ellipsis clip a long name. */
  width: 100%;
  overflow: hidden;
  font-family: var(--db-font-mono);
  font-size: 11px;
  line-height: 16px;
  color: var(--db-muted);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pg-comp-variant-weight {
  :deep(.site-number-input) {
    font-family: var(--db-font-mono);
    text-align: center;
  }
}
</style>
