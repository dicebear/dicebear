<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeftRight } from '@lucide/vue';
import SiteSlider from '@theme/components/site/SiteSlider.vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    optionKey: string;
    min: number;
    max: number;
    step: number;
    unit?: string;
    defaultSingle: number;
  }>(),
  {
    unit: '',
  },
);

const store = useStore();
const {
  isRangeMode,
  toggleRangeMode,
  resetRangeField,
  singleComputed,
  rangeComputed,
} = useRangeField(store.avatarStyleOptions);

const singleVal = singleComputed(props.optionKey, () => props.defaultSingle);
const rangeVal = rangeComputed(props.optionKey, () => props.defaultSingle);

const displayRange = computed<[number, number]>(() => {
  const [a, b] = rangeVal.value;

  return [Math.min(a, b), Math.max(a, b)];
});

const display = computed(() =>
  isRangeMode(props.optionKey)
    ? `${displayRange.value[0]}${props.unit} to ${displayRange.value[1]}${props.unit}`
    : `${singleVal.value}${props.unit}`,
);

const rangeLabel = computed(() =>
  isRangeMode(props.optionKey) ? 'Switch to fixed value' : 'Switch to range',
);
</script>

<template>
  <div class="pg-field">
    <div class="pg-field-label">
      <span>{{ label }}</span>
      <span class="pg-field-tools">
        <span class="pg-field-value">{{ display }}</span>
        <PlaygroundFieldReset
          v-if="store.isOptionSet(optionKey)"
          @click="resetRangeField(optionKey)"
        />
        <button
          type="button"
          class="site-btn site-btn-ghost site-btn-icon site-btn-sm"
          :aria-pressed="isRangeMode(optionKey)"
          :aria-label="rangeLabel"
          :data-tip="rangeLabel"
          @click="toggleRangeMode(optionKey, defaultSingle)"
        >
          <ArrowLeftRight :size="14" aria-hidden="true" />
        </button>
      </span>
    </div>
    <SiteSlider
      v-if="isRangeMode(optionKey)"
      v-model="rangeVal"
      range
      :min="min"
      :max="max"
      :step="step"
      :aria-label-min="`${label}, minimum`"
      :aria-label-max="`${label}, maximum`"
    />
    <SiteSlider
      v-else
      v-model="singleVal"
      :min="min"
      :max="max"
      :step="step"
      :aria-label="label"
    />
  </div>
</template>
