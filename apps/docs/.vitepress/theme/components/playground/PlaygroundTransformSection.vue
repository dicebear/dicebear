<script setup lang="ts">
import { computed } from 'vue';
import SiteSlider from '@theme/components/site/SiteSlider.vue';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const store = useStore();
const { singleComputed } = useRangeField(store.avatarStyleOptions);

const flipKey = 'flip';
const borderRadiusKey = 'borderRadius';

const flipOptions = [
  { value: 'none', label: 'None' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'both', label: 'Both' },
];

const flip = computed({
  get: () => {
    const val = store.avatarStyleOptions[flipKey];

    return typeof val === 'string' ? val : 'none';
  },
  set: (val: string) => {
    if (val === 'none') {
      delete store.avatarStyleOptions[flipKey];
    } else {
      store.avatarStyleOptions[flipKey] = val;
    }
  },
});

const borderRadius = singleComputed(borderRadiusKey, 0);
</script>

<template>
  <div class="pg-transform-body">
    <div class="pg-field">
      <div class="pg-field-label">
        <span>Flip</span>
        <span class="pg-field-tools">
          <PlaygroundFieldReset
            v-if="store.isOptionSet(flipKey)"
            @click="store.resetOption(flipKey)"
          />
        </span>
      </div>
      <SiteSegmented
        v-model="flip"
        :options="flipOptions"
        aria-label="Flip"
        fluid
        class="pg-transform-flip"
      />
    </div>

    <PlaygroundRangeField
      label="Rotate"
      option-key="rotate"
      :min="-360"
      :max="360"
      :step="1"
      unit="°"
      :default-single="0"
    />

    <PlaygroundRangeField
      label="Scale"
      option-key="scale"
      :min="0"
      :max="10"
      :step="0.01"
      :default-single="1"
    />

    <div class="pg-field">
      <div class="pg-field-label">
        <span>Border radius</span>
        <span class="pg-field-tools">
          <span class="pg-field-value">{{ borderRadius }}</span>
          <PlaygroundFieldReset
            v-if="store.isOptionSet(borderRadiusKey)"
            @click="store.resetOption(borderRadiusKey)"
          />
        </span>
      </div>
      <SiteSlider
        v-model="borderRadius"
        :min="0"
        :max="50"
        :step="1"
        aria-label="Border radius"
      />
    </div>

    <PlaygroundRangeField
      label="Translate X"
      option-key="translateX"
      :min="-100"
      :max="100"
      :step="1"
      unit="%"
      :default-single="0"
    />

    <PlaygroundRangeField
      label="Translate Y"
      option-key="translateY"
      :min="-100"
      :max="100"
      :step="1"
      unit="%"
      :default-single="0"
    />
  </div>
</template>

<style scoped lang="scss">
.pg-transform-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Four labels share a phone column, so the segments give up their padding. */
@container pg-options (max-width: 520px) {
  .pg-transform-flip :deep(.site-segmented-item) {
    padding: 0 4px;
    font-size: 13px;
  }
}
</style>
