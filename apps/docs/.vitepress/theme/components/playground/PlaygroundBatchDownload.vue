<script setup lang="ts">
/**
 * Many avatars at once: random seeds or a pasted list, a look at the first
 * of them, the format, and one ZIP.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { Download, Shuffle } from '@lucide/vue';
import JSZip from 'jszip';
import { Avatar } from '@dicebear/core';
import { UiLicenseAlert } from '@theme/components/ui';
import SiteNotice from '../site/SiteNotice.vue';
import SiteNumberField from '../site/SiteNumberField.vue';
import SiteSegmented from '../site/SiteSegmented.vue';
import SiteTextarea from '../site/SiteTextarea.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';
import useStore from '@theme/stores/playground';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';
import { triggerDownload } from '@theme/utils/download';
import { DOWNLOAD_AVATAR_SIZE } from './constants';

const SEED_CAP = 500;
const PREVIEW_LIMIT = 12;

type Mode = 'paste' | 'random';
type Format = 'svg' | 'png' | 'jpeg' | 'webp';

const store = useStore();

const mode = ref<Mode>('random');
const modeOptions: { label: string; value: Mode }[] = [
  { label: 'Random', value: 'random' },
  { label: 'Paste', value: 'paste' },
];

// The raster formats are drawn in the browser, so the list is what a canvas
// can encode.
const format = ref<Format>('svg');
const formatOptions: { label: string; value: Format }[] = [
  { label: 'SVG', value: 'svg' },
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
  { label: 'WebP', value: 'webp' },
];

const seedsInput = ref('');
const randomCount = ref(24);
const randomSeeds = ref<string[]>([]);

function generateRandomSeeds(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(crypto.randomUUID().replaceAll('-', '').slice(0, 10));
  }
  return out;
}

function shuffleRandom() {
  randomSeeds.value = generateRandomSeeds(randomCount.value);
}

shuffleRandom();

watch(mode, (m) => {
  if (m === 'random' && randomSeeds.value.length === 0) {
    shuffleRandom();
  }
});

// The field reports null while it is empty, and the count keeps its value.
function onRandomCount(value: number | null) {
  if (value !== null) {
    randomCount.value = value;
  }
}

watch(randomCount, (n) => {
  if (mode.value === 'random' && Number.isFinite(n) && n > 0) {
    randomSeeds.value = generateRandomSeeds(Math.min(n, SEED_CAP));
  }
});

const seeds = computed<string[]>(() => {
  if (mode.value === 'paste') {
    return seedsInput.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
  return randomSeeds.value;
});

const seedCount = computed(() => seeds.value.length);
const overCap = computed(() => seedCount.value > SEED_CAP);
const previewSeeds = computed(() => seeds.value.slice(0, PREVIEW_LIMIT));

const isGenerating = ref(false);
const progress = ref({ done: 0, total: 0 });
const errorMessage = ref('');
const successState = ref(false);

const canGenerate = computed(
  () =>
    !isGenerating.value &&
    seedCount.value > 0 &&
    !overCap.value &&
    !!store.avatarStyleName,
);

const generateLabel = computed(() => {
  if (isGenerating.value) {
    return `Bundling ${progress.value.done} / ${progress.value.total}…`;
  }
  if (seedCount.value === 0) return 'Add seeds to begin';
  return `Download ${seedCount.value} file${seedCount.value === 1 ? '' : 's'}`;
});

const cleanStyleName = computed(() =>
  store.avatarStyleName.replace(/^custom:/, ''),
);

// One option set per tile, held here. An object literal in the template would
// be a new one on every render, and the thumbnail renders again whenever its
// options change identity.
const previewItems = computed(() =>
  previewSeeds.value.map((seed) => ({
    seed,
    options: { ...store.avatarStyleOptionsWithoutDefaults, seed },
  })),
);

// A listener further up suppresses the default Enter newline in the capture
// phase, so the handler inserts the newline itself.
async function onTextareaEnter(event: KeyboardEvent) {
  event.preventDefault();
  event.stopPropagation();
  const ta = event.target as HTMLTextAreaElement;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  seedsInput.value = ta.value.slice(0, start) + '\n' + ta.value.slice(end);
  await nextTick();
  ta.selectionStart = ta.selectionEnd = start + 1;
  ta.scrollTop = ta.scrollHeight;
}

function safeName(seed: string, used: Set<string>, ext: string): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = seed.replace(/[/\\:*?"<>|\x00-\x1f]/g, '-').slice(0, 200);
  const base = cleaned || 'avatar';
  let name = `${base}.${ext}`;
  let i = 2;
  while (used.has(name)) name = `${base}-${i++}.${ext}`;
  used.add(name);
  return name;
}

const MIME: Record<Exclude<Format, 'svg'>, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

// The SVG drawn onto a canvas of the download size. JPEG has no
// transparency, so it gets a white ground first.
async function rasterize(svg: string, kind: Exclude<Format, 'svg'>) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('The avatar could not be drawn.'));
      image.src = url;
    });

    const canvas = document.createElement('canvas');
    const size = DOWNLOAD_AVATAR_SIZE;

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');

    if (!context) throw new Error('The avatar could not be drawn.');

    if (kind === 'jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, size, size);
    }

    context.drawImage(image, 0, 0, size, size);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(
                new Error(`The browser cannot write ${kind.toUpperCase()}.`),
              ),
        MIME[kind],
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

let aborted = false;
onBeforeUnmount(() => {
  aborted = true;
});

async function generate() {
  if (!canGenerate.value) return;

  isGenerating.value = true;
  errorMessage.value = '';
  successState.value = false;
  progress.value = { done: 0, total: seedCount.value };

  try {
    const style = await loadAvatarStyle(store.avatarStyleName);
    if (aborted) return;

    const zip = new JSZip();
    const used = new Set<string>();
    const kind = format.value;
    // The options object is deep-reactive. Nested arrays are proxies, and the
    // structuredClone inside Avatar refuses those.
    const baseOptions = clonePlain(store.avatarStyleOptionsWithoutDefaults);

    for (const seed of seeds.value) {
      if (aborted) return;

      if (kind === 'svg') {
        const svg = new Avatar(style, { ...baseOptions, seed }).toString();

        zip.file(safeName(seed, used, 'svg'), svg);
      } else {
        const svg = new Avatar(style, {
          ...baseOptions,
          size: DOWNLOAD_AVATAR_SIZE,
          seed,
        }).toString();

        zip.file(safeName(seed, used, kind), await rasterize(svg, kind));
      }

      progress.value = {
        done: progress.value.done + 1,
        total: seedCount.value,
      };
      if (progress.value.done % 25 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    if (aborted) return;

    triggerDownload(blob, `${cleanStyleName.value}-avatars.zip`);
    successState.value = true;
  } catch (err) {
    if (aborted) return;
    errorMessage.value = err instanceof Error ? err.message : String(err);
  } finally {
    isGenerating.value = false;
  }
}

const previewLabel = computed(() =>
  seedCount.value > PREVIEW_LIMIT
    ? `First ${PREVIEW_LIMIT} of ${seedCount.value}`
    : `${seedCount.value} avatar${seedCount.value === 1 ? '' : 's'}`,
);

// The confirmation belongs to the list it was downloaded for.
watch([seeds, format], () => (successState.value = false));
</script>

<template>
  <div class="pg-batch">
    <div class="pg-batch-source">
      <SiteSegmented
        v-model="mode"
        class="pg-batch-mode"
        :options="modeOptions"
        aria-label="Seed source"
        fluid
      />

      <template v-if="mode === 'random'">
        <SiteNumberField
          :model-value="randomCount"
          class="pg-batch-count"
          :min="1"
          :max="SEED_CAP"
          :step="1"
          suffix="seeds"
          show-buttons
          aria-label="Number of random seeds"
          @update:model-value="onRandomCount"
        />
        <button
          type="button"
          class="site-btn site-btn-secondary pg-batch-shuffle"
          aria-label="Regenerate random seeds"
          @click="shuffleRandom"
        >
          <Shuffle :size="16" aria-hidden="true" />
          Regenerate
        </button>
      </template>

      <span class="pg-batch-cap">up to {{ SEED_CAP }}</span>
    </div>

    <div v-if="mode === 'paste'" class="pg-batch-paste">
      <SiteTextarea
        id="pg-batch-seeds"
        v-model="seedsInput"
        :rows="6"
        mono
        :invalid="overCap"
        aria-label="Seeds, one per line"
        placeholder="One seed per line, for example a user ID"
        spellcheck="false"
        autocomplete="off"
        @keydown.enter="onTextareaEnter"
      />
      <span class="pg-batch-counter" :class="{ 'is-over': overCap }">
        {{ seedCount }} / {{ SEED_CAP }}
      </span>
      <p v-if="overCap" class="pg-batch-error" role="alert">
        That's more than the {{ SEED_CAP }}-seed cap. Trim the list and try
        again.
      </p>
    </div>

    <div v-if="previewItems.length > 0" class="pg-batch-preview">
      <span class="site-label">{{ previewLabel }}</span>
      <ul class="pg-batch-preview-grid">
        <li
          v-for="item in previewItems"
          :key="item.seed"
          class="pg-batch-tile"
          :title="item.seed"
        >
          <PlaygroundThumb
            class="pg-batch-tile-avatar"
            :style-name="store.avatarStyleName"
            :options="item.options"
          />
        </li>
      </ul>
    </div>

    <SiteNotice v-if="successState" tone="success" compact role="status">
      Your avatars will be downloaded. Please note the license below before
      using.
    </SiteNotice>

    <p v-if="errorMessage" class="pg-batch-error" role="alert">
      {{ errorMessage }}
    </p>

    <div class="pg-batch-foot">
      <SiteSegmented
        v-model="format"
        class="pg-batch-format"
        :options="formatOptions"
        aria-label="File format"
        fluid
      />
      <button
        type="button"
        class="site-btn site-btn-primary pg-batch-submit"
        :class="{ 'is-loading': isGenerating }"
        :disabled="!canGenerate"
        :aria-busy="isGenerating"
        @click="generate"
      >
        <Download :size="16" aria-hidden="true" />
        {{ generateLabel }}
      </button>
    </div>

    <UiLicenseAlert :style-name="store.avatarStyleName" />
  </div>
</template>

<style lang="scss" scoped>
.pg-batch {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px 28px 28px;

  @media (max-width: 640px) {
    padding: 16px 20px 20px;
  }

  &-source {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  & &-mode {
    width: 200px;
  }

  // Two classes, so the width outranks the default of the field.
  & &-count {
    width: 150px;
  }

  &-cap {
    margin-left: auto;
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
  }

  &-paste {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &-counter {
    align-self: flex-end;
    font-family: var(--db-font-mono);
    font-size: 12px;
    line-height: 16px;
    font-variant-numeric: tabular-nums;
    color: var(--db-muted);

    &.is-over {
      color: var(--db-danger);
    }
  }

  &-error {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--db-danger);
  }

  &-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;

      @media (max-width: 640px) {
        grid-template-columns: repeat(6, minmax(0, 1fr));
      }
    }
  }

  &-tile {
    min-width: 0;
    margin: 0;

    & &-avatar {
      width: 100%;
      border: 1px solid var(--db-line);
      border-radius: 10px;
    }
  }

  /* The format and the one button, behind a line. */
  &-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding-top: 18px;
    border-top: 1px solid var(--db-line);
  }

  & &-format {
    width: 320px;
    max-width: 100%;
  }

  &-submit {
    margin-left: auto;
    font-size: 15px;
  }
}
</style>
