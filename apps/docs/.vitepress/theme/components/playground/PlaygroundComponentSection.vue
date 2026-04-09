<script setup lang="ts">
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import { Weight } from '@lucide/vue';
import { UiAvatar } from '../ui';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import { useVariantWeights } from '@theme/composables/useVariantWeights';
import { getComponentVariantPreviewOptions } from '@theme/utils/avatar';
import type { ComponentDependency } from '@theme/composables/useDependencyMap';

const props = defineProps<{
  componentName: string;
  allComponentNames: string[];
  variants: string[];
  hasProbability: boolean;
  hasRotate: boolean;
  hasTranslateX: boolean;
  hasTranslateY: boolean;
  hasNonDefaultWeights: boolean;
  defaultWeights: Record<string, number>;
  defaultProbability: number;
  defaultRotate: readonly number[];
  defaultTranslateX: readonly number[];
  defaultTranslateY: readonly number[];
  dependency?: ComponentDependency;
  allDependencies?: Record<string, ComponentDependency>;
}>();

const store = useStore();

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

function variantPreviewOptions(variant: string) {
  return getComponentVariantPreviewOptions(
    props.componentName,
    variant,
    props.allComponentNames,
    props.allDependencies ?? {},
  );
}

const { singleComputed } = useRangeField(store.avatarStyleOptions);

const probability = singleComputed(`${props.componentName}Probability`, props.defaultProbability);

const rotateKey = `${props.componentName}Rotate`;
const translateXKey = `${props.componentName}TranslateX`;
const translateYKey = `${props.componentName}TranslateY`;

const defaultRotateFallback = props.defaultRotate.length === 1 ? props.defaultRotate[0] : 0;
const defaultTranslateXFallback = props.defaultTranslateX.length === 1 ? props.defaultTranslateX[0] : 0;
const defaultTranslateYFallback = props.defaultTranslateY.length === 1 ? props.defaultTranslateY[0] : 0;

const defaultRotateRange = props.defaultRotate.length === 2 ? props.defaultRotate : undefined;
const defaultTranslateXRange = props.defaultTranslateX.length === 2 ? props.defaultTranslateX : undefined;
const defaultTranslateYRange = props.defaultTranslateY.length === 2 ? props.defaultTranslateY : undefined;
</script>

<template>
  <div class="pg-comp-body">
    <div class="pg-comp-variants" v-if="variants.length > 0">
      <div class="pg-field-label">
        <span>Variants</span>
        <Button
          size="small"
          :severity="showWeights ? 'primary' : 'secondary'"
          v-tooltip="showWeights ? 'Hide weights' : 'Show weights'"
          @click="toggleWeights"
          class="pg-field-toggle"
        >
          <Weight :size="14" />
        </Button>
        <Button label="All" size="small" severity="secondary" @click="selectAll" class="pg-field-toggle" />
        <Button label="None" size="small" severity="secondary" @click="selectNone" class="pg-field-toggle" />
      </div>
      <div class="pg-comp-variants-grid">
        <div
          v-for="variant in variants"
          :key="variant"
          class="pg-comp-variant"
          :class="{ 'pg-comp-variant-off': variantWeights[variant] === undefined }"
        >
          <button
            class="pg-comp-variant-btn"
            :class="{ 'pg-comp-variant-btn-active': variantWeights[variant] !== undefined }"
            @click="toggleVariant(variant)"
          >
            <UiAvatar
              bare
              :style-name="store.avatarStyleName"
              :style-options="variantPreviewOptions(variant)"
              mode="library"
            />
          </button>
          <span class="pg-comp-variant-name">{{ variant }}</span>
          <InputNumber
            v-if="showWeights && variantWeights[variant] !== undefined"
            v-tooltip="'Weight — higher values increase probability'"
            :model-value="variantWeights[variant]"
            @update:model-value="(val: number) => setWeight(variant, Math.max(0, val ?? 0))"
            :min="0"
            :min-fraction-digits="0"
            :max-fraction-digits="2"
            :show-buttons="false"
            locale="en-US"
            class="pg-comp-variant-weight"
          />
        </div>
      </div>
    </div>

    <div class="pg-field" v-if="hasProbability">
      <div class="pg-field-label">
        <span>Probability</span>
        <span class="pg-field-value">{{ probability }}%</span>
      </div>
      <Slider v-model="probability" :min="0" :max="100" :step="1" />
    </div>

    <PlaygroundRangeField
      v-if="hasRotate"
      label="Rotate"
      :option-key="rotateKey"
      :min="-360"
      :max="360"
      :step="1"
      unit="°"
      :default-single="defaultRotateFallback"
      :default-range="defaultRotateRange"
    />

    <PlaygroundRangeField
      v-if="hasTranslateX"
      label="Translate X"
      :option-key="translateXKey"
      :min="-100"
      :max="100"
      :step="1"
      unit="%"
      :default-single="defaultTranslateXFallback"
      :default-range="defaultTranslateXRange"
    />

    <PlaygroundRangeField
      v-if="hasTranslateY"
      label="Translate Y"
      :option-key="translateYKey"
      :min="-100"
      :max="100"
      :step="1"
      unit="%"
      :default-single="defaultTranslateYFallback"
      :default-range="defaultTranslateYRange"
    />
  </div>
</template>

<style scoped lang="scss">
.pg-comp-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-comp-variants-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.pg-comp-variant {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  transition: opacity var(--duration-fast) ease;

  &-off {
    opacity: 0.25;
  }
}

.pg-comp-variant-btn {
  width: 100%;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: var(--vp-radius-xs);
  background: none;
  cursor: pointer;
  transition: all var(--duration-fast) ease;

  &-active {
    border-color: var(--p-primary-color);
  }

  &:hover {
    border-color: var(--p-primary-200);
  }
}

.pg-comp-variant-name {
  font-size: 9px;
  color: var(--vp-c-text-3);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.pg-comp-variant-weight {
  width: 40px;

  :deep(input) {
    width: 40px;
    height: 20px;
    padding: 0 4px;
    font-size: 11px;
    text-align: center;
  }
}

</style>
