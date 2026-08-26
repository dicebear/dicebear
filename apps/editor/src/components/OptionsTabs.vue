<script setup lang="ts">
import useMainStore from '@/stores/main';
import availableStyles from '@/config/styles';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useMainStore();
const { t, te, locale } = useI18n();

/**
 * The label for one option tab.
 *
 * Option labels are a flat map shared by every style, because a key almost
 * always means the same thing wherever it appears: `eyesVariant` is the eyes in
 * every style that draws eyes. Where a key means something else, the style
 * overrides that one label under `styles.<styleName>` in the message file.
 *
 * Overrides are per language, and a language only carries the ones it needs.
 * German labels the bottts `top` because "Kopf" would otherwise appear twice in
 * the same tab strip, once for the head and once for the antenna sitting on it,
 * while English and Portuguese already tell the two apart. The locale is passed
 * to `te` explicitly so a missing German override cannot resolve through the
 * fallback and put an English word in a German tab.
 */
function label(key: string): string {
  const scoped = `styles.${store.selectedStyleName}.${key}`;

  return te(scoped, locale.value) ? t(scoped) : t(key);
}

const tabs = computed(() => {
  const resolvedOptions = store.selectedStylePreview.toJSON().options;
  const configStyleOptions = availableStyles[store.selectedStyleName].options;

  const result: Record<string, boolean> = {
    style: Object.keys(store.availableStyles).length > 1,
  };

  for (const key in configStyleOptions) {
    result[key] = key in resolvedOptions;
  }

  return result;
});
</script>

<template>
  <div class="tabs">
    <Tabs v-model:value="store.selectedTab" scrollable>
      <TabList>
        <Tab
          v-for="(key, i) in Object.keys(tabs)"
          :key="i"
          :value="i.toString()"
          :disabled="!tabs[key]"
        >
          {{ label(key) }}
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  background-color: #fff;
}
</style>
