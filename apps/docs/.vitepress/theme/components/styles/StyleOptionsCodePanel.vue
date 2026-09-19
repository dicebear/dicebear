<script setup lang="ts">
/**
 * Code examples for one option value or a whole preset. The tabs are the
 * ones of the Usage section, in the same order and with the same names, and
 * the chosen language is shared with it.
 */
import { computed } from 'vue';
import { UiCode, type UiCodeTab } from '../ui';
import { generateCodeExamples } from '@theme/utils/code-examples';
import { useCodeTab } from '@theme/composables/useCodeTab';

const props = defineProps<{
  styleName: string;
  /** One entry from the options table, or a whole preset's option set. */
  options: Record<string, unknown>;
  excludeHttpApi?: boolean;
}>();

const examples = computed(() =>
  generateCodeExamples(props.styleName, props.options),
);

const tabs = computed<UiCodeTab[]>(() => {
  const { httpApi, js, php, python, rust, go, dart, csharp, cli } =
    examples.value;
  const list: UiCodeTab[] = [];
  if (!props.excludeHttpApi) {
    list.push({ id: 'http-api', label: 'HTTP API', code: httpApi });
  }
  list.push(
    { id: 'js-library', label: 'JavaScript', lang: 'js', code: js },
    { id: 'php-library', label: 'PHP', lang: 'php', code: php },
    { id: 'python-library', label: 'Python', lang: 'python', code: python },
    { id: 'rust-library', label: 'Rust', lang: 'rust', code: rust },
    { id: 'go-library', label: 'Go', lang: 'go', code: go },
    { id: 'dart-library', label: 'Dart', lang: 'dart', code: dart },
    { id: 'csharp-library', label: 'C#', lang: 'csharp', code: csharp },
    { id: 'cli', label: 'CLI', code: cli },
  );
  return list;
});

const active = useCodeTab();
</script>

<template>
  <UiCode class="style-options-code-panel" :tabs="tabs" v-model="active" />
</template>
