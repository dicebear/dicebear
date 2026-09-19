<script setup lang="ts">
/**
 * One option as a table row: the name, its types, the description, range
 * and default, and an Examples panel that opens in place with one rendered
 * preview per value and the call in every language.
 */
import { computed, inject, ref } from 'vue';
import { capitalCase } from 'change-case';
import { ChevronDown, Link2 } from '@lucide/vue';
import { padColors } from '@theme/utils/avatar/colors';
import { groupTagsByCategory } from '@theme/utils/avatar/tags';
import { unsupportedHttpApiOptions } from '@theme/utils/avatar/api';
import {
  getOptionDescription,
  getOptionExamples,
  getOptionValueOrder,
  isAnimationOption,
} from '@theme/utils/styleOptionMeta';
import { styleLabel, track } from '@theme/utils/track';
import type { OptionValue } from '../styles/styleOptionsKeys';
import StyleOptionsPreview from '../styles/StyleOptionsPreview.vue';
import StyleOptionsCodePanel from '../styles/StyleOptionsCodePanel.vue';
import {
  componentNamesDefault,
  componentNamesKey,
  styleColorsDefault,
  styleColorsKey,
  styleDefaultsDefault,
  styleDefaultsKey,
} from '../styles/styleOptionsKeys';
import SiteStyleVariantPreview from './SiteStyleVariantPreview.vue';

const props = defineProps<{
  styleName: string;
  name: string;
  value: OptionValue;
}>();

const styleColors = inject(styleColorsKey, styleColorsDefault);
const styleDefaults = inject(styleDefaultsKey, styleDefaultsDefault);
const componentNames = inject(componentNamesKey, componentNamesDefault);

// A `<component>Variant` option of a drawn component previews as whole
// avatars on a seed that shows the component. The `animation` component has
// no artwork of its own, so it stays on the generic preview path.
const variantComponent = computed(() => {
  if (!props.name.endsWith('Variant')) {
    return undefined;
  }
  const component = props.name.slice(0, -'Variant'.length);
  return component !== 'animation' && componentNames.value.includes(component)
    ? component
    : undefined;
});

const naturalSort = (a: string | number, b: string | number) =>
  a.toString().localeCompare(b.toString(), undefined, {
    numeric: true,
    sensitivity: 'base',
  });

const fieldType = computed(() => props.value.type);
const fieldValues = computed(() => props.value.values ?? []);
const isList = computed(() => props.value.list === true);
const isWeighted = computed(() => props.value.weighted === true);

const types = computed<string[]>(() => {
  const type = fieldType.value;
  switch (type) {
    case 'string':
    case 'number':
    case 'color':
      return isList.value ? [type, `${type}[]`] : [type];
    case 'boolean':
      return ['boolean'];
    case 'enum': {
      const result = ['enum'];
      if (isList.value) result.push('enum[]');
      if (isWeighted.value) result.push('weighted');
      return result;
    }
    case 'range':
      return ['number', '[min, max]'];
    default:
      return [type];
  }
});

const skipPreview = computed(
  () =>
    (fieldType.value === 'boolean' && !isAnimationOption(props.name)) ||
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

const sampleValues = computed(() => {
  const withoutNone = possibleValues.value.filter((v) => v !== 'none');
  return withoutNone.length > 0 ? withoutNone : possibleValues.value;
});

const isTags = computed(() => props.name === 'tags');
const tagCategories = computed(() =>
  isTags.value ? groupTagsByCategory(fieldValues.value) : [],
);

function colorExamples(colorName: string, min?: number): string[] {
  return padColors(styleColors.value[colorName] ?? [], min);
}

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
  return possibleValues.value;
});

const codeExampleValue = computed(() => {
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
  if (fieldType.value === 'boolean') {
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
    return props.value.min ?? 0;
  }
  if (props.name === 'title') {
    return 'Avatar';
  }
  if (props.name === 'fontFamily') {
    return 'Arial';
  }
  return undefined;
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

const codeExampleOptions = computed(() => ({
  [props.name]: codeExampleValue.value,
}));
const weightedExampleOptions = computed(() => ({
  [props.name]: weightedExampleValue.value,
}));

const description = computed(() => getOptionDescription(props.name));

const contrastTo = computed(() =>
  fieldType.value === 'color' && typeof props.value.contrastTo === 'string'
    ? props.value.contrastTo
    : null,
);
const contrastLabel = computed(() =>
  contrastTo.value ? capitalCase(contrastTo.value) : '',
);
const contrastHref = computed(() =>
  contrastTo.value ? `#${anchorId(`${contrastTo.value}Color`)}` : '',
);

function anchorId(name: string): string {
  return `options-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

const id = computed(() => anchorId(props.name));

interface MetaItem {
  label: string;
  value: string;
}

const meta = computed<MetaItem[]>(() => {
  const items: MetaItem[] = [];
  const { min, max } = props.value;
  if (min !== undefined && max !== undefined) {
    items.push({ label: 'Range', value: `${min} to ${max}` });
  } else if (min !== undefined) {
    items.push({ label: 'Min', value: String(min) });
  } else if (max !== undefined) {
    items.push({ label: 'Max', value: String(max) });
  }
  if (fieldType.value === 'enum' && !isTags.value) {
    items.push({
      label: 'Values',
      value: isWeighted.value
        ? `${fieldValues.value.length} variant${fieldValues.value.length === 1 ? '' : 's'}`
        : possibleValues.value.join(', '),
    });
  }
  const dv = styleDefaults.value[props.name];
  if (dv !== undefined && !(isWeighted.value && typeof dv === 'object')) {
    items.push({
      label: 'Default',
      value: Array.isArray(dv)
        ? `[${dv.join(', ')}]`
        : typeof dv === 'object' && dv !== null
          ? Object.entries(dv)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')
          : String(dv),
    });
  }
  return items;
});

const hasExamples = computed(
  () =>
    previewItems.value.length > 0 ||
    codeExampleValue.value !== undefined ||
    tagCategories.value.length > 0,
);

const open = ref(false);

function toggle() {
  open.value = !open.value;
  if (open.value) {
    track('Docs Options: Examples Opened', {
      style: styleLabel(props.styleName),
      option: props.name,
    });
  }
}
</script>

<template>
  <div :id="id" class="site-style-option" :class="{ 'is-open': open }">
    <div class="site-style-option-row">
      <div class="site-style-option-head">
        <code class="site-style-option-name">{{ name }}</code>
        <span class="site-style-option-types">{{ types.join(' · ') }}</span>
      </div>
      <div class="site-style-option-text">
        <p v-if="description" class="site-style-option-description">
          {{ description }}
          <template v-if="excludeHttpApi">
            Not available via HTTP API.</template
          >
        </p>
        <p v-if="contrastTo" class="site-style-option-contrast">
          <Link2 :size="14" aria-hidden="true" />
          <span>
            Linked to
            <a :href="contrastHref" class="hv-link">{{ contrastLabel }}</a
            >. The renderer picks the value with the strongest contrast against
            the selected {{ contrastLabel.toLowerCase() }} color, so additional
            values mainly serve as fallbacks.
          </span>
        </p>
        <div v-if="meta.length" class="site-style-option-meta">
          <span v-for="item in meta" :key="item.label">
            {{ item.label }} <code>{{ item.value }}</code>
          </span>
        </div>
      </div>
      <button
        v-if="hasExamples"
        type="button"
        class="site-style-option-toggle hv-seg"
        :aria-expanded="open"
        @click="toggle"
      >
        Examples
        <ChevronDown :size="16" aria-hidden="true" />
      </button>
    </div>
    <div v-if="open && hasExamples" class="site-style-option-examples">
      <div
        v-if="isTags && tagCategories.length > 0"
        class="site-style-option-tags"
      >
        <div
          v-for="group in tagCategories"
          :key="group.category"
          class="site-style-option-tags-group"
        >
          <span class="site-label">{{ group.label }}</span>
          <div class="site-style-option-tags-chips">
            <code v-for="token in group.tokens" :key="token">{{ token }}</code>
          </div>
        </div>
      </div>
      <div
        v-else-if="previewItems.length > 0"
        class="site-style-option-previews"
      >
        <template v-if="variantComponent">
          <SiteStyleVariantPreview
            v-for="val in previewItems"
            :key="String(val)"
            :style-name="styleName"
            :component="variantComponent"
            :variant="String(val)"
          />
        </template>
        <template v-else>
          <StyleOptionsPreview
            v-for="(val, key) in previewItems"
            :key="key"
            :style-name="styleName"
            :name="name"
            :value="val"
          />
        </template>
      </div>
      <div v-if="codeExampleValue !== undefined" class="site-style-option-code">
        <template v-if="weightedExampleValue">
          <div class="site-style-option-code-section">
            <span class="site-label">Usage</span>
            <StyleOptionsCodePanel
              :style-name="styleName"
              :options="codeExampleOptions"
              :exclude-http-api="excludeHttpApi"
            />
          </div>
          <div class="site-style-option-code-section">
            <span class="site-label">Weighted</span>
            <StyleOptionsCodePanel
              :style-name="styleName"
              :options="weightedExampleOptions"
              :exclude-http-api="excludeHttpApi"
            />
          </div>
        </template>
        <StyleOptionsCodePanel
          v-else
          :style-name="styleName"
          :options="codeExampleOptions"
          :exclude-http-api="excludeHttpApi"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-option {
  border-top: 1px solid var(--db-line);
  scroll-margin-top: calc(var(--db-header-h) + 80px);

  &-row {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr) auto;
    gap: 24px;
    align-items: start;
    padding: 16px 0;

    @media (max-width: 767px) {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px 16px;

      .site-style-option-text {
        grid-column: 1 / -1;
      }
    }
  }

  &-head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
  }

  &-name {
    display: inline-block;
    max-width: 100%;
    padding: 4px 10px;
    border-radius: 7px;
    background: var(--db-soft);
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 17px;
    color: var(--db-ink);
    word-break: break-all;
  }

  &-types {
    font-family: var(--db-font-mono);
    font-size: 12px;
    line-height: 15px;
    color: var(--db-muted);
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  &-description {
    margin: 0;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
    text-wrap: pretty;
  }

  &-contrast {
    display: flex;
    gap: 8px;
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--db-muted);

    svg {
      flex-shrink: 0;
      margin-top: 3px;
    }

    a {
      color: var(--db-brand-text);
    }
  }

  &-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 20px;
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);

    span {
      min-width: 0;
    }

    code {
      font-family: var(--db-font-mono);
      font-size: 13px;
      color: var(--db-ink);
      overflow-wrap: anywhere;
    }
  }

  &-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
    border: 0;
    border-radius: var(--db-radius-1);
    background: none;
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--db-muted);
    cursor: pointer;
    white-space: nowrap;

    svg {
      transition: transform var(--duration-mid) var(--site-ease);
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 4px;
    }

    &[aria-expanded='true'] {
      color: var(--db-ink);

      svg {
        transform: rotate(180deg);
      }
    }
  }

  /* The examples line up with the description, not with the name chip. */
  &-examples {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
    padding: 0 0 28px 244px;

    @media (max-width: 767px) {
      padding-left: 0;
    }
  }

  &-previews {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px 12px;
  }

  &-tags {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      code {
        padding: 3px 8px;
        border-radius: var(--db-radius-1);
        background: var(--db-soft);
        font-family: var(--db-font-mono);
        font-size: 12px;
        line-height: 16px;
        color: var(--db-ink);
      }
    }
  }

  &-code {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;

    &-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
  }
}
</style>
