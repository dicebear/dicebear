<script setup lang="ts">
import { ArrowRight, Code as CodeIcon } from '@lucide/vue';
import { computed, watch } from 'vue';
import { UiCode, type UiCodeTab } from '../ui';
import SiteDialog from '../site/SiteDialog.vue';
import SiteNotice from '../site/SiteNotice.vue';
import {
  getAvatarApiUrl,
  getAvatarApiCommand,
  unsupportedHttpApiOptions,
} from '@theme/utils/avatar/api';
import {
  formatPhpValue,
  formatPythonValue,
  formatGoValue,
  formatDartValue,
  formatCSharpValue,
} from '@theme/utils/code-examples';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { track, styleLabel } from '@theme/utils/track';
import { useCodeTab } from '@theme/composables/useCodeTab';

const props = withDefaults(
  defineProps<{
    seed: string;
    /** Without its own button the dialog opens through `show()`. */
    trigger?: boolean;
  }>(),
  { trigger: true },
);

const { store, open, options } = usePlaygroundDialog(() => props.seed);

// The language is the one the reader picked last anywhere on the site.
const active = useCodeTab();

watch(open, (isOpen) => {
  if (isOpen) {
    track('Playground: How To Use', {
      style: styleLabel(store.avatarStyleName),
    });
  }
});

const hasExcludedOptions = computed(() => {
  const opts = options.value as Record<string, unknown>;
  return Object.keys(opts).some(
    (k) => unsupportedHttpApiOptions.has(k) && opts[k] !== undefined,
  );
});
const exampleHttpApiHtml = computed(
  () => `<img
  src="${getAvatarApiUrl(store.avatarStyleName, options.value)}"
  alt="avatar" />`,
);
const exampleJsLibrary = computed(() => {
  if (store.isCustomStyle) {
    return `import { Style, Avatar } from '@dicebear/core';

// Your custom style definition
const definition = { /* ... */ };

const style = new Style(definition);
const avatar = new Avatar(style, ${JSON.stringify(options.value, null, 2)});

const svg = avatar.toString();`;
  }

  return `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/${store.avatarStyleName}.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, ${JSON.stringify(options.value, null, 2)});

const svg = avatar.toString();`;
});
const examplePhp = computed(() => {
  const phpOptions = formatPhpValue(options.value, 1);

  if (store.isCustomStyle) {
    return `<?php

use DiceBear\\Style;
use DiceBear\\Avatar;

// Your custom style definition (raw JSON)
$style = Style::fromJson(file_get_contents('./my-style.json'));
$avatar = new Avatar($style, ${phpOptions});

$svg = (string) $avatar;`;
  }

  return `<?php

use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/${store.avatarStyleName}.json'));

$avatar = new Avatar($style, ${phpOptions});

$svg = (string) $avatar;`;
});
const examplePython = computed(() => {
  const pythonOptions = formatPythonValue(options.value, 1);

  if (store.isCustomStyle) {
    return `from pathlib import Path

from dicebear import Avatar, Style

# Your custom style definition (raw JSON)
style = Style.from_json(Path("./my-style.json").read_text("utf-8"))
avatar = Avatar(style, ${pythonOptions})

svg = avatar.to_string()`;
  }

  return `from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("${store.avatarStyleName}.json").read_text("utf-8")
)

avatar = Avatar(style, ${pythonOptions})

svg = avatar.to_string()`;
});
const installRust = computed(() =>
  store.isCustomStyle
    ? 'cargo add dicebear-core serde_json'
    : `cargo add dicebear-core serde_json\ncargo add dicebear-styles --features ${store.avatarStyleName}`,
);
const exampleRust = computed(() => {
  const rustOptions = JSON.stringify(options.value, null, 2);

  if (store.isCustomStyle) {
    return `use dicebear_core::{Avatar, Style};
use serde_json::json;

// Your custom style definition
let definition = std::fs::read_to_string("./my-style.json")?;

let style = Style::from_str(&definition)?;
let avatar = Avatar::new(&style, json!(${rustOptions}))?;

let svg = avatar.to_svg();`;
  }

  return `use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::${store.avatarStyleName.toUpperCase().replace(/-/g, '_')})?;
let avatar = Avatar::new(&style, json!(${rustOptions}))?;

let svg = avatar.to_svg();`;
});
const exampleGo = computed(() => {
  const goOptions = formatGoValue(options.value, 1);

  if (store.isCustomStyle) {
    return `import (
	"os"

	dicebear "github.com/dicebear/dicebear-go/v11"
)

// Your custom style definition
definition, _ := os.ReadFile("./my-style.json")

style, _ := dicebear.NewStyle(definition)
avatar, _ := dicebear.NewAvatar(style, ${goOptions})

svg := avatar.SVG()`;
  }

  // The Go styles module exports each style as a PascalCase variable
  // (e.g. "big-ears" → BigEars).
  const styleConst = store.avatarStyleName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return `import (
	dicebear "github.com/dicebear/dicebear-go/v11"
	"github.com/dicebear/styles/v11"
)

style, _ := dicebear.NewStyle([]byte(styles.${styleConst}))
avatar, _ := dicebear.NewAvatar(style, ${goOptions})

svg := avatar.SVG()`;
});

const exampleDart = computed(() => {
  const dartOptions = formatDartValue(options.value, 1);

  if (store.isCustomStyle) {
    return `import 'dart:io';

import 'package:dicebear_core/dicebear_core.dart';

// Your custom style definition (raw JSON)
final style = Style.parse(File('./my-style.json').readAsStringSync());
final avatar = Avatar(style, ${dartOptions});

final svg = avatar.svg;`;
  }

  // The Dart styles package exposes each style as its own library with a
  // camelCase string constant (e.g. "big-ears" → big_ears.dart / bigEars).
  const styleLibrary = store.avatarStyleName.replace(/-/g, '_');
  const styleConst = store.avatarStyleName
    .split('-')
    .map((part, i) =>
      i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join('');

  return `import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/${styleLibrary}.dart';

final style = Style.parse(${styleConst});
final avatar = Avatar(style, ${dartOptions});

final svg = avatar.svg;`;
});

const exampleCSharp = computed(() => {
  const csharpOptions = formatCSharpValue(options.value, 1);

  if (store.isCustomStyle) {
    return `using System.Text.Json.Nodes;
using DiceBear;

// Your custom style definition (raw JSON)
var style = Style.Parse(File.ReadAllText("./my-style.json"));
var avatar = new Avatar(style, ${csharpOptions});

var svg = avatar.ToSvg();`;
  }

  // The .NET styles package exposes each style as a PascalCase property
  // (e.g. "big-ears" → BigEars).
  const styleConst = store.avatarStyleName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return `using System.Text.Json.Nodes;
using DiceBear;

var style = Style.Parse(Styles.${styleConst});
var avatar = new Avatar(style, ${csharpOptions});

var svg = avatar.ToSvg();`;
});

const exampleCli = computed(() =>
  getAvatarApiCommand(
    store.isCustomStyle ? './my-style.json' : store.avatarStyleName,
    options.value,
  ),
);

interface HowToUseTab extends UiCodeTab {
  docs: string;
  /** The command that installs the packages, shown under the code. */
  install?: string;
}

// The API only knows the packaged styles, so an uploaded style has no HTTP tab.
const tabs = computed<HowToUseTab[]>(() => {
  const custom = store.isCustomStyle;

  const list: HowToUseTab[] = [
    {
      id: 'js-library',
      label: 'JavaScript',
      lang: 'js',
      install: custom
        ? 'npm install @dicebear/core --save'
        : 'npm install @dicebear/core @dicebear/styles --save',
      code: exampleJsLibrary.value,
      docs: '/integrations/javascript/',
    },
    {
      id: 'php-library',
      label: 'PHP',
      lang: 'php',
      install: custom
        ? 'composer require dicebear/core'
        : 'composer require dicebear/core dicebear/styles',
      code: examplePhp.value,
      docs: '/integrations/php/',
    },
    {
      id: 'python-library',
      label: 'Python',
      lang: 'python',
      install: custom
        ? 'pip install dicebear-core'
        : 'pip install dicebear-core dicebear-styles',
      code: examplePython.value,
      docs: '/integrations/python/',
    },
    {
      id: 'rust-library',
      label: 'Rust',
      lang: 'rust',
      install: installRust.value,
      code: exampleRust.value,
      docs: '/integrations/rust/',
    },
    {
      id: 'go-library',
      label: 'Go',
      lang: 'go',
      install: custom
        ? 'go get github.com/dicebear/dicebear-go/v11'
        : 'go get github.com/dicebear/dicebear-go/v11\ngo get github.com/dicebear/styles/v11',
      code: exampleGo.value,
      docs: '/integrations/go/',
    },
    {
      id: 'dart-library',
      label: 'Dart',
      lang: 'dart',
      install: custom
        ? 'dart pub add dicebear_core'
        : 'dart pub add dicebear_core dicebear_styles',
      code: exampleDart.value,
      docs: '/integrations/dart/',
    },
    {
      id: 'csharp-library',
      label: 'C#',
      lang: 'csharp',
      install: custom
        ? 'dotnet add package DiceBear.Core'
        : 'dotnet add package DiceBear.Core\ndotnet add package DiceBear.Styles',
      code: exampleCSharp.value,
      docs: '/integrations/csharp/',
    },
    {
      id: 'cli',
      label: 'CLI',
      install: 'npm install --global dicebear',
      code: exampleCli.value,
      docs: '/integrations/cli/',
    },
  ];

  const libraries = list;

  if (custom) {
    return libraries;
  }

  return [
    {
      id: 'http-api',
      label: 'HTTP API',
      lang: 'html',
      code: exampleHttpApiHtml.value,
      docs: '/integrations/http-api/',
    },
    ...libraries,
  ];
});

const current = computed(
  () => tabs.value.find((tab) => tab.id === active.value) ?? tabs.value[0],
);

function onTab(id: string | undefined) {
  active.value = id ?? tabs.value[0].id;

  track('Playground: How To Use Tab', { tab: active.value });
}
defineExpose({ show: () => (open.value = true) });
</script>

<template>
  <button
    v-if="trigger"
    type="button"
    class="site-btn site-btn-secondary pg-how-to-use-button"
    aria-haspopup="dialog"
    @click="open = true"
  >
    <CodeIcon :size="16" aria-hidden="true" />
    How to use
  </button>

  <SiteDialog v-model:open="open" header="How to use" max-width="860px">
    <div class="pg-how-to-use">
      <div class="pg-how-to-use-tabs" role="tablist" aria-label="Language">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="pg-how-to-use-tab"
          :aria-selected="tab.id === current.id"
          @click="onTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <UiCode
        :key="current.id"
        class="pg-how-to-use-code"
        :lang="current.lang"
        :code="current.code"
      />

      <div class="pg-how-to-use-foot">
        <code v-if="current.install" class="pg-how-to-use-install">{{
          current.install
        }}</code>
        <a :href="current.docs" class="pg-how-to-use-docs hv-link">
          {{ current.label }} documentation
          <ArrowRight :size="16" aria-hidden="true" />
        </a>
      </div>

      <SiteNotice
        v-if="current.id === 'http-api' && hasExcludedOptions"
        tone="warn"
        compact
      >
        Some options you selected are not supported by our public HTTP-API and
        have been omitted from the URL. You can enable them by
        <a href="/recipes/self-host-the-http-api/">hosting your own instance</a
        >.
      </SiteNotice>

      <p
        v-if="store.isCustomStyle && current.id !== 'js-library'"
        class="pg-how-to-use-hint"
      >
        Replace <code>./my-style.json</code> with the path to your style
        definition.
      </p>

      <PlaygroundLicenseAlert />
    </div>
  </SiteDialog>
</template>

<style scoped lang="scss">
.pg-how-to-use-button {
  width: 100%;
  min-width: 0;
  padding: 0 12px;
  font-size: 15px;
}

.pg-how-to-use {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 20px 28px 28px;

  @media (max-width: 640px) {
    padding: 16px 20px 20px;
  }

  // The code scrolls inside its window, so a long option list keeps the
  // license below it in view.
  &-code :deep(.ui-code-text) {
    max-height: 420px;
  }

  :deep(.site-notice a) {
    font-weight: 500;
    color: var(--db-brand-text);
  }

  &-hint {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--db-ink-2);

    code {
      font-family: var(--db-font-mono);
      font-size: 13px;
      color: var(--db-ink);
    }
  }

  /* The languages, underlined where chosen. */
  &-tabs {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    border-bottom: 1px solid var(--db-line);
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-tab {
    flex-shrink: 0;
    padding: 0 2px 10px;
    border: 0;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    background: transparent;
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--db-muted);
    white-space: nowrap;
    cursor: pointer;

    &[aria-selected='true'] {
      border-bottom-color: var(--db-ink);
      font-weight: 600;
      color: var(--db-ink);
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  &-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 20px;
  }

  &-install {
    min-width: 0;
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 20px;
    color: var(--db-muted);
    white-space: pre-line;
  }

  &-docs {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--db-brand-text);
    text-decoration: none;
    white-space: nowrap;
  }
}
</style>
