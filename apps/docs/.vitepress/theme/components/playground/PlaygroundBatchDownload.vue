<script setup lang="ts">
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

const SEED_CAP = 500;
const PREVIEW_LIMIT = 12;

type Mode = 'paste' | 'random';

const store = useStore();

const mode = ref<Mode>('random');
const modeOptions: { label: string; value: Mode }[] = [
  { label: 'Random', value: 'random' },
  { label: 'Paste', value: 'paste' },
];
const seedsInput = ref('');
const randomCount = ref(12);
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
  return `Download ${seedCount.value} SVG${seedCount.value === 1 ? '' : 's'} as ZIP`;
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

function safeName(seed: string, used: Set<string>): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = seed.replace(/[/\\:*?"<>|\x00-\x1f]/g, '-').slice(0, 200);
  const base = cleaned || 'avatar';
  let name = `${base}.svg`;
  let i = 2;
  while (used.has(name)) name = `${base}-${i++}.svg`;
  used.add(name);
  return name;
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
    // The options object is deep-reactive. Nested arrays are proxies, and the
    // structuredClone inside Avatar refuses those.
    const baseOptions = clonePlain(store.avatarStyleOptionsWithoutDefaults);

    for (const seed of seeds.value) {
      if (aborted) return;
      const svg = new Avatar(style, { ...baseOptions, seed }).toString();
      zip.file(safeName(seed, used), svg);
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
    : `All ${seedCount.value} avatar${seedCount.value === 1 ? '' : 's'}`,
);

// The confirmation belongs to the list it was downloaded for.
watch(seeds, () => (successState.value = false));
</script>

<template>
  <div class="pg-batch">
    <SiteSegmented
      v-model="mode"
      class="pg-batch-mode"
      :options="modeOptions"
      aria-label="Seed source"
      size="sm"
      fluid
    />

    <div v-if="mode === 'random'" class="pg-batch-random">
      <SiteNumberField
        :model-value="randomCount"
        class="pg-batch-count"
        :min="1"
        :max="SEED_CAP"
        :step="1"
        aria-label="Number of random seeds"
        @update:model-value="onRandomCount"
      />
      <span class="pg-batch-random-suffix">
        random seed{{ randomCount === 1 ? '' : 's' }}
      </span>
      <button
        type="button"
        class="site-btn site-btn-secondary pg-batch-shuffle"
        aria-label="Regenerate random seeds"
        @click="shuffleRandom"
      >
        <Shuffle :size="16" aria-hidden="true" />
        Shuffle
      </button>
    </div>

    <div v-else class="pg-batch-paste">
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
        <li v-for="item in previewItems" :key="item.seed" class="pg-batch-tile">
          <PlaygroundThumb
            class="pg-batch-tile-avatar"
            :style-name="store.avatarStyleName"
            :options="item.options"
          />
          <code class="pg-batch-tile-seed">{{ item.seed }}</code>
        </li>
      </ul>
    </div>

    <SiteNotice v-if="successState" tone="success" compact role="status">
      Your avatars will be downloaded. Please note the license below before
      using.
    </SiteNotice>

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

    <p v-if="errorMessage" class="pg-batch-error" role="alert">
      {{ errorMessage }}
    </p>

    <UiLicenseAlert :style-name="store.avatarStyleName" />
  </div>
</template>

<style lang="scss" scoped>
.pg-batch {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 28px 28px;

  @media (max-width: 640px) {
    padding: 16px 20px 20px;
  }

  &-mode {
    max-width: 320px;
  }

  &-random {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    &-suffix {
      font-size: 15px;
      line-height: 24px;
      color: var(--db-ink-2);
    }
  }

  // Two classes, so the width outranks the default of the field.
  & &-count {
    width: 110px;
  }

  &-shuffle {
    height: 44px;
    margin-left: auto;
    padding: 0 18px;
    border-radius: var(--db-radius-3);
    font-size: 15px;
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
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;

      @media (max-width: 640px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  }

  &-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 0;
    margin: 0;

    & &-avatar {
      width: 64px;
      border: 1px solid var(--db-line);
      border-radius: var(--db-radius-3);
    }

    &-seed {
      max-width: 100%;
      padding: 0;
      background: transparent;
      font-family: var(--db-font-mono);
      font-size: 11px;
      line-height: 16px;
      color: var(--db-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-submit {
    width: 100%;
    font-size: 15px;
  }
}
</style>
