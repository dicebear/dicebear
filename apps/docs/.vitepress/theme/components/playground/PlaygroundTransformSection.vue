<script setup lang="ts">
import { computed } from 'vue';
import Slider from 'primevue/slider';
import SelectButton from 'primevue/selectbutton';
import useStore from '@theme/stores/playground';
import { useRangeField } from '@theme/composables/useRangeField';
import PlaygroundRangeField from './PlaygroundRangeField.vue';

const store = useStore();
const { singleComputed } = useRangeField(store.avatarStyleOptions);

const flipOptions = ['none', 'horizontal', 'vertical', 'both'];

const flip = computed({
  get: () => {
    const val = store.avatarStyleOptions['flip'];

    return typeof val === 'string' ? val : 'none';
  },
  set: (val: string) => {
    if (val === 'none') {
      delete store.avatarStyleOptions['flip'];
    } else {
      store.avatarStyleOptions['flip'] = val;
    }
  },
});

const borderRadius = singleComputed('borderRadius', 0);
</script>

<template>
  <div class="pg-transform">
    <div class="pg-transform-body">
      <div class="pg-field">
        <div class="pg-field-label">Flip</div>
        <SelectButton v-model="flip" :options="flipOptions" :allow-empty="false" />
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
        :max="2"
        :step="0.01"
        :default-single="1"
      />

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Border Radius</span>
          <span class="pg-field-value">{{ borderRadius }}</span>
        </div>
        <Slider v-model="borderRadius" :min="0" :max="50" :step="1" />
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
  </div>
</template>

<style scoped lang="scss">
.pg-transform {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-transform-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
