<script setup lang="ts">
/**
 * One component in the inspector, in two tabs. Variants: the probability
 * and the tiles to pick from. Weights: how often the seed lands on each
 * variant, as a list with a share bar and a number per row.
 */
import { computed, inject, ref, watch } from 'vue';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';
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
  // True when the style has a color of the same name, which people look for
  // here first.
  hasColor?: boolean;
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

const probabilityNote = computed(() => {
  if (probability.value >= 100) return '';
  if (probability.value <= 0) {
    return 'Hidden on every seed. The eye in the list brings it back.';
  }

  return `Shows on ${probability.value}% of seeds. The eye in the list sets this to 0 or back to 100.`;
});

// The tabs. Variants opens first, and once Weights was open the weights
// stay in the options.
type Tab = 'variants' | 'weights';

const tabs: { label: string; value: Tab }[] = [
  { label: 'Variants', value: 'variants' },
  { label: 'Weights', value: 'weights' },
];

const tab = ref<Tab>('variants');

watch(tab, (val) => {
  if (val === 'weights' && !showWeights.value) toggleWeights();
});

function resetVariants() {
  store.resetOption(variantKey);
  showWeights.value = props.hasNonDefaultWeights;
}

// The weights list: every variant with its weight, 0 for one left out, and
// its share of all weights for the bar.
const rows = computed(() => {
  const weights = variantWeights.value;
  const sum = props.variants.reduce((acc, v) => acc + (weights[v] ?? 0), 0);

  return props.variants.map((variant) => {
    const weight = weights[variant] ?? 0;

    return {
      variant,
      weight,
      share: sum > 0 ? (weight / sum) * 100 : 0,
    };
  });
});

function setRowWeight(variant: string, value: number | null) {
  const weight = Math.max(0, value ?? 0);

  if (weight === 0) {
    if (variantWeights.value[variant] !== undefined) toggleVariant(variant);

    return;
  }

  setWeight(variant, weight);
}
</script>

<template>
  <div class="pg-comp">
    <SiteSegmented
      v-if="variants.length > 0"
      v-model="tab"
      :options="tabs"
      aria-label="View"
      fluid
    />

    <template v-if="tab === 'variants'">
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
        <p v-if="probabilityNote" class="pg-help">{{ probabilityNote }}</p>
      </div>

      <div v-if="variants.length > 0" class="pg-field">
        <div class="pg-field-label">
          <span>Variants</span>
          <span class="pg-field-tools pg-comp-tools">
            <PlaygroundFieldReset
              v-if="store.isOptionSet(variantKey)"
              @click="resetVariants"
            />
            <button
              type="button"
              class="site-btn site-btn-ghost site-btn-sm"
              @click="selectAll"
            >
              All
            </button>
            <button
              type="button"
              class="site-btn site-btn-ghost site-btn-sm"
              @click="selectNone"
            >
              None
            </button>
          </span>
        </div>
        <div class="pg-comp-grid">
          <button
            v-for="variant in variants"
            :key="variant"
            type="button"
            class="pg-comp-tile"
            :class="{ 'hv-thumb': variantWeights[variant] === undefined }"
            :aria-pressed="variantWeights[variant] !== undefined"
            :title="variant"
            @click="toggleVariant(variant)"
          >
            <span class="pg-comp-tile-picture">
              <img
                v-if="preview"
                :src="preview.toDataUri(componentName, variant)"
                alt=""
              />
            </span>
          </button>
        </div>
      </div>

      <p v-if="hasColor" class="pg-help">
        Colors are entries of their own, further down the list.
      </p>
    </template>

    <template v-else>
      <p class="pg-help">
        A weight says how often the seed lands on a variant. 0 leaves it out.
      </p>

      <div class="pg-comp-weights">
        <div
          v-for="row in rows"
          :key="row.variant"
          class="pg-comp-weight"
          :class="{ 'is-out': row.weight === 0 }"
        >
          <span class="pg-comp-weight-picture">
            <img
              v-if="preview"
              :src="preview.toDataUri(componentName, row.variant)"
              alt=""
            />
          </span>
          <span class="pg-comp-weight-name">
            <span class="pg-comp-weight-label">{{ row.variant }}</span>
            <span class="pg-comp-weight-bar" aria-hidden="true">
              <span :style="{ width: `${row.share}%` }" />
            </span>
          </span>
          <SiteNumberField
            :model-value="row.weight"
            :min="0"
            :max-fraction-digits="2"
            size="sm"
            :aria-label="`Weight of ${row.variant}`"
            class="pg-comp-weight-field"
            @update:model-value="
              (val: number | null) => setRowWeight(row.variant, val)
            "
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pg-comp {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pg-comp-tools {
  gap: 4px;

  .pg-field-reset {
    margin-right: 6px;
  }
}

/* Four tiles a row in the inspector, more in a wide panel, three when the
   column gets narrow. */
.pg-comp-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

@container pg-options (min-width: 600px) {
  .pg-comp-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
}

@container pg-options (max-width: 300px) {
  .pg-comp-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.pg-comp-tile {
  display: block;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  border: 2px solid var(--db-line);
  border-radius: var(--db-radius-3);
  background: var(--db-paper);
  font: inherit;
  cursor: pointer;
  transition:
    opacity var(--duration-fast) ease,
    border-color 0.12s;

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
  }

  /* Hovering a chosen tile shows the dashed line of the unchosen ones, in
     the same weight: a click will take it out. */
  &[aria-pressed='true']:hover,
  &[aria-pressed='true']:focus-visible {
    border-style: dashed;
  }
}

/* The light tile stays light in dark mode, like everywhere behind avatars. */
.pg-comp-tile-picture,
.pg-comp-weight-picture {
  display: block;
  overflow: hidden;
  border-radius: var(--db-radius-2);
  background: var(--db-tile);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

/* The part sits inside its tile with room around it, so the tile's ground
   does not end where the drawing ends. */
.pg-comp-tile-picture {
  width: 100%;
  aspect-ratio: 1 / 1;
  box-sizing: border-box;
  padding: 12%;
  border-radius: calc(var(--db-radius-3) - 2px);
}

.pg-comp-weights {
  display: flex;
  flex-direction: column;
}

.pg-comp-weight {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;

  &.is-out {
    opacity: 0.5;
  }
}

.pg-comp-weight-picture {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid var(--db-line);
  border-radius: 10px;
}

.pg-comp-weight-name {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.pg-comp-weight-label {
  overflow: hidden;
  font-family: var(--db-font-mono);
  font-size: 13px;
  line-height: 18px;
  color: var(--db-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.pg-comp-weight-bar {
  display: block;
  height: 4px;
  border-radius: 2px;
  background: var(--db-soft);
  overflow: hidden;

  > span {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--db-brand);
    transition: width var(--duration-fast) ease;
  }
}

.pg-comp-weight-field {
  flex-shrink: 0;
  width: 88px;

  :deep(.site-number-input) {
    font-family: var(--db-font-mono);
    text-align: center;
  }
}
</style>
