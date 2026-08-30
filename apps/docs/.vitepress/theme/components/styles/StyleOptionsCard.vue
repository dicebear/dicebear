<script setup lang="ts">
import { computed, inject, type Component } from 'vue';
import {
  Type,
  Hash,
  ToggleLeft,
  List,
  Palette,
  SlidersHorizontal,
  Weight,
  Link2,
} from '@lucide/vue';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import { UiCard } from '../ui';
import Tag from 'primevue/tag';
import { capitalCase } from 'change-case';
import StyleOptionsPreview from './StyleOptionsPreview.vue';
import StyleOptionsCodePanel from './StyleOptionsCodePanel.vue';
import Message from 'primevue/message';
import { padColors } from '@theme/utils/avatar/colors';
import { track } from '@theme/utils/track';
import { unsupportedHttpApiOptions } from '@theme/utils/avatar/api';
import {
  getOptionDescription,
  getOptionExamples,
  getOptionValueOrder,
} from '@theme/utils/styleOptionMeta';
import { groupTagsByCategory } from '@theme/utils/avatar/tags';
import {
  styleColorsKey,
  styleColorsDefault,
  styleDefaultsKey,
  styleDefaultsDefault,
} from './styleOptionsKeys';

export interface OptionValue {
  type: string;
  values?: string[];
  min?: number;
  max?: number;
  list?: boolean;
  weighted?: boolean;
  contrastTo?: string;
}

const props = defineProps<{
  styleName: string;
  name: string;
  value: OptionValue;
}>();

const styleColors = inject(styleColorsKey, styleColorsDefault);
const styleDefaults = inject(styleDefaultsKey, styleDefaultsDefault);

function colorExamples(colorName: string, min?: number): string[] {
  return padColors(styleColors.value[colorName] ?? [], min);
}

const naturalSort = (a: string | number, b: string | number) => {
  return a.toString().localeCompare(b.toString(), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const fieldType = computed(() => props.value.type);
const fieldValues = computed(() => props.value.values ?? []);
const fieldMin = computed(() => props.value.min);
const fieldMax = computed(() => props.value.max);
const isList = computed(() => props.value.list === true);
const isWeighted = computed(() => props.value.weighted === true);

interface BadgeConfig {
  label: string;
  color: string;
  icon: Component;
}

const typeStyles: Record<string, { color: string; icon: Component }> = {
  string: { color: 'var(--vp-c-text-2)', icon: Type },
  number: { color: 'var(--vp-c-green-1)', icon: Hash },
  boolean: { color: 'var(--vp-c-brand-1)', icon: ToggleLeft },
  enum: { color: 'var(--vp-c-purple-1)', icon: List },
  color: { color: 'var(--vp-c-yellow-1)', icon: Palette },
  range: { color: 'var(--vp-c-indigo-1)', icon: SlidersHorizontal },
};

function style(type: string) {
  return typeStyles[type] ?? { color: 'var(--vp-c-text-2)', icon: Type };
}

const badges = computed<BadgeConfig[]>(() => {
  const type = fieldType.value;
  const s = style(type);

  switch (type) {
    case 'string':
    case 'number':
    case 'color': {
      const result: BadgeConfig[] = [{ label: type, ...s }];
      if (isList.value) result.push({ label: `${type}[]`, ...s });
      return result;
    }

    case 'boolean':
      return [{ label: 'boolean', ...s }];

    case 'animation': {
      // The option takes `true`/`false` or a subset of the style's animation
      // names. The names themselves are listed in the card body.
      const bool = style('boolean');
      const result: BadgeConfig[] = [{ label: 'boolean', ...bool }];
      if (fieldValues.value.length > 0)
        result.push({ label: 'name[]', color: bool.color, icon: List });
      return result;
    }

    case 'enum': {
      const result: BadgeConfig[] = [{ label: 'enum', ...s }];
      if (isList.value) result.push({ label: 'enum[]', ...s });
      if (isWeighted.value)
        result.push({ label: 'weighted', color: s.color, icon: Weight });
      return result;
    }

    case 'range':
      return [
        { label: 'number', color: s.color, icon: Hash },
        { label: '[min, max]', ...s },
      ];

    default:
      return [{ label: type, ...s }];
  }
});

const skipPreview = computed(
  () =>
    fieldType.value === 'boolean' ||
    fieldType.value === 'animation' ||
    props.name === 'fontFamily' ||
    props.name === 'title',
);

const excludeHttpApi = computed(() =>
  unsupportedHttpApiOptions.has(props.name),
);

const possibleValues = computed(() => {
  if (skipPreview.value) {
    return [];
  }

  const order = getOptionValueOrder(props.name);

  if (!order) {
    return fieldValues.value.slice().sort(naturalSort);
  }

  return fieldValues.value.slice().sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);

    if (ia === -1 && ib === -1) return naturalSort(a, b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;

    return ia - ib;
  });
});

// Values the code snippets pick from. A `none` variant is real but makes a
// weak sample, because the snippet would mostly show the component switched
// off. The other values win whenever the option has any.
const sampleValues = computed(() => {
  const withoutNone = possibleValues.value.filter((v) => v !== 'none');

  return withoutNone.length > 0 ? withoutNone : possibleValues.value;
});

// The `tags` option lists the style's tag vocabulary grouped by category
// instead of an avatar preview per value.
const isTags = computed(() => props.name === 'tags');

// The animation option's selectable timeline names, shown as chips below the
// description.
const animationNames = computed(() =>
  fieldType.value === 'animation' ? fieldValues.value : [],
);
const tagCategories = computed(() =>
  isTags.value ? groupTagsByCategory(fieldValues.value) : [],
);

const examples = computed<(string | number | boolean)[] | undefined>(() => {
  if (skipPreview.value) {
    return undefined;
  }

  if (isWeighted.value && fieldValues.value.length > 0) {
    return undefined;
  }

  return getOptionExamples(props.name, colorExamples);
});

const previewItems = computed(() => {
  if (examples.value) {
    return examples.value;
  }

  if (possibleValues.value.length > 0) {
    return possibleValues.value;
  }

  return [];
});

const codeExampleValue = computed(() => {
  // A single tag keeps the example meaningful: two tokens from the flat list
  // often span different categories, which combine with AND and would demo a
  // near-empty, misleading filter.
  if (isTags.value) {
    return possibleValues.value.slice(0, 1);
  }

  if (examples.value) {
    return isList.value ? examples.value.slice(0, 2) : examples.value[0];
  }

  if (sampleValues.value.length > 0) {
    return isList.value
      ? sampleValues.value.slice(0, 2)
      : sampleValues.value[0];
  }

  if (fieldType.value === 'boolean' || fieldType.value === 'animation') {
    return true;
  }

  if (fieldType.value === 'color') {
    return ['b6e3f4'];
  }

  if (fieldType.value === 'number' || fieldType.value === 'range') {
    const dv = styleDefaults.value[props.name];

    if (typeof dv === 'number') {
      return dv;
    }

    if (fieldMin.value !== undefined) {
      return fieldMin.value;
    }

    return 0;
  }

  if (props.name === 'title') {
    return 'Avatar';
  }

  if (props.name === 'fontFamily') {
    return 'Arial';
  }

  return undefined;
});

const headerId = computed(() => {
  return `options-${props.name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
});

const contrastTo = computed(() =>
  fieldType.value === 'color' && typeof props.value.contrastTo === 'string'
    ? props.value.contrastTo
    : null,
);

const contrastTargetHref = computed(() => {
  const name = contrastTo.value;
  if (!name) return null;
  const optionName = `${name}Color`;
  return `#options-${optionName.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
});

const contrastTargetLabel = computed(() => {
  const name = contrastTo.value;
  return name ? capitalCase(name) : '';
});

const description = computed(() => getOptionDescription(props.name));

interface MetaItem {
  label: string;
  value: string;
}

const metaItems = computed<MetaItem[]>(() => {
  const items: MetaItem[] = [];
  const min = fieldMin.value;
  const max = fieldMax.value;

  if (min !== undefined && max !== undefined) {
    items.push({ label: 'Range', value: `${min} — ${max}` });
  } else if (min !== undefined) {
    items.push({ label: 'Min', value: String(min) });
  } else if (max !== undefined) {
    items.push({ label: 'Max', value: String(max) });
  }

  const dv = styleDefaults.value[props.name];

  if (dv !== undefined) {
    let formatted: string;
    if (Array.isArray(dv)) {
      formatted = `[${dv.join(', ')}]`;
    } else if (typeof dv === 'object' && dv !== null) {
      formatted = Object.entries(dv)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    } else {
      formatted = String(dv);
    }
    items.push({ label: 'Default', value: formatted });
  }

  return items;
});

const descriptionWithHints = computed(() => {
  let text = description.value;
  if (!text) return undefined;

  if (excludeHttpApi.value) text += ' Not available via HTTP-API.';

  return text;
});

const weightedExampleValue = computed(() => {
  if (!isWeighted.value) return undefined;

  const vals = sampleValues.value;

  if (vals.length >= 2) {
    return { [vals[0]]: 2, [vals[1]]: 1 };
  }

  if (vals.length === 1) {
    return { [vals[0]]: 1 };
  }

  return { variant01: 2, variant02: 1 };
});

// The code panel takes a whole option set, and an object literal in the
// template would be a new one on every render, re-generating all eight
// snippets each time an option card re-renders for an unrelated reason.
const codeExampleOptions = computed(() => ({
  [props.name]: codeExampleValue.value,
}));

const weightedExampleOptions = computed(() => ({
  [props.name]: weightedExampleValue.value,
}));

const hasDetails = computed(() => {
  return (
    previewItems.value.length > 0 ||
    codeExampleValue.value !== undefined ||
    excludeHttpApi.value
  );
});

// Track when a reader expands an option's "Examples" panel. PrimeVue's
// Accordion `update:value` emits the same panel value on both open and close,
// so instead we read the header's resulting `aria-expanded` state after the
// click and only count opens.
function onExamplesToggle(event: MouseEvent) {
  const header = event.currentTarget as HTMLElement | null;

  requestAnimationFrame(() => {
    if (header?.getAttribute('aria-expanded') === 'true') {
      track('Docs Options: Examples Opened', {
        style: props.styleName,
        option: props.name,
      });
    }
  });
}
</script>

<template>
  <UiCard class="style-options-card">
    <div class="style-options-card-header">
      <!-- h4, one level below the group headings, so an `outline: [2, 3]`
           page lists the groups in the aside without every option card. -->
      <h4 :id="headerId" tabindex="-1" class="style-options-card-title">
        {{ name }}
        <a class="header-anchor" :href="`#${headerId}`" aria-hidden="true"></a>
      </h4>
      <div class="style-options-card-badges">
        <Tag
          v-for="badge in badges"
          :key="badge.label"
          :style="{
            background: `color-mix(in srgb, ${badge.color} 10%, transparent)`,
            color: badge.color,
          }"
        >
          <component v-if="badge.icon" :is="badge.icon" :size="13" />
          {{ badge.label }}
        </Tag>
      </div>
    </div>

    <p class="style-options-card-description" v-if="descriptionWithHints">
      {{ descriptionWithHints }}
    </p>

    <div v-if="animationNames.length > 0" class="style-options-card-tags-chips">
      <code
        v-for="animationName in animationNames"
        :key="animationName"
        class="style-options-card-tags-chip"
        >{{ animationName }}</code
      >
    </div>

    <div
      v-if="contrastTo"
      class="style-options-card-contrast-banner"
      role="note"
    >
      <Link2 :size="14" class="style-options-card-contrast-banner-icon" />
      <p class="style-options-card-contrast-banner-text">
        Linked to
        <a
          :href="contrastTargetHref ?? undefined"
          class="style-options-card-contrast-banner-link"
        >
          {{ contrastTargetLabel }} </a
        >. The renderer picks the value with the strongest contrast against the
        selected {{ contrastTargetLabel.toLowerCase() }} color, so additional
        values mainly serve as fallbacks.
      </p>
    </div>

    <div class="style-options-card-meta" v-if="metaItems.length > 0">
      <span
        v-for="item in metaItems"
        :key="item.label"
        class="style-options-card-meta-item"
      >
        {{ item.label }} <code>{{ item.value }}</code>
      </span>
    </div>

    <Accordion
      v-if="hasDetails"
      :value="[]"
      multiple
      lazy
      class="style-options-card-details"
    >
      <AccordionPanel value="0">
        <AccordionHeader @click="onExamplesToggle">Examples</AccordionHeader>
        <AccordionContent>
          <div class="style-options-card-details-body">
            <div
              class="style-options-card-tags"
              v-if="isTags && tagCategories.length > 0"
            >
              <div
                v-for="group in tagCategories"
                :key="group.category"
                class="style-options-card-tags-group"
              >
                <span class="style-options-card-tags-group-title">{{
                  group.label
                }}</span>
                <div class="style-options-card-tags-chips">
                  <code
                    v-for="token in group.tokens"
                    :key="token"
                    class="style-options-card-tags-chip"
                    >{{ token }}</code
                  >
                </div>
              </div>
            </div>

            <div
              class="style-options-card-preview"
              v-else-if="previewItems.length > 0"
            >
              <div class="style-options-card-preview-grid">
                <StyleOptionsPreview
                  v-for="(val, key) in previewItems"
                  :key="key"
                  :style-name="styleName"
                  :name="name"
                  :value="val"
                />
              </div>
            </div>

            <div
              class="style-options-card-code"
              v-if="codeExampleValue !== undefined && !weightedExampleValue"
            >
              <StyleOptionsCodePanel
                :style-name="styleName"
                :options="codeExampleOptions"
                :exclude-http-api="excludeHttpApi"
              />
            </div>

            <div
              class="style-options-card-code-group"
              v-if="codeExampleValue !== undefined && weightedExampleValue"
            >
              <div class="style-options-card-code-section">
                <span class="style-options-card-code-label">Usage</span>
                <StyleOptionsCodePanel
                  :style-name="styleName"
                  :options="codeExampleOptions"
                  :exclude-http-api="excludeHttpApi"
                />
              </div>
              <div class="style-options-card-code-section">
                <span class="style-options-card-code-label">Weighted</span>
                <StyleOptionsCodePanel
                  :style-name="styleName"
                  :options="weightedExampleOptions"
                  :exclude-http-api="excludeHttpApi"
                />
              </div>
            </div>

            <div v-if="excludeHttpApi" class="style-options-card-message">
              <Message severity="warn" :closable="false">
                This option is not supported by our public
                <a href="/integrations/http-api/">HTTP-API</a>. You can enable
                it by
                <a href="/recipes/self-host-the-http-api/"
                  >hosting your own instance</a
                >.
              </Message>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </UiCard>
</template>

<style scoped lang="scss">
.style-options-card {
  min-width: 0;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex-shrink: 0;
  }

  &-title {
    margin: 0 !important;
    padding: 0;
    border: none;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.4;
  }

  &-description {
    margin-top: 10px;
    margin-bottom: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
  }

  &-details {
    margin-top: 12px;
    --p-accordion-panel-border-color: var(--pg-border);
    --p-accordion-header-padding: 8px 0;
    --p-accordion-content-padding: 0;
    --p-accordion-header-background: transparent;
    --p-accordion-header-hover-background: transparent;
    --p-accordion-header-active-background: transparent;
    --p-accordion-header-active-hover-background: transparent;
    --p-accordion-content-background: transparent;
    --p-accordion-panel-border-width: 0;
    --p-accordion-header-font-size: 13px;
    --p-accordion-header-font-weight: 600;
    --p-accordion-header-color: var(--vp-c-text-3);
    --p-accordion-header-hover-color: var(--vp-c-text-2);
    --p-accordion-header-active-color: var(--vp-c-text-3);
    --p-accordion-header-active-hover-color: var(--vp-c-text-2);

    &-body {
      display: flex;
      flex-direction: column;
      padding-top: 4px;
    }

    :deep(.p-accordioncontent-wrapper) {
      min-width: 0;
    }
  }

  &-contrast-banner {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding: 10px 12px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: var(--vp-radius-xs);

    &-icon {
      flex-shrink: 0;
      margin-top: 2px;
      opacity: 0.7;
    }

    &-text {
      margin: 0;
    }

    &-link {
      color: var(--vp-c-brand-1);
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover {
        color: var(--vp-c-brand-2);
      }
    }
  }

  &-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;

    &-item {
      font-size: 13px;
      color: var(--vp-c-text-3);

      code {
        font-size: 12px;
        font-weight: 600;
        padding: 1px 5px;
        border-radius: 3px;
        background-color: var(--vp-code-bg);
        color: var(--vp-c-text-2);
      }
    }
  }

  &-preview {
    margin-top: 16px;

    &-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
      gap: 8px;
    }
  }

  &-tags {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 16px;

    &-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &-group-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--vp-c-text-2);
    }

    &-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    &-chip {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 99px;
      background: var(--vp-code-bg);
      color: var(--vp-c-text-2);
    }
  }

  &-code {
    margin-top: 16px;
  }

  &-code-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
  }

  &-code-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--vp-c-text-3);
    margin-bottom: 8px;
  }

  &-message {
    margin-top: 16px;
    --p-message-text-font-size: 13px;
  }
}
</style>
