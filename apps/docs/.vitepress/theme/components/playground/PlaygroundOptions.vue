<script setup lang="ts">
import { computed, nextTick, provide, ref, watch } from 'vue';
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
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
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

const { loadedStyle, descriptor, styleColors, preview } =
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

// Every animation name comes with a `${name}Animation` switch field.
const animationNames = computed<string[]>(() =>
  Object.keys(descriptor.value)
    .filter((key) => key !== 'animation' && key.endsWith('Animation'))
    .map((key) => key.slice(0, -'Animation'.length)),
);

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

const openColorPanels = ref<string[]>([]);
watch(avatarStyleName, () => {
  openColorPanels.value = [];
});

async function navigateToColor(colorName: string) {
  const targetKey = `${colorName}Color`;

  if (!openColorPanels.value.includes(targetKey)) {
    openColorPanels.value = [...openColorPanels.value, targetKey];
  }

  await nextTick();

  const header = document.querySelector(
    `[id$="_accordionheader_${targetKey}"]`,
  );

  if (header instanceof HTMLElement) {
    header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    header.focus({ preventScroll: true });
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

function colorCount(color: ColorInfo): number {
  const val = store.avatarStyleOptions[color.key];

  if (Array.isArray(val)) return val.length;

  return color.defaultValues.length;
}

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

const onSeedFocus = (e: FocusEvent) => {
  const input = e.target as HTMLInputElement;

  requestAnimationFrame(() => {
    input.setSelectionRange(0, input.value.length);
  });
};
</script>

<template>
  <div class="pg-options">
    <div class="pg-options-group">
      <h3 class="pg-options-group-title">Avatar Style</h3>
      <PlaygroundStyleSelect />
    </div>

    <div v-show="hasPresets" class="pg-options-group">
      <h3 class="pg-options-group-title">Preset</h3>
      <PlaygroundPresetSelect v-model:ready="hasPresets" />
    </div>

    <div class="pg-options-group">
      <h3 class="pg-options-group-title">General</h3>
      <Accordion
        :multiple="true"
        :value="['__seed']"
        class="pg-options-accordion"
      >
        <AccordionPanel value="__seed">
          <AccordionHeader>
            <span class="pg-options-label">Seed</span>
          </AccordionHeader>
          <AccordionContent>
            <div class="pg-options-seed-row">
              <InputText
                v-model="seed"
                placeholder="Enter a seed"
                class="pg-options-seed"
                @focus="onSeedFocus"
              />
              <Button
                severity="secondary"
                variant="outlined"
                v-tooltip="'Random seed'"
                @click="randomizeSeed"
              >
                <Shuffle :size="16" />
              </Button>
            </div>
            <p class="pg-help">
              The seed is the starting value used to generate the avatar.
              <strong>The same seed always produces the same avatar</strong>, so
              you can reuse it whenever you need the exact same result. For
              privacy, prefer an opaque identifier such as a random string or
              hashed user ID instead of personal data like names or email
              addresses.
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel v-if="hasFontFamily || hasFontWeight" value="__font">
          <AccordionHeader>
            <span class="pg-options-label">Font</span>
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundFontSection
              :key="avatarStyleName"
              :has-font-family="hasFontFamily"
              :has-font-weight="hasFontWeight"
            />
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="__transform">
          <AccordionHeader>
            <span class="pg-options-label">Transform</span>
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundTransformSection :key="avatarStyleName" />
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="__output">
          <AccordionHeader>
            <span class="pg-options-label">Output</span>
          </AccordionHeader>
          <AccordionContent>
            <div class="pg-options-output">
              <div class="pg-field">
                <div class="pg-field-label">
                  <span>Size</span>
                  <PlaygroundFieldReset
                    v-if="store.isOptionSet(sizeKey)"
                    @click="store.resetOption(sizeKey)"
                  />
                </div>
                <InputNumber
                  v-model="size"
                  :min="1"
                  :max="4096"
                  :step="1"
                  :use-grouping="false"
                  placeholder="Auto"
                  suffix=" px"
                  show-buttons
                  button-layout="horizontal"
                  :input-style="{ width: '6em', textAlign: 'center' }"
                >
                  <template #incrementicon>+</template>
                  <template #decrementicon>−</template>
                </InputNumber>
                <p class="pg-options-field-help">
                  Output size in pixels. If left empty, the avatar scales to
                  100% of its container.
                </p>
              </div>

              <div class="pg-field">
                <div class="pg-field-label">
                  <span>Title</span>
                  <PlaygroundFieldReset
                    v-if="store.isOptionSet(titleKey)"
                    @click="store.resetOption(titleKey)"
                  />
                </div>
                <InputText
                  v-model="title"
                  placeholder="Accessible title"
                  class="pg-options-input"
                />
                <p class="pg-options-field-help">
                  Accessible <code>&lt;title&gt;</code> element rendered inside
                  the SVG. Useful for screen readers.
                </p>
              </div>

              <div class="pg-field">
                <div class="pg-field-label pg-options-toggle-row">
                  <ToggleSwitch v-model="idRandomization" />
                  <span>Randomize element IDs</span>
                  <PlaygroundFieldReset
                    v-if="store.isOptionSet(idRandomizationKey)"
                    @click="store.resetOption(idRandomizationKey)"
                  />
                </div>
                <p class="pg-options-field-help">
                  Randomizes all SVG element IDs to avoid conflicts when
                  embedding multiple avatars in the same page.
                </p>
              </div>

              <p class="pg-options-field-help pg-options-field-help-warn">
                <strong>Title</strong> and
                <strong>Randomize element IDs</strong>
                are not supported by our public
                <a href="/integrations/http-api/">HTTP-API</a>. You can enable
                them by
                <a href="/recipes/self-host-the-http-api/"
                  >hosting your own instance</a
                >.
              </p>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="pg-options-group" v-if="hasTags">
      <h3 class="pg-options-group-title">Tags</h3>
      <p class="pg-help">
        Allow keeps only matching variants, disallow drops them. Allowing a
        whole category requires it, which turns an opt-in feature like the
        animation on. Components with a variant chosen manually ignore the
        filter.
      </p>
      <Accordion :multiple="true" class="pg-options-accordion">
        <AccordionPanel
          v-for="group in tagCategories"
          :key="`${avatarStyleName}-${group.category}`"
          :value="group.category"
        >
          <AccordionHeader>
            <span class="pg-options-label">{{ group.label }}</span>
            <Tag
              :value="`${tagCounts.get(group.category) ?? 0}`"
              severity="secondary"
              class="pg-options-tag"
            />
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundTagsSection
              :key="`${avatarStyleName}-${group.category}`"
              :category="group"
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="pg-options-group" v-if="components.length > 0">
      <h3 class="pg-options-group-title">Components</h3>
      <Accordion :multiple="true" class="pg-options-accordion">
        <AccordionPanel
          v-for="comp in components"
          :key="`${avatarStyleName}-${comp.name}`"
          :value="comp.name"
        >
          <AccordionHeader>
            <span class="pg-options-label">{{ capitalCase(comp.name) }}</span>
            <Tag
              :value="`${activeCount(comp)}/${comp.variants.length}`"
              severity="secondary"
              class="pg-options-tag"
            />
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundComponentSection
              :key="`${avatarStyleName}-${comp.name}`"
              :component-name="comp.name"
              :variants="comp.variants"
              :has-probability="comp.hasProbability"
              :default-probability="comp.defaultProbability"
              :has-non-default-weights="comp.hasNonDefaultWeights"
              :default-weights="comp.defaultWeights"
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="pg-options-group" v-if="allColors.length > 0">
      <h3 class="pg-options-group-title">Colors</h3>
      <Accordion
        v-model:value="openColorPanels"
        :multiple="true"
        class="pg-options-accordion"
      >
        <AccordionPanel
          v-for="color in sortedColors"
          :key="`${avatarStyleName}-${color.key}`"
          :value="color.key"
        >
          <AccordionHeader>
            <span class="pg-options-label">{{ capitalCase(color.name) }}</span>
            <Tag
              :value="String(colorCount(color))"
              severity="secondary"
              class="pg-options-tag"
            />
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundColorSection
              :key="`${avatarStyleName}-${color.key}`"
              :color-name="color.name"
              :default-values="color.defaultValues"
              :has-fill="color.hasFill"
              :has-angle="color.hasAngle"
              :has-fill-stops="color.hasFillStops"
              :has-order="color.hasOrder"
              :contrast-to="color.contrastTo"
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="pg-options-group" v-if="hasAnimation">
      <h3 class="pg-options-group-title">Animations</h3>
      <p v-if="animationNames.length > 0" class="pg-help">
        The first card switches every animation. Each animation below follows it
        unless it has a switch of its own, which then wins, as do its own speed
        and delay.
      </p>
      <Accordion :multiple="true" class="pg-options-accordion">
        <AccordionPanel :value="'__animation'">
          <AccordionHeader>
            <span class="pg-options-label">All animations</span>
            <Tag
              :value="
                store.avatarStyleOptions.animation === true ? 'on' : 'off'
              "
              :severity="
                store.avatarStyleOptions.animation === true
                  ? 'primary'
                  : 'secondary'
              "
              class="pg-options-tag"
            />
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundAnimationSection
              :key="avatarStyleName"
              :names="animationNames"
            />
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel
          v-for="name in animationNames"
          :key="`${avatarStyleName}-${name}`"
          :value="`__animation-${name}`"
        >
          <AccordionHeader>
            <span class="pg-options-label">{{ capitalCase(name) }}</span>
            <Tag
              :value="animationTag(name)"
              :severity="
                animationSwitch(store.avatarStyleOptions, name) === undefined
                  ? 'secondary'
                  : 'primary'
              "
              class="pg-options-tag"
            />
          </AccordionHeader>
          <AccordionContent>
            <PlaygroundAnimationNameSection
              :key="`${avatarStyleName}-${name}`"
              :name="name"
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pg-options-group {
  /* A help paragraph between the group title and its cards (e.g. the tags
     filter intro) needs its own spacing toward the card below. */
  > .pg-help {
    margin: 0 2px 10px;
  }

  &-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ui-c-text-subtle);
    margin: 0 0 8px 2px;
  }
}

.pg-options-accordion {
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-sm);
  overflow: hidden;

  :deep(.p-accordionpanel:last-child) {
    border-width: 0;
  }
}

.pg-options-label {
  font-weight: 600;
  flex: 1;
  font-size: 14px;
}

.pg-options-tag {
  margin-right: 8px;
}

.pg-options-seed-row {
  display: flex;
  gap: 8px;
}

.pg-options-seed {
  flex: 1;
  min-width: 0;
}

.pg-options-output {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pg-options-input {
  width: 100%;
}

.pg-options-toggle-row {
  flex-wrap: wrap;

  span {
    flex: 1;
    min-width: 0;
  }
}

.pg-options-field-help {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ui-c-text-muted);

  a {
    color: var(--vp-c-brand-1);
    text-decoration: underline;

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }
}

.pg-options-field-help-warn {
  padding: 8px 10px;
  border-radius: var(--vp-radius-xs);
  background: color-mix(in srgb, var(--p-orange-500) 10%, transparent);
  color: var(--ui-c-text);
}
</style>
