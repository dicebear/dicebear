<script setup lang="ts">
import { computed } from 'vue';
import useStore from '@theme/stores/playground';
import { webSafeFonts, fontWeights } from '@theme/utils/avatar/fonts';
import SiteSelect from '@theme/components/site/SiteSelect.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const fontFamilyOptions = webSafeFonts.map((font) => ({
  value: font as string,
  label: font as string,
}));

// The select works on strings, so the weight travels as one. The labels drop
// their dash: "400 Normal".
const fontWeightOptions = fontWeights.map((weight) => ({
  value: String(weight.value),
  label: weight.label.replace(/\s+\W\s+/, ' '),
}));

defineProps<{
  hasFontFamily: boolean;
  hasFontWeight: boolean;
}>();

const store = useStore();

const fontFamilyKey = 'fontFamily';
const fontWeightKey = 'fontWeight';

const fontFamily = computed({
  get: () => {
    const val = store.avatarStyleOptions[fontFamilyKey];

    if (typeof val === 'string') return val;

    return 'system-ui';
  },
  set: (val: string) => {
    if (val === 'system-ui') {
      delete store.avatarStyleOptions[fontFamilyKey];
    } else {
      store.avatarStyleOptions[fontFamilyKey] = val;
    }
  },
});

const fontWeight = computed({
  get: () => {
    const val = store.avatarStyleOptions[fontWeightKey];

    if (typeof val === 'number') return String(val);

    return '400';
  },
  set: (val: string) => {
    if (val === '400') {
      delete store.avatarStyleOptions[fontWeightKey];
    } else {
      store.avatarStyleOptions[fontWeightKey] = Number(val);
    }
  },
});
</script>

<template>
  <div class="pg-font">
    <div class="pg-fields">
      <div v-if="hasFontFamily" class="pg-field">
        <div class="pg-field-label">
          <span>Family</span>
          <span class="pg-field-tools">
            <PlaygroundFieldReset
              v-if="store.isOptionSet(fontFamilyKey)"
              @click="store.resetOption(fontFamilyKey)"
            />
          </span>
        </div>
        <SiteSelect
          v-model="fontFamily"
          :options="fontFamilyOptions"
          label="Font family"
          fluid
        />
      </div>

      <div v-if="hasFontWeight" class="pg-field">
        <div class="pg-field-label">
          <span>Weight</span>
          <span class="pg-field-tools">
            <PlaygroundFieldReset
              v-if="store.isOptionSet(fontWeightKey)"
              @click="store.resetOption(fontWeightKey)"
            />
          </span>
        </div>
        <SiteSelect
          v-model="fontWeight"
          :options="fontWeightOptions"
          label="Font weight"
          fluid
        />
      </div>
    </div>
    <p class="pg-help">
      Only styles with text, such as Initials, read the font.
    </p>
  </div>
</template>

<style scoped lang="scss">
.pg-font {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
