<script setup lang="ts">
import { computed, useId } from 'vue';
import { UiCode } from '../ui';
import { generateCodeExamples } from '@theme/utils/code-examples';

const props = defineProps<{
  styleName: string;
  /** One entry from the options table, or a whole preset's option set. */
  options: Record<string, unknown>;
  excludeHttpApi?: boolean;
}>();

const examples = computed(() =>
  generateCodeExamples(props.styleName, props.options),
);

const groupId = useId();

type Tab = { key: string; label: string; lang?: string; code: string };

const tabs = computed<Tab[]>(() => {
  const list: Tab[] = [];
  if (!props.excludeHttpApi) {
    list.push({
      key: 'http-api',
      label: 'HTTP-API',
      code: examples.value.httpApi,
    });
  }
  list.push({ key: 'js', label: 'JS', lang: 'js', code: examples.value.js });
  list.push({
    key: 'php',
    label: 'PHP',
    lang: 'php',
    code: examples.value.php,
  });
  list.push({
    key: 'python',
    label: 'Python',
    lang: 'python',
    code: examples.value.python,
  });
  list.push({
    key: 'rust',
    label: 'Rust',
    lang: 'rust',
    code: examples.value.rust,
  });
  list.push({ key: 'go', label: 'Go', lang: 'go', code: examples.value.go });
  list.push({
    key: 'dart',
    label: 'Dart',
    lang: 'dart',
    code: examples.value.dart,
  });
  list.push({ key: 'cli', label: 'CLI', code: examples.value.cli });
  return list;
});
</script>

<template>
  <!--
    Markup intentionally mirrors VitePress' :::code-group output so the global
    `useCodeGroups` click handler (auto-installed by the default theme) drives
    tab switching for free. Required: .vp-code-group > .tabs (radio + label
    pairs) and .blocks > .language-* children, first marked `.active`.
  -->
  <div class="vp-code-group style-options-code-panel">
    <div class="tabs">
      <template v-for="(tab, i) in tabs" :key="tab.key">
        <input
          type="radio"
          :name="`code-group-${groupId}`"
          :id="`code-group-${groupId}-${tab.key}`"
          :checked="i === 0"
        />
        <label :for="`code-group-${groupId}-${tab.key}`">{{ tab.label }}</label>
      </template>
    </div>
    <div class="blocks">
      <div
        v-for="(tab, i) in tabs"
        :key="tab.key"
        :class="[`language-${tab.lang ?? 'txt'}`, { active: i === 0 }]"
      >
        <UiCode :lang="tab.lang" :code="tab.code" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.style-options-code-panel {
  margin-top: 0;

  :deep(.ui-code) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
