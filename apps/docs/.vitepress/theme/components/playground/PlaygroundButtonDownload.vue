<script setup lang="ts">
/**
 * One split button. The wide part saves the avatar as PNG, the format most
 * downloads ask for. The arrow holds SVG and the other formats and copying
 * the SVG. Seed-based views add the batch download. The editor builds one
 * fixed avatar, where more seeds would only repeat it, so it offers the image
 * URL instead. An uploaded style only renders in the browser, so it saves SVG
 * and has neither raster formats nor a URL.
 */
import { computed, ref } from 'vue';
import { kebabCase } from 'change-case';
import copy from 'copy-to-clipboard';
import { ChevronDown, Copy, Download, Link } from '@lucide/vue';
import { Avatar } from '@dicebear/core';
import {
  getAvatarApiUrl,
  unsupportedHttpApiOptions,
} from '@theme/utils/avatar/api';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { triggerDownload } from '@theme/utils/download';
import { track, styleLabel } from '@theme/utils/track';
import SiteDialog from '../site/SiteDialog.vue';
import SiteMenu, { type SiteMenuItem } from '../site/SiteMenu.vue';
import SiteNotice from '../site/SiteNotice.vue';
import PlaygroundBatchDownload from './PlaygroundBatchDownload.vue';
import PlaygroundDone from './PlaygroundDone.vue';
import { usePlaygroundDialog } from '@theme/composables/usePlaygroundDialog';
import { DOWNLOAD_AVATAR_SIZE, RASTER_DOWNLOAD_SIZE } from './constants';

const props = defineProps<{
  seed: string;
  /** The filled look of the main action, where saving comes first. */
  primary?: boolean;
  /** The 44px size with only the format as its label, for a phone's stage. */
  compact?: boolean;
}>();

const { store, open, options, showDialog } = usePlaygroundDialog(
  () => props.seed,
);

const batchOpen = ref(false);
const raster = computed(() => !store.isCustomStyle);
const editor = computed(() => store.mode === 'editor');

// The dialog after a download or a copy, with the words for either.
const done = ref({
  title: 'Your avatar will be downloaded',
  source: 'download',
  omitted: false,
});

async function svgMarkup(): Promise<string> {
  const avatarStyle = await loadAvatarStyle(store.avatarStyleName);

  return new Avatar(
    avatarStyle,
    clonePlain({
      size: DOWNLOAD_AVATAR_SIZE,
      ...options.value,
    }),
  ).toString();
}

/** The name of the saved file. `custom:` is a store key, not for a reader. */
function fileName(format: string) {
  const name = kebabCase(store.avatarStyleName.replace(/^custom:/, ''));

  return `${name}-${Date.now()}.${format}`;
}

// The dialog speaks once the file is on its way, or says that it is not.
async function saveAs(format: string, makeBlob: () => Promise<Blob>) {
  try {
    triggerDownload(await makeBlob(), fileName(format));

    done.value = {
      title: 'Your avatar will be downloaded',
      source: 'download',
      omitted: false,
    };
    track('Playground: Download', {
      style: styleLabel(store.avatarStyleName),
      format,
    });
  } catch {
    done.value = {
      title: 'Your avatar could not be downloaded',
      source: 'download',
      omitted: false,
    };
  }

  showDialog();
}

function downloadSvg() {
  return saveAs(
    'svg',
    async () => new Blob([await svgMarkup()], { type: 'image/svg+xml' }),
  );
}

function downloadBinary(format: string) {
  return saveAs(format, async () => {
    // A size set under Output wins, otherwise the largest the API renders.
    const response = await fetch(
      getAvatarApiUrl(
        store.avatarStyleName,
        { size: RASTER_DOWNLOAD_SIZE, ...options.value },
        format,
      ),
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.blob();
  });
}

async function copySvg() {
  const successful = await copy(await svgMarkup());

  if (successful) {
    track('Playground: Copy SVG', {
      style: styleLabel(store.avatarStyleName),
    });
  }

  done.value = {
    title: successful
      ? 'Your avatar was copied'
      : 'Your avatar could not be copied',
    source: 'copy',
    omitted: false,
  };
  showDialog();
}

async function copyUrl() {
  const successful = await copy(
    getAvatarApiUrl(store.avatarStyleName, options.value),
  );

  if (successful) {
    track('Playground: Copy URL', {
      style: styleLabel(store.avatarStyleName),
    });
  }

  done.value = {
    title: successful
      ? 'Your image URL was copied'
      : 'Your image URL could not be copied',
    source: 'copy-url',
    // The public API ignores a few options, so the picture can differ.
    omitted:
      successful &&
      Object.entries(options.value).some(
        ([key, value]) =>
          unsupportedHttpApiOptions.has(key) && value !== undefined,
      ),
  };
  showDialog();
}

function downloadMain() {
  if (raster.value) {
    void downloadBinary('png');
  } else {
    void downloadSvg();
  }
}

const mainLabel = computed(() =>
  raster.value ? 'Download PNG' : 'Download SVG',
);

// The API clamps the size of raster images to RASTER_DOWNLOAD_SIZE. The hint
// names the size the file really gets, and says so when a larger size set
// under Output is cut down.
const size = computed(() => {
  const requested = (options.value as Record<string, unknown>).size;

  if (typeof requested !== 'number') {
    return `${RASTER_DOWNLOAD_SIZE} px`;
  }

  return requested > RASTER_DOWNLOAD_SIZE
    ? `${RASTER_DOWNLOAD_SIZE} px max`
    : `${requested} px`;
});

const items = computed<SiteMenuItem[]>(() => [
  ...(raster.value
    ? ([
        { label: 'SVG', hint: 'vector', command: () => void downloadSvg() },
        {
          label: 'JPEG',
          hint: size.value,
          command: () => void downloadBinary('jpg'),
        },
        {
          label: 'WebP',
          hint: size.value,
          command: () => void downloadBinary('webp'),
        },
        {
          label: 'AVIF',
          hint: size.value,
          command: () => void downloadBinary('avif'),
        },
        { separator: true },
      ] satisfies SiteMenuItem[])
    : []),
  { label: 'Copy SVG', icon: Copy, command: () => void copySvg() },
  ...(editor.value
    ? raster.value
      ? ([
          {
            label: 'Copy image URL',
            icon: Link,
            command: () => void copyUrl(),
          },
        ] satisfies SiteMenuItem[])
      : []
    : ([
        { separator: true },
        {
          label: 'Batch download',
          hint: 'many seeds',
          command: () => (batchOpen.value = true),
        },
      ] satisfies SiteMenuItem[])),
]);
</script>

<template>
  <span class="site-btn-group" :class="{ 'is-fluid': !compact }">
    <button
      type="button"
      class="site-btn"
      :class="[
        primary ? 'site-btn-primary' : 'site-btn-secondary',
        { 'site-btn-lg': !compact },
      ]"
      :aria-label="compact ? mainLabel : undefined"
      @click="downloadMain"
    >
      <Download :size="18" aria-hidden="true" />
      {{ compact ? mainLabel.replace('Download ', '') : mainLabel }}
    </button>
    <SiteMenu :items="items" label="More ways to save" align="right">
      <template #trigger="{ open: menuOpen, toggle }">
        <button
          type="button"
          class="site-btn site-btn-icon"
          :class="[
            primary ? 'site-btn-primary' : 'site-btn-secondary',
            { 'site-btn-lg': !compact },
          ]"
          aria-label="More ways to save"
          aria-haspopup="menu"
          :aria-expanded="menuOpen"
          @click="toggle"
        >
          <ChevronDown :size="18" aria-hidden="true" />
        </button>
      </template>
    </SiteMenu>
  </span>

  <PlaygroundDone
    v-model:open="open"
    :title="done.title"
    :options="options"
    :source="done.source"
  >
    <SiteNotice v-if="done.omitted" tone="warn" compact>
      Some options you selected are not supported by our public HTTP API and
      have been omitted from the URL. You can enable them by
      <a href="/recipes/self-host-the-http-api/">hosting your own instance</a>.
    </SiteNotice>
  </PlaygroundDone>

  <SiteDialog
    v-model:open="batchOpen"
    header="Batch download"
    max-width="760px"
  >
    <PlaygroundBatchDownload v-if="batchOpen" />
  </SiteDialog>
</template>
