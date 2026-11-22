<script setup lang="ts">
/**
 * A code card. The header row shows one tab per language when `tabs` is set
 * and the language label otherwise; the copy button sits at its right end.
 * The card keeps its own neutral ground, so it reads the same in every
 * block. Text between the marks of `utils/codeMarks` is highlighted and left
 * out of the copy. The `label` slot replaces the language label, the `foot`
 * slot takes a link under the code.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { escapeHtml } from '@theme/utils/escape';
import { marksToHtml, stripMarks } from '@theme/utils/codeMarks';
import { loadHljs, type Hljs } from '@theme/utils/hljs';
import UiCopyButton from './UiCopyButton.vue';
import SiteTabs from '../site/SiteTabs.vue';

export interface UiCodeTab {
  id: string;
  label: string;
  lang?: string;
  code: string;
}

const props = defineProps<{
  lang?: string;
  code?: string;
  /** One tab per language; the active one is the model value. */
  tabs?: UiCodeTab[];
  scrollToBottom?: boolean;
}>();

const active = defineModel<string>();

/** The tab shown: the model value where it names one of the tabs, else the first. */
const activeId = computed(() =>
  props.tabs?.some((tab) => tab.id === active.value)
    ? active.value
    : props.tabs?.[0]?.id,
);

const current = computed<{ lang?: string; code: string }>(() => {
  if (props.tabs?.length) {
    return props.tabs.find((tab) => tab.id === activeId.value) ?? props.tabs[0];
  }
  return { lang: props.lang, code: props.code ?? '' };
});

const preRef = ref<HTMLPreElement>();
const codeHtml = ref(marksToHtml(escapeHtml(current.value.code)));
const plain = computed(() => stripMarks(current.value.code));

function scrollPreToBottom() {
  if (props.scrollToBottom && preRef.value) {
    preRef.value.scrollTop = preRef.value.scrollHeight;
  }
}

function updateCodeHtml(instance?: Hljs) {
  const { lang, code } = current.value;
  codeHtml.value = marksToHtml(
    lang && instance?.getLanguage(lang)
      ? instance.highlight(code, { language: lang }).value
      : escapeHtml(code),
  );
}

onMounted(async () => {
  if (current.value.lang) {
    updateCodeHtml(await loadHljs());
  }
  scrollPreToBottom();
});

watch(current, async () => {
  const instance = current.value.lang ? await loadHljs() : undefined;
  updateCodeHtml(instance);
  await nextTick();
  scrollPreToBottom();
});
</script>

<template>
  <div class="ui-code" :class="{ 'has-tabs': tabs?.length }">
    <div class="ui-code-bar">
      <SiteTabs
        v-if="tabs?.length"
        :model-value="activeId ?? ''"
        :tabs="tabs"
        aria-label="Language"
        @update:model-value="active = $event"
      />
      <span v-else class="ui-code-lang">
        <slot name="label">{{ current.lang }}</slot>
      </span>
      <UiCopyButton class="ui-code-copy" :text="plain" :duration="3000" />
    </div>
    <pre ref="preRef" class="ui-code-text"><code v-html="codeHtml" /></pre>
    <div v-if="$slots.foot" class="ui-code-foot">
      <slot name="foot" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/tone';

.ui-code {
  @include tone.tone('code');

  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border-radius: var(--db-radius-code);
  box-shadow: 0 0 0 1px var(--db-c-line);
  overflow: hidden;

  &-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 12px 0 clamp(20px, 2.6vw, 32px);
  }

  &.has-tabs &-bar {
    padding-left: 12px;
  }

  &-lang {
    font-family: var(--db-font-mono);
    font-size: 12px;
    line-height: 20px;
    color: var(--db-muted);
  }

  &-text {
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 16px 0 24px;
    overflow: auto;
    font-family: var(--db-font-mono);
    font-size: 14px;
    line-height: 24px;
    color: var(--db-ink);
    white-space: pre;

    @media (max-width: 767px) {
      font-size: 13px;
    }

    code {
      display: block;
      width: fit-content;
      min-width: 100%;
      padding: 0 clamp(20px, 2.6vw, 32px);
      font: inherit;
    }
  }

  &-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 24px;
    padding: 0 clamp(20px, 2.6vw, 32px) 16px;
  }

  &-copy {
    /* The tooltip opens to the left, above it the frame would clip it. */
    &:hover::after,
    &:focus-visible::after {
      top: 50%;
      right: calc(100% + 6px);
      bottom: auto;
      left: auto;
      transform: translateY(-50%);
    }
  }
}
</style>

<style>
.ui-code-text .hljs-keyword,
.ui-code-text .hljs-literal,
.ui-code-text .hljs-name,
.ui-code-text .hljs-attr {
  color: var(--db-code-key);
}
.ui-code-text .hljs-string {
  color: var(--db-code-string);
}
.ui-code-text .hljs-comment {
  color: var(--db-muted);
  font-style: italic;
}
/* The reader's own input, such as the seed of the demo. */
.ui-code-text .code-mark {
  padding: 2px 0;
  border-radius: 3px;
  background: var(--db-sun);
  font-weight: 600;
  color: var(--db-on);
}
</style>
