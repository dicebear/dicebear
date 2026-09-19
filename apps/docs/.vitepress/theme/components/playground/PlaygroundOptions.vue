<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref, useId, watch } from 'vue';
import { styleUsesVariable } from '@theme/utils/avatar/style';
import {
  componentPreviewKey,
  navigateToColorKey,
} from '@theme/components/styles/styleOptionsKeys';
import { useStyleOptions } from '@theme/composables/useStyleOptions';
import {
  groupTagsByCategory,
  tokenCategory,
  toTagTokens,
} from '@theme/utils/avatar/tags';
import { capitalCase } from 'change-case';
import useStore from '@theme/stores/playground';
import { track, styleLabel } from '@theme/utils/track';
import { storeToRefs } from 'pinia';
import SiteDisclosure from '@theme/components/site/SiteDisclosure.vue';
import SiteTextField from '@theme/components/site/SiteTextField.vue';
import SiteNumberField from '@theme/components/site/SiteNumberField.vue';
import SiteSwitch from '@theme/components/site/SiteSwitch.vue';
import { Shuffle } from '@lucide/vue';
import PlaygroundAnimationSection from './PlaygroundAnimationSection.vue';
import PlaygroundAnimationNameSection from './PlaygroundAnimationNameSection.vue';
import { animationPlays, animationSwitch } from './animationState';
import PlaygroundComponentSection from './PlaygroundComponentSection.vue';
import PlaygroundTagsSection from './PlaygroundTagsSection.vue';
import PlaygroundColorSection from './PlaygroundColorSection.vue';
import PlaygroundTransformSection from './PlaygroundTransformSection.vue';
import PlaygroundFontSection from './PlaygroundFontSection.vue';
import PlaygroundStyleSelect from './PlaygroundStyleSelect.vue';
import PlaygroundPresetSelect from './PlaygroundPresetSelect.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

type ComponentInfo = {
  name: string;
  variants: string[];
  hasProbability: boolean;
  defaultProbability: number;
  hasNonDefaultWeights: boolean;
  defaultWeights: Record<string, number>;
};

type ColorInfo = {
  name: string;
  key: string;
  defaultValues: string[];
  hasFill: boolean;
  hasAngle: boolean;
  hasFillStops: boolean;
  hasOrder: boolean;
  contrastTo: string | null;
};

const seed = defineModel<string>('seed', { required: true });

const store = useStore();
const { avatarStyleName } = storeToRefs(store);

const { loadedStyle, descriptor, animationNames, styleColors, preview } =
  useStyleOptions(avatarStyleName);

provide(componentPreviewKey, preview);

// Set by the picker itself once it knows it has presets to show. The wrapper
// carries the heading, so it is hidden rather than unmounted: the picker has to
// stay mounted to answer the question in the first place.
const hasPresets = ref(false);

const hasFontFamily = computed(() =>
  loadedStyle.value
    ? styleUsesVariable(avatarStyleName.value, 'fontFamily')
    : false,
);

const hasFontWeight = computed(() =>
  loadedStyle.value
    ? styleUsesVariable(avatarStyleName.value, 'fontWeight')
    : false,
);

// OptionsDescriptor advertises the `animation` field exactly for styles that
// carry declarative animations, so the panel appears only where the toggle
// has an effect.
const hasAnimation = computed(() => 'animation' in descriptor.value);

// The card badge of one animation: the state the core resolves, and whether
// it comes from the animation's own switch (`own`) or from the global one.
function animationTag(name: string): string {
  const plays = animationPlays(store.avatarStyleOptions, name) ? 'on' : 'off';

  return animationSwitch(store.avatarStyleOptions, name) === undefined
    ? plays
    : `${plays} · own`;
}

// The `tags` filter only does something for styles whose variants carry tags;
// OptionsDescriptor advertises the `tags` field (with the style's own tag
// vocabulary) exactly in that case.
const styleTags = computed<string[]>(() => {
  const field = descriptor.value.tags;

  return field && 'values' in field ? [...field.values] : [];
});
const hasTags = computed(() => styleTags.value.length > 0);

const tagCategories = computed(() => groupTagsByCategory(styleTags.value));

// Number of set filter tokens per category, counting bare and per-value
// tokens in either polarity.
const tagCounts = computed(() => {
  const tokens = toTagTokens(store.avatarStyleOptions.tags);
  const counts = new Map<string, number>();

  for (const token of tokens) {
    const category = tokenCategory(token);

    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return counts;
});

const components = computed(() => {
  const result: ComponentInfo[] = [];
  const style = loadedStyle.value;

  // OptionsDescriptor already filters out alias components, so every
  // `*Variant` enum here is guaranteed to be a non-alias source.
  for (const [key, field] of Object.entries(descriptor.value)) {
    if (!key.endsWith('Variant') || field.type !== 'enum' || !field.weighted) {
      continue;
    }

    const name = key.replace(/Variant$/, '');
    const comp = style?.components().get(name);
    const variantNames = (field.values as string[]) ?? [];
    const defaultWeights = comp
      ? Object.fromEntries(
          [...comp.variants()].map(([n, v]) => [n, v.weight()]),
        )
      : {};
    const hasNonDefaultWeights = Object.values(defaultWeights).some(
      (w) => w !== 1,
    );

    result.push({
      name,
      variants: variantNames,
      hasProbability: `${name}Probability` in descriptor.value,
      defaultProbability: comp?.probability() ?? 100,
      hasNonDefaultWeights,
      defaultWeights,
    });
  }

  result.sort((a, b) => a.name.localeCompare(b.name));

  return result;
});

const allColors = computed(() => {
  const result: ColorInfo[] = [];

  for (const [key, field] of Object.entries(descriptor.value)) {
    if (field.type !== 'color' || !key.endsWith('Color')) {
      continue;
    }

    if (
      key.endsWith('ColorFill') ||
      key.endsWith('ColorAngle') ||
      key.endsWith('ColorFillStops')
    ) {
      continue;
    }

    const name = key.replace(/Color$/, '');

    result.push({
      name,
      key,
      defaultValues: styleColors.value[name] ?? [],
      hasFill: `${key}Fill` in descriptor.value,
      hasAngle: `${key}Angle` in descriptor.value,
      hasFillStops: `${key}FillStops` in descriptor.value,
      hasOrder: `${key}Order` in descriptor.value,
      contrastTo:
        field.type === 'color' && typeof field.contrastTo === 'string'
          ? field.contrastTo
          : null,
    });
  }

  return result;
});

const sortedColors = computed(() => {
  const bg = allColors.value.filter((c) => c.name === 'background');
  const rest = allColors.value.filter((c) => c.name !== 'background');

  rest.sort((a, b) => a.name.localeCompare(b.name));

  return [...bg, ...rest];
});

const root = ref<HTMLElement>();

// The groups of the column. All of them start closed, so the column opens as
// a list of what a style offers. The seed sits above them and has no group of
// its own, because it is the one field everybody needs.
const openSections = reactive({
  transform: false,
  components: false,
  colors: false,
  animations: false,
  font: false,
  tags: false,
  output: false,
});

// Any number of color rows can be open. The list lives here so that a linked
// color can open the row it points to.
const openColorPanels = ref<string[]>([]);
watch(avatarStyleName, () => {
  openColorPanels.value = [];
});

function setColorPanel(key: string, open: boolean) {
  const rest = openColorPanels.value.filter((k) => k !== key);

  openColorPanels.value = open ? [...rest, key] : rest;
}

async function navigateToColor(colorName: string) {
  const targetKey = `${colorName}Color`;

  openSections.colors = true;
  setColorPanel(targetKey, true);

  await nextTick();

  const row = [
    ...(root.value?.querySelectorAll<HTMLElement>('[data-color-key]') ?? []),
  ].find((el) => el.dataset.colorKey === targetKey);
  const summary = row?.querySelector('summary');

  if (summary) {
    summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    summary.focus({ preventScroll: true });
  }
}

provide(navigateToColorKey, navigateToColor);

function activeCount(comp: ComponentInfo): number {
  const val = store.avatarStyleOptions[`${comp.name}Variant`];

  if (val === undefined) return comp.variants.length;
  if (Array.isArray(val)) return val.length;
  if (typeof val === 'object')
    return Object.values(val as Record<string, number>).filter((w) => w > 0)
      .length;
  if (typeof val === 'string') return 1;

  return comp.variants.length;
}

function selectedColors(color: ColorInfo): string[] {
  const val = store.avatarStyleOptions[color.key];

  return Array.isArray(val) ? (val as string[]) : color.defaultValues;
}

// Selected colors against the colors of the style. A style without colors of
// its own shows the plain number.
function colorCount(color: ColorInfo): string {
  const selected = selectedColors(color).length;
  const total = color.defaultValues.length;

  if (total > 0) return `${selected}/${total}`;

  return selected > 0 ? String(selected) : 'none';
}

const componentTotal = computed(() => {
  const active = components.value.reduce((n, c) => n + activeCount(c), 0);
  const all = components.value.reduce((n, c) => n + c.variants.length, 0);

  return `${active}/${all}`;
});

const colorTotal = computed(() => {
  const n = sortedColors.value.reduce(
    (sum, color) => sum + selectedColors(color).length,
    0,
  );

  return `${n} ${n === 1 ? 'color' : 'colors'}`;
});

const animationTotal = computed(() => {
  const n = animationNames.value.length;

  return `${n} ${n === 1 ? 'animation' : 'animations'}`;
});

function randomizeSeed() {
  seed.value = Math.random().toString(36).substring(2, 10);

  track('Playground: Seed Randomized', {
    style: styleLabel(avatarStyleName.value),
  });
}

const sizeKey = 'size';
const titleKey = 'title';
const idRandomizationKey = 'idRandomization';

const size = computed({
  get: () => {
    const val = store.avatarStyleOptions[sizeKey];

    return typeof val === 'number' ? val : null;
  },
  set: (val: number | null) => {
    if (val === null || Number.isNaN(val)) {
      delete store.avatarStyleOptions[sizeKey];
    } else {
      store.avatarStyleOptions[sizeKey] = val;
    }
  },
});

const title = computed({
  get: () => {
    const val = store.avatarStyleOptions[titleKey];

    return typeof val === 'string' ? val : '';
  },
  set: (val: string) => {
    if (val === '') {
      delete store.avatarStyleOptions[titleKey];
    } else {
      store.avatarStyleOptions[titleKey] = val;
    }
  },
});

const idRandomization = computed({
  get: () => store.avatarStyleOptions[idRandomizationKey] === true,
  set: (val: boolean) => {
    if (val) {
      store.avatarStyleOptions[idRandomizationKey] = true;
    } else {
      delete store.avatarStyleOptions[idRandomizationKey];
    }
  },
});

const idRandomizationId = useId();

const onSeedFocus = (e: FocusEvent) => {
  const input = e.target as HTMLInputElement;

  requestAnimationFrame(() => {
    input.setSelectionRange(0, input.value.length);
  });
};
</script>

<template>
  <div ref="root" class="pg-options">
    <div class="pg-options-pickers">
      <div class="pg-options-picker">
        <span class="site-label">Avatar style</span>
        <PlaygroundStyleSelect />
      </div>

      <div v-show="hasPresets" class="pg-options-picker">
        <span class="site-label">Preset</span>
        <PlaygroundPresetSelect v-model:ready="hasPresets" />
      </div>
    </div>

    <div class="pg-options-sections">
      <section class="pg-options-seed-group">
        <h2 class="pg-options-seed-title">Seed</h2>
        <div class="pg-options-body">
          <SiteTextField
            v-model="seed"
            size="lg"
            fluid
            placeholder="Enter a seed"
            aria-label="Seed"
            class="pg-options-seed"
            @focus="onSeedFocus"
          >
            <template #action>
              <button
                type="button"
                aria-label="Random seed"
                data-tip="Random seed"
                @click="randomizeSeed"
              >
                <Shuffle :size="16" aria-hidden="true" />
              </button>
            </template>
          </SiteTextField>
          <p class="pg-help">
            The seed is the starting value used to generate the avatar.
            <strong>The same seed always produces the same avatar</strong>, so
            you can reuse it whenever you need the exact same result. For
            privacy, prefer an opaque identifier such as a random string or
            hashed user ID instead of personal data like names or email
            addresses.
          </p>
        </div>
      </section>

      <SiteDisclosure
        v-model:open="openSections.transform"
        title="Transform"
        size="section"
      >
        <div class="pg-options-body">
          <PlaygroundTransformSection :key="avatarStyleName" />
        </div>
      </SiteDisclosure>

      <SiteDisclosure
        v-if="components.length > 0"
        v-model:open="openSections.components"
        title="Components"
        size="section"
      >
        <template #summary>{{ componentTotal }}</template>
        <SiteDisclosure
          v-for="comp in components"
          :key="`${avatarStyleName}-${comp.name}`"
          :title="capitalCase(comp.name)"
          lazy
        >
          <template #summary>
            {{ activeCount(comp) }}/{{ comp.variants.length }}
          </template>
          <PlaygroundComponentSection
            :component-name="comp.name"
            :variants="comp.variants"
            :has-probability="comp.hasProbability"
            :default-probability="comp.defaultProbability"
            :has-non-default-weights="comp.hasNonDefaultWeights"
            :default-weights="comp.defaultWeights"
          />
        </SiteDisclosure>
      </SiteDisclosure>

      <SiteDisclosure
        v-if="allColors.length > 0"
        v-model:open="openSections.colors"
        title="Colors"
        size="section"
      >
        <template #summary>{{ colorTotal }}</template>
        <SiteDisclosure
          v-for="color in sortedColors"
          :key="`${avatarStyleName}-${color.key}`"
          :open="openColorPanels.includes(color.key)"
          :title="capitalCase(color.name)"
          :data-color-key="color.key"
          lazy
          @update:open="setColorPanel(color.key, $event)"
        >
          <template #summary>
            <span class="pg-options-dots" aria-hidden="true">
              <span
                v-for="(hex, i) in selectedColors(color).slice(0, 6)"
                :key="i"
                class="pg-options-dot"
                :style="{ background: `#${hex}` }"
              ></span>
            </span>
            {{ colorCount(color) }}
          </template>
          <PlaygroundColorSection
            :color-name="color.name"
            :default-values="color.defaultValues"
            :has-fill="color.hasFill"
            :has-angle="color.hasAngle"
            :has-fill-stops="color.hasFillStops"
            :has-order="color.hasOrder"
            :contrast-to="color.contrastTo"
          />
        </SiteDisclosure>
      </SiteDisclosure>

      <SiteDisclosure
        v-if="hasAnimation"
        v-model:open="openSections.animations"
        title="Animations"
        size="section"
      >
        <template v-if="animationNames.length > 0" #summary>
          {{ animationTotal }}
        </template>
        <p v-if="animationNames.length > 0" class="pg-help pg-options-intro">
          The first card switches every animation. Each animation below follows
          it unless it has a switch of its own, which then wins, as do its own
          speed and delay.
        </p>
        <SiteDisclosure title="All animations">
          <template #summary>
            <span
              class="site-chip pg-options-state"
              :class="
                store.avatarStyleOptions.animation === true
                  ? 'site-chip-brand'
                  : 'site-chip-muted'
              "
            >
              {{ store.avatarStyleOptions.animation === true ? 'on' : 'off' }}
            </span>
          </template>
          <PlaygroundAnimationSection
            :key="avatarStyleName"
            :names="animationNames"
          />
        </SiteDisclosure>
        <SiteDisclosure
          v-for="name in animationNames"
          :key="`${avatarStyleName}-${name}`"
          :title="capitalCase(name)"
        >
          <template #summary>
            <span
              class="site-chip pg-options-state"
              :class="
                animationSwitch(store.avatarStyleOptions, name) === undefined
                  ? 'site-chip-muted'
                  : 'site-chip-brand'
              "
            >
              {{ animationTag(name) }}
            </span>
          </template>
          <PlaygroundAnimationNameSection :name="name" />
        </SiteDisclosure>
      </SiteDisclosure>

      <SiteDisclosure
        v-if="hasFontFamily || hasFontWeight"
        v-model:open="openSections.font"
        title="Font"
        size="section"
      >
        <div class="pg-options-body">
          <PlaygroundFontSection
            :key="avatarStyleName"
            :has-font-family="hasFontFamily"
            :has-font-weight="hasFontWeight"
          />
        </div>
      </SiteDisclosure>

      <SiteDisclosure
        v-if="hasTags"
        v-model:open="openSections.tags"
        title="Tags"
        size="section"
      >
        <p class="pg-help pg-options-intro">
          Allow keeps only matching variants, disallow drops them. Allowing a
          whole category requires it, which turns an opt-in feature like the
          animation on. Components with a variant chosen manually ignore the
          filter.
        </p>
        <SiteDisclosure
          v-for="group in tagCategories"
          :key="`${avatarStyleName}-${group.category}`"
          :title="group.label"
        >
          <template #summary>
            {{ tagCounts.get(group.category) ?? 0 }}
          </template>
          <PlaygroundTagsSection :category="group" />
        </SiteDisclosure>
      </SiteDisclosure>

      <SiteDisclosure
        v-model:open="openSections.output"
        title="Output"
        size="section"
      >
        <div class="pg-options-body">
          <div class="pg-options-pair">
            <div class="pg-field">
              <div class="pg-field-label">
                <span>Size</span>
                <span class="pg-field-tools">
                  <PlaygroundFieldReset
                    v-if="store.isOptionSet(sizeKey)"
                    @click="store.resetOption(sizeKey)"
                  />
                </span>
              </div>
              <SiteNumberField
                v-model="size"
                :min="1"
                :max="4096"
                :step="1"
                placeholder="Auto"
                suffix="px"
                show-buttons
                fluid
                aria-label="Size"
              />
              <p class="pg-help">
                Output size in pixels. If left empty, the avatar scales to 100%
                of its container.
              </p>
            </div>

            <div class="pg-field">
              <div class="pg-field-label">
                <span>Title</span>
                <span class="pg-field-tools">
                  <PlaygroundFieldReset
                    v-if="store.isOptionSet(titleKey)"
                    @click="store.resetOption(titleKey)"
                  />
                </span>
              </div>
              <SiteTextField
                v-model="title"
                fluid
                placeholder="Accessible title"
                aria-label="Title"
              />
              <p class="pg-help">
                Accessible <code>&lt;title&gt;</code> element rendered inside
                the SVG. Useful for screen readers.
              </p>
            </div>
          </div>

          <div class="pg-field">
            <div class="pg-field-label">
              <label :for="idRandomizationId">Randomize element IDs</label>
              <span class="pg-field-tools">
                <PlaygroundFieldReset
                  v-if="store.isOptionSet(idRandomizationKey)"
                  @click="store.resetOption(idRandomizationKey)"
                />
                <SiteSwitch :id="idRandomizationId" v-model="idRandomization" />
              </span>
            </div>
            <p class="pg-help">
              Randomizes all SVG element IDs to avoid conflicts when embedding
              multiple avatars in the same page.
            </p>
          </div>

          <p class="pg-help">
            <strong>Title</strong> and
            <strong>Randomize element IDs</strong>
            are not supported by our public
            <a href="/integrations/http-api/">HTTP-API</a>. You can enable them
            by
            <a href="/recipes/self-host-the-http-api/"
              >hosting your own instance</a
            >.
          </p>
        </div>
      </SiteDisclosure>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* The sections answer to the width of the column, not of the page, so they
   fold the same way on a phone and in a narrow desktop column. */
.pg-options {
  container: pg-options / inline-size;
  min-width: 0;
}

.pg-options-pickers {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 12px;
}

.pg-options-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.pg-options-sections {
  margin-top: 24px;
  border-bottom: 1px solid var(--db-line);
}

/* The seed carries the heading of a group without being collapsible. */
.pg-options-seed-group {
  border-top: 1px solid var(--db-line);
  padding-bottom: 20px;
}

.pg-options-seed-title {
  padding: 20px 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--db-ink);
}

/* Content of a group that holds fields instead of rows. */
.pg-options-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 4px 8px;
}

.pg-options-intro {
  padding: 0 4px 16px;
}

.pg-options-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.pg-options-dots {
  display: flex;
  gap: 4px;
  margin-right: 12px;
}

.pg-options-dot {
  display: block;
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 1px solid var(--db-line);
  border-radius: 50%;
}

/* The row summary is set in mono for counts. A state chip keeps the text font. */
.pg-options-state {
  font-family: var(--db-font);
}

/* The randomize button sits at the right edge of the column, so its tooltip
   grows to the left. */
.pg-options-seed :deep([data-tip]:hover::after),
.pg-options-seed :deep([data-tip]:focus-visible::after) {
  right: 0;
  left: auto;
  transform: none;
}

@container pg-options (max-width: 520px) {
  .pg-options-pickers {
    grid-auto-flow: row;
    gap: 16px;
  }

  .pg-options-pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
