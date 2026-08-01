<script setup lang="ts">
import { computed, ref } from 'vue';
import { PawPrint } from '@lucide/vue';
import Button from 'primevue/button';
import Select from 'primevue/select';
import { UiCode } from '../ui';
import { escapeJsString, escapeShellArg } from '../../utils/escape';
import { formatDartValue } from '@theme/utils/code-examples';

type CodeExample =
  'api' | 'js' | 'php' | 'python' | 'rust' | 'go' | 'dart' | 'cli';

const props = defineProps<{
  seed: string;
  style: string;
  styleCamel: string;
}>();

const activeExample = ref<CodeExample>('api');
const exampleOptions: { label: string; value: CodeExample }[] = [
  { label: 'HTTP API', value: 'api' },
  { label: 'JS Library', value: 'js' },
  { label: 'PHP Library', value: 'php' },
  { label: 'Python Library', value: 'python' },
  { label: 'Rust Library', value: 'rust' },
  { label: 'Go Library', value: 'go' },
  { label: 'Dart Library', value: 'dart' },
  { label: 'CLI', value: 'cli' },
];

const apiExample = computed(
  () =>
    `https://api.dicebear.com/10.x/${props.style}/svg?seed=${encodeURIComponent(props.seed)}`,
);

const jsExample = computed(
  () =>
    `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/${props.style}.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, {
  seed: '${escapeJsString(props.seed)}'
});`,
);

const phpExample = computed(
  () =>
    `<?php

use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/${props.style}.json'));

$avatar = new Avatar($style, [
  'seed' => '${escapeJsString(props.seed)}'
]);`,
);

const pythonExample = computed(
  () =>
    `from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("${props.style}.json").read_text("utf-8")
)

avatar = Avatar(style, {
    "seed": "${escapeJsString(props.seed)}"
})`,
);

const rustExample = computed(
  () =>
    `use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::${props.style.toUpperCase().replace(/-/g, '_')})?;
let avatar = Avatar::new(&style, json!({
    "seed": "${escapeJsString(props.seed)}"
}))?;`,
);

const goExample = computed(() => {
  // The Go styles module exports each style as a PascalCase variable
  // (e.g. "big-ears" → BigEars).
  const styleConst = props.style
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return `import (
	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
)

style, _ := dicebear.NewStyle([]byte(styles.${styleConst}))
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed": "${escapeJsString(props.seed)}",
})`;
});

const dartExample = computed(
  () =>
    // formatDartValue quotes the seed and escapes $, which escapeJsString
    // leaves alone but Dart would treat as string interpolation.
    `import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/${props.style.replace(/-/g, '_')}.dart';

final style = Style.parse(${props.styleCamel});
final avatar = Avatar(style, {
  'seed': ${formatDartValue(props.seed)},
});`,
);

const cliExample = computed(
  () => `npx dicebear ${props.style} --seed '${escapeShellArg(props.seed)}'`,
);

const playgroundLink = '/playground/';
</script>

<template>
  <div class="app-seed-demo-code">
    <div class="app-seed-demo-code-wrapper">
      <Select
        v-model="activeExample"
        :options="exampleOptions"
        option-label="label"
        option-value="value"
        size="large"
        fluid
        aria-label="Code example"
        class="app-seed-demo-code-select"
      />

      <div class="app-seed-demo-code-body">
        <UiCode
          :code="apiExample"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'api' }"
        />
        <UiCode
          :code="jsExample"
          lang="js"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'js' }"
        />
        <UiCode
          :code="phpExample"
          lang="php"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'php' }"
        />
        <UiCode
          :code="pythonExample"
          lang="python"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'python' }"
        />
        <UiCode
          :code="rustExample"
          lang="rust"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'rust' }"
        />
        <UiCode
          :code="goExample"
          lang="go"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'go' }"
        />
        <UiCode
          :code="dartExample"
          lang="dart"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'dart' }"
        />
        <UiCode
          :code="cliExample"
          scroll-to-bottom
          class="app-seed-demo-code-block"
          :class="{ active: activeExample === 'cli' }"
        />
      </div>
    </div>

    <div class="app-seed-demo-code-cta">
      <Button
        as="a"
        :href="playgroundLink"
        size="large"
        severity="contrast"
        class="app-seed-demo-code-cta-btn"
      >
        <PawPrint :size="20" />
        Open Playground
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-seed-demo-code {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--ui-window-divider-color);
  min-width: 0;

  // Align the code block surface with the example select above it
  // (both sit on --vp-c-bg inside this editor window mockup).
  --vp-code-block-bg: var(--vp-c-bg);

  &-wrapper {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  &-select {
    // size="large" renders the label at 18px; keep the large, full-width
    // control but bring its text in line with the other demo controls (16px).
    :deep(.p-select-label) {
      font-size: 16px;
    }
  }

  &-body {
    flex: 1;
    display: grid;
    min-width: 0;
  }

  &-block {
    grid-area: 1 / 1;
    visibility: hidden;

    &.active {
      visibility: visible;
    }
  }

  &-cta {
    padding: 0 16px 16px;

    &-btn {
      width: 100%;
      justify-content: center;
    }
  }
}

@media (max-width: 768px) {
  .app-seed-demo-code {
    border-left: none;
    border-top: 1px solid var(--ui-window-divider-color);
  }
}
</style>
