<script setup lang="ts">
import { Code as CodeIcon } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { UiCard, UiCode, UiDialog } from '../ui';
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
import Button from 'primevue/button';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { track, styleLabel } from '@theme/utils/track';
import Message from 'primevue/message';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps<{
  seed: string;
}>();

const { store, open, options } = usePlaygroundDialog(() => props.seed);

const tab = ref<string>(store.isCustomStyle ? 'js-library' : 'http-api');

watch(
  () => store.isCustomStyle,
  (isCustom) => {
    if (isCustom && tab.value === 'http-api') {
      tab.value = 'js-library';
    }
  },
);

watch(open, (isOpen) => {
  if (isOpen) {
    track('Playground: How To Use', {
      style: styleLabel(store.avatarStyleName),
    });
  }
});

// Only count tabs the user actively picks while the dialog is open, not the
// automatic http-api → js-library switch for custom styles.
watch(tab, (value) => {
  if (open.value) {
    track('Playground: How To Use Tab', { tab: value });
  }
});

const exampleHttpApi = computed(() =>
  getAvatarApiUrl(store.avatarStyleName, options.value),
);
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

	dicebear "github.com/dicebear/dicebear-go/v10"
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
	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
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
</script>

<template>
  <Button label="How to use" severity="contrast" @click="open = true">
    <template #icon>
      <CodeIcon :size="15" />
    </template>
  </Button>

  <UiDialog v-model:open="open" max-width="800px" header="How to use">
    <div class="playground-button-how-to-use-text">
      <UiCard flush class="playground-button-how-to-use-tabs-card">
        <Tabs v-model:value="tab">
          <TabList>
            <Tab v-if="!store.isCustomStyle" value="http-api">HTTP-API</Tab>
            <Tab value="js-library">JS</Tab>
            <Tab value="php-library">PHP</Tab>
            <Tab value="python-library">Python</Tab>
            <Tab value="rust-library">Rust</Tab>
            <Tab value="go-library">Go</Tab>
            <Tab value="dart-library">Dart</Tab>
            <Tab value="csharp-library">C#</Tab>
            <Tab value="cli">CLI</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-if="!store.isCustomStyle" value="http-api">
              <div class="playground-button-how-to-use-tab-content">
                <p>
                  Use this URL to request this avatar style via our HTTP API.
                </p>
                <UiCode :code="exampleHttpApi" />
                <p>You can use the URL directly as image source.</p>
                <UiCode :code="exampleHttpApiHtml" lang="html" />
                <Message
                  v-if="hasExcludedOptions"
                  severity="warn"
                  :closable="false"
                  :style="{ '--p-message-text-font-size': '13px' }"
                >
                  Some options you selected are not supported by our public
                  HTTP-API and have been omitted from the URL. You can enable
                  them by
                  <a href="/recipes/self-host-the-http-api/"
                    >hosting your own instance</a
                  >.
                </Message>
                <p>
                  See <a href="/integrations/http-api">HTTP-API</a> docs for
                  more information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="js-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First install the required packages via npm:</p>
                <UiCode
                  :code="
                    store.isCustomStyle
                      ? 'npm install @dicebear/core --save'
                      : 'npm install @dicebear/core @dicebear/styles --save'
                  "
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleJsLibrary" lang="js" />
                <p>
                  See <a href="/integrations/javascript">JS</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="php-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First install the required packages via Composer:</p>
                <UiCode
                  :code="
                    store.isCustomStyle
                      ? 'composer require dicebear/core'
                      : 'composer require dicebear/core dicebear/styles'
                  "
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="examplePhp" lang="php" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your
                  style definition.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="python-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First install the required packages via pip:</p>
                <UiCode
                  :code="
                    store.isCustomStyle
                      ? 'pip install dicebear-core'
                      : 'pip install dicebear-core dicebear-styles'
                  "
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="examplePython" lang="python" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your
                  style definition.
                </p>
                <p>
                  See <a href="/integrations/python">Python</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="rust-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First add the required crates with Cargo:</p>
                <UiCode :code="installRust" />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleRust" lang="rust" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your
                  style definition.
                </p>
                <p>
                  See <a href="/integrations/rust">Rust</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="go-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First add the required modules with go get:</p>
                <UiCode
                  :code="
                    store.isCustomStyle
                      ? 'go get github.com/dicebear/dicebear-go/v10'
                      : 'go get github.com/dicebear/dicebear-go/v10\ngo get github.com/dicebear/styles/v10'
                  "
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleGo" lang="go" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your
                  style definition.
                </p>
                <p>
                  See <a href="/integrations/go">Go</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="dart-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First add the required packages with dart pub:</p>
                <UiCode
                  :code="
                    store.isCustomStyle
                      ? 'dart pub add dicebear_core'
                      : 'dart pub add dicebear_core dicebear_styles'
                  "
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleDart" lang="dart" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your
                  style definition.
                </p>
                <p>
                  See <a href="/integrations/dart">Dart</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="csharp-library">
              <div class="playground-button-how-to-use-tab-content">
                <p>First add the required packages with the dotnet CLI:</p>
                <UiCode
                  :code="
                    store.isCustomStyle
                      ? 'dotnet add package DiceBear.Core'
                      : 'dotnet add package DiceBear.Core\ndotnet add package DiceBear.Styles'
                  "
                />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleCSharp" lang="csharp" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your
                  style definition.
                </p>
                <p>
                  See <a href="/integrations/csharp">C#</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
            <TabPanel value="cli">
              <div class="playground-button-how-to-use-tab-content">
                <p>First install the CLI package via npm:</p>
                <UiCode code="npm install --global dicebear" />
                <p>Then you can create this avatar as follows:</p>
                <UiCode :code="exampleCli" />
                <p v-if="store.isCustomStyle">
                  Replace <code>./my-style.json</code> with the path to your
                  style definition.
                </p>
                <p>
                  See <a href="/integrations/cli">CLI</a> docs for more
                  information.
                </p>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </UiCard>

      <PlaygroundLicenseAlert />
    </div>
  </UiDialog>
</template>

<style scoped lang="scss">
.playground-button-how-to-use {
  &-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    a {
      color: var(--vp-c-brand-1);

      &:hover {
        color: var(--vp-c-brand-2);
      }
    }
  }

  &-tab-content {
    display: flex;
    flex-direction: column;
    gap: 12px;

    p {
      margin: 0;
    }
  }
}
</style>
