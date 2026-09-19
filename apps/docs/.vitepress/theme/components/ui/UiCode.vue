<script setup lang="ts">
/**
 * A code block in the look of the docs code blocks. The header row shows one
 * tab per language when `tabs` is set and the language label otherwise. The
 * copy button sits at its right end.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { escapeHtml } from '@theme/utils/escape';
import { loadHljs, type Hljs } from '@theme/utils/hljs';
import UiCopyButton from './UiCopyButton.vue';

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
const codeHtml = ref(escapeHtml(current.value.code));

function scrollPreToBottom() {
  if (props.scrollToBottom && preRef.value) {
    preRef.value.scrollTop = preRef.value.scrollHeight;
  }
}

function updateCodeHtml(instance?: Hljs) {
  const { lang, code } = current.value;
  if (lang && instance?.getLanguage(lang)) {
    codeHtml.value = instance.highlight(code, { language: lang }).value;
  } else {
    codeHtml.value = escapeHtml(code);
  }
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
      <div v-if="tabs?.length" class="ui-code-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="tab.id === activeId"
          :class="{ 'is-active': tab.id === activeId }"
          @click="active = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
      <span v-else class="ui-code-lang">{{ current.lang }}</span>
      <UiCopyButton
        class="ui-code-copy"
        :text="current.code"
        :duration="3000"
      />
    </div>
    <pre ref="preRef" class="ui-code-text"><code v-html="codeHtml" /></pre>
  </div>
</template>

<style lang="scss" scoped>
.ui-code {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--db-line);
  border-radius: 14px;
  background: var(--db-code-bg);
  overflow: hidden;

  &-bar {
    flex-shrink: 0;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 12px;
    height: 40px;
    padding: 0 6px 0 16px;
    background: var(--db-code-bar);
    border-bottom: 1px solid var(--db-code-line);
  }

  &.has-tabs &-bar {
    height: 44px;
    padding-left: 8px;
  }

  &-lang {
    align-self: center;
    font-family: var(--db-font-mono);
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
  }

  &-tabs {
    display: flex;
    align-items: stretch;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    button {
      display: inline-flex;
      align-items: center;
      padding: 0 12px;
      border: 0;
      border-bottom: 2px solid transparent;
      background: none;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      color: var(--db-muted);
      white-space: nowrap;
      cursor: pointer;
      transition: color 0.12s;

      &:hover {
        color: var(--db-ink);
      }

      &.is-active {
        border-bottom-color: var(--db-brand);
        font-weight: 600;
        color: var(--db-ink);
      }

      &:focus-visible {
        outline: 2px solid var(--db-brand);
        outline-offset: -2px;
      }
    }
  }

  &-text {
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 16px 0 18px;
    overflow: auto;
    font-family: var(--db-font-mono);
    font-size: 14px;
    line-height: 24px;
    color: var(--db-code-ink);
    white-space: pre;

    @media (max-width: 767px) {
      font-size: 13px;
    }

    code {
      display: block;
      width: fit-content;
      min-width: 100%;
      padding: 0 20px;
      font: inherit;
    }
  }

  &-copy {
    align-self: center;

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
  color: var(--db-brand-text);
}
.ui-code-text .hljs-string {
  color: var(--db-code-string);
}
.ui-code-text .hljs-comment {
  color: var(--db-muted);
  font-style: italic;
}
</style>
