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
} from '@lucide/vue';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import StyleOptionsTypeBadge from './StyleOptionsTypeBadge.vue';
import StyleOptionsPreview from './StyleOptionsPreview.vue';
import StyleOptionsCodePanel from './StyleOptionsCodePanel.vue';
import Message from 'primevue/message';
import { padColors, unsupportedHttpApiOptions } from '@theme/utils/avatar';
import { getOptionDescription, getOptionExamples } from '@theme/utils/styleOptionMeta';
import { styleColorsKey, styleColorsDefault, styleDefaultsKey, styleDefaultsDefault } from './styleOptionsKeys';

export interface OptionValue {
  type: string;
  values?: string[];
  min?: number;
  max?: number;
  list?: boolean;
  weighted?: boolean;
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
  string:  { color: 'var(--vp-c-text-2)',    icon: Type },
  number:  { color: 'var(--vp-c-green-1)',   icon: Hash },
  boolean: { color: 'var(--vp-c-brand-1)',   icon: ToggleLeft },
  enum:    { color: 'var(--vp-c-purple-1)',   icon: List },
  color:   { color: 'var(--vp-c-yellow-1)',   icon: Palette },
  range:   { color: 'var(--vp-c-indigo-1)',   icon: SlidersHorizontal },
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

    case 'enum': {
      const result: BadgeConfig[] = [{ label: 'enum', ...s }];
      if (isList.value) result.push({ label: 'enum[]', ...s });
      if (isWeighted.value) result.push({ label: 'weighted', color: s.color, icon: Weight });
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

const skipPreview = computed(() =>
  fieldType.value === 'boolean' || props.name === 'fontFamily' || props.name === 'title',
);

const excludeHttpApi = computed(() => unsupportedHttpApiOptions.has(props.name));

const possibleValues = computed(() => {
  if (skipPreview.value) return [];

  return fieldValues.value.slice().sort(naturalSort);
});

const examples = computed<(string | number | boolean)[] | undefined>(() => {
  if (skipPreview.value) return undefined;
  if (isWeighted.value && fieldValues.value.length > 0) return undefined;

  return getOptionExamples(props.name, colorExamples);
});

// Prefer curated examples, fall back to possible values
const previewItems = computed(() => {
  if (examples.value) return examples.value;
  if (possibleValues.value.length > 0) return possibleValues.value;

  return [];
});

const codeExampleValue = computed(() => {
  if (examples.value) {
    return isList.value ? examples.value.slice(0, 2) : examples.value[0];
  }

  if (possibleValues.value.length > 0) {
    return isList.value ? possibleValues.value.slice(0, 2) : possibleValues.value[0];
  }

  if (fieldType.value === 'boolean') return true;
  if (fieldType.value === 'color') return ['b6e3f4'];
  if (fieldType.value === 'number' || fieldType.value === 'range') {
    const dv = styleDefaults.value[props.name];
    if (typeof dv === 'number') return dv;
    if (fieldMin.value !== undefined) return fieldMin.value;
    return 0;
  }
  if (props.name === 'title') return 'Avatar';
  if (props.name === 'fontFamily') return 'Arial';

  return undefined;
});

const headerId = computed(() => {
  return `options-${props.name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
});

const description = computed(() => getOptionDescription(props.name));

interface MetaItem { label: string; value: string }

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
      formatted = Object.entries(dv).map(([k, v]) => `${k}: ${v}`).join(', ');
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

  const vals = fieldValues.value;

  if (vals.length >= 2) {
    return { [vals[0]]: 2, [vals[1]]: 1 };
  }

  if (vals.length === 1) {
    return { [vals[0]]: 1 };
  }

  return { variant01: 2, variant02: 1 };
});

const hasDetails = computed(() => {
  return previewItems.value.length > 0
    || codeExampleValue.value !== undefined
    || excludeHttpApi.value;
});
</script>

<template>
  <div class="style-options-card">
    <div class="style-options-card-header">
      <h3 :id="headerId" tabindex="-1" class="style-options-card-title">
        {{ name }}
        <a class="header-anchor" :href="`#${headerId}`" aria-hidden="true"></a>
      </h3>
      <div class="style-options-card-badges">
        <StyleOptionsTypeBadge
          v-for="badge in badges"
          :key="badge.label"
          :label="badge.label"
          :color="badge.color"
          :icon="badge.icon"
        />
      </div>
    </div>

    <p class="style-options-card-description" v-if="descriptionWithHints">
      {{ descriptionWithHints }}
    </p>

    <div class="style-options-card-meta" v-if="metaItems.length > 0">
      <span v-for="item in metaItems" :key="item.label" class="style-options-card-meta-item">
        {{ item.label }} <code>{{ item.value }}</code>
      </span>
    </div>

    <Accordion v-if="hasDetails" :value="[]" multiple lazy class="style-options-card-details">
      <AccordionPanel value="0">
        <AccordionHeader>Examples</AccordionHeader>
        <AccordionContent>
          <div class="style-options-card-details-body">
            <div class="style-options-card-preview" v-if="previewItems.length > 0">
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

            <div class="style-options-card-code" v-if="codeExampleValue !== undefined && !weightedExampleValue">
              <StyleOptionsCodePanel
                :style-name="styleName"
                :option-name="name"
                :value="codeExampleValue"
                :exclude-http-api="excludeHttpApi"
              />
            </div>

            <div class="style-options-card-code-group" v-if="codeExampleValue !== undefined && weightedExampleValue">
              <div class="style-options-card-code-section">
                <span class="style-options-card-code-label">Usage</span>
                <StyleOptionsCodePanel
                  :style-name="styleName"
                  :option-name="name"
                  :value="codeExampleValue"
                  :exclude-http-api="excludeHttpApi"
                />
              </div>
              <div class="style-options-card-code-section">
                <span class="style-options-card-code-label">Weighted</span>
                <StyleOptionsCodePanel
                  :style-name="styleName"
                  :option-name="name"
                  :value="weightedExampleValue"
                  :exclude-http-api="excludeHttpApi"
                />
              </div>
            </div>

            <div v-if="excludeHttpApi" class="style-options-card-message">
              <Message severity="warn" :closable="false">
                This option is not supported by our public <a href="/how-to-use/http-api/">HTTP-API</a>.
                You can enable it by <a href="/guides/host-the-http-api-yourself/">hosting your own instance</a>.
              </Message>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<style scoped lang="scss">
.style-options-card {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius-sm);
  padding: 16px 20px;
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
    --p-accordion-panel-border-color: var(--vp-c-border);
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
        background: var(--vp-c-bg-soft);
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
