<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import Textarea from 'primevue/textarea';
import { Download, Shuffle } from '@lucide/vue';
import JSZip from 'jszip';
import { Avatar } from '@dicebear/core';
import { UiAvatar, UiConfetti, UiLicenseAlert } from '@theme/components/ui';
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

const previewStyleOptions = computed(() => ({
  ...store.avatarStyleOptionsWithoutDefaults,
}));

// Some ancestor (likely VitePress local search or a PrimeVue listener) is
// suppressing the default Enter newline in capture phase. Manually insert
// the newline so the textarea behaves normally regardless of who calls
// preventDefault upstream.
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
    // The options object is deep-reactive; nested arrays are proxies, and the
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

function reset() {
  successState.value = false;
  errorMessage.value = '';
  progress.value = { done: 0, total: 0 };
}
</script>

<template>
  <div class="pg-batch">
    <template v-if="!successState">
      <header class="pg-batch-top">
        <SelectButton
          v-model="mode"
          :options="modeOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          size="small"
          aria-label="Seed source"
        />
      </header>

      <section class="pg-batch-section">
        <div v-if="mode === 'random'" class="pg-batch-random">
          <InputNumber
            v-model="randomCount"
            :min="1"
            :max="SEED_CAP"
            :step="1"
            :show-buttons="true"
            button-layout="horizontal"
            :input-style="{ width: '5em', textAlign: 'center' }"
            decrement-button-class="pg-batch-step-button"
            increment-button-class="pg-batch-step-button"
            aria-label="Number of random seeds"
          >
            <template #incrementicon>+</template>
            <template #decrementicon>−</template>
          </InputNumber>
          <span class="pg-batch-random-suffix">
            random seed{{ randomCount === 1 ? '' : 's' }}
          </span>
          <button
            type="button"
            class="pg-batch-shuffle"
            @click="shuffleRandom"
            aria-label="Regenerate random seeds"
          >
            <Shuffle :size="14" />
            <span>Shuffle</span>
          </button>
        </div>

        <div v-else class="pg-batch-paste">
          <Textarea
            id="pg-batch-seeds"
            v-model="seedsInput"
            :rows="6"
            placeholder="One seed per line — a username, email, user ID, anything."
            class="pg-batch-textarea"
            spellcheck="false"
            autocomplete="off"
            fluid
            @keydown.enter="onTextareaEnter"
          />
          <span class="pg-batch-counter" :class="{ 'is-over': overCap }">
            {{ seedCount }} / {{ SEED_CAP }}
          </span>
        </div>

        <p v-if="overCap" class="pg-batch-hint is-error">
          That's more than the {{ SEED_CAP }}-seed cap. Trim the list and try
          again.
        </p>
      </section>

      <section
        v-if="previewSeeds.length > 0"
        class="pg-batch-section pg-batch-preview-section"
      >
        <header class="pg-batch-section-header">
          <span class="pg-batch-eyebrow">Preview</span>
          <span class="pg-batch-preview-count">
            <span v-if="seedCount > PREVIEW_LIMIT">
              first {{ previewSeeds.length }} of {{ seedCount }}
            </span>
            <span v-else>
              all {{ seedCount }} avatar{{ seedCount === 1 ? '' : 's' }}
            </span>
          </span>
        </header>

        <ul class="pg-batch-preview-grid">
          <li
            v-for="seed in previewSeeds"
            :key="seed"
            class="pg-batch-preview-tile"
          >
            <div class="pg-batch-preview-tile-avatar">
              <UiAvatar
                :size="64"
                :style-name="store.avatarStyleName"
                :style-options="{ ...previewStyleOptions, seed }"
                mode="library"
              />
            </div>
            <code class="pg-batch-preview-tile-seed">{{ seed }}</code>
          </li>
        </ul>
      </section>

      <footer class="pg-batch-footer">
        <Button
          :label="generateLabel"
          :disabled="!canGenerate"
          :loading="isGenerating"
          severity="contrast"
          @click="generate"
        >
          <template #icon><Download :size="16" /></template>
        </Button>
        <p v-if="errorMessage" class="pg-batch-hint is-error">
          {{ errorMessage }}
        </p>
      </footer>
    </template>

    <template v-else>
      <div class="pg-batch-success">
        <UiConfetti />
        <div class="dialog-title">Your avatars will be downloaded! 🎉</div>
        <div class="dialog-subtitle">
          Please note the license below before using.
        </div>
        <div class="dialog-text">
          <UiLicenseAlert :style-name="store.avatarStyleName" />
        </div>
        <div class="pg-batch-success-actions">
          <Button
            label="Download another batch"
            severity="secondary"
            variant="outlined"
            @click="reset"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.pg-batch {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-batch-top {
  display: flex;
  justify-content: flex-start;
}

.pg-batch-section {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
}

.pg-batch-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--ui-c-text-subtle);
}

.pg-batch-random {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.pg-batch-random-suffix {
  font-size: 14px;
  color: var(--ui-c-text-muted);
}

.pg-batch-shuffle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 8px 14px;
  background: transparent;
  border: 1px dashed var(--vp-c-border);
  border-radius: var(--vp-radius-xs);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ui-c-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);

  &:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    border-style: solid;
  }

  &:active svg {
    transform: rotate(-20deg);
  }

  svg {
    transition: transform var(--duration-fast) var(--ease-smooth);
  }
}

.pg-batch-paste {
  display: flex;
  flex-direction: column;
}

.pg-batch-textarea {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.55;
  min-height: 160px;
  resize: vertical;
}

.pg-batch-counter {
  align-self: flex-end;
  margin-top: 6px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-c-text-subtle);

  &.is-over {
    color: var(--vp-c-danger-1, #dc2626);
    font-weight: 600;
  }
}

.pg-batch-hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ui-c-text-subtle);

  &.is-error {
    color: var(--vp-c-danger-1, #dc2626);
  }
}

.pg-batch-preview-section {
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.pg-batch-preview-count {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-c-text-muted);
}

.pg-batch-preview-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 10px;
}

.pg-batch-preview-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px 8px;
  margin: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-radius-sm);

  &-avatar {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      linear-gradient(45deg, var(--vp-c-bg-soft) 25%, transparent 25%) 0 0 / 8px
        8px,
      linear-gradient(-45deg, var(--vp-c-bg-soft) 25%, transparent 25%) 0 0 /
        8px 8px,
      var(--vp-c-bg);
    border-radius: var(--vp-radius-xs);
    overflow: hidden;
  }

  &-seed {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--vp-font-family-mono);
    font-size: 10px;
    color: var(--ui-c-text-muted);
    padding: 0;
    background: transparent;
  }
}

.pg-batch-footer {
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 10px;

  :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}

.pg-batch-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.pg-batch-success-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}
</style>

<style lang="scss">
html.dark {
  .pg-batch-step-button {
    background: var(--p-form-field-background);
  }
}
</style>
