<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { escapeHtml } from '@theme/utils/escape';
import { loadHljs, type Hljs } from '@theme/utils/hljs';
import UiCopyButton from './UiCopyButton.vue';

const props = defineProps<{
  lang?: string;
  code: string;
  scrollToBottom?: boolean;
}>();

const preRef = ref<HTMLPreElement>();
const codeHtml = ref(escapeHtml(props.code));

function scrollPreToBottom() {
  if (props.scrollToBottom && preRef.value) {
    preRef.value.scrollTop = preRef.value.scrollHeight;
  }
}

function updateCodeHtml(instance?: Hljs) {
  if (props.lang && instance?.getLanguage(props.lang)) {
    codeHtml.value = instance.highlight(props.code, {
      language: props.lang,
    }).value;
  } else {
    codeHtml.value = escapeHtml(props.code);
  }
}

onMounted(async () => {
  if (props.lang) {
    const instance = await loadHljs();
    updateCodeHtml(instance);
  }

  scrollPreToBottom();
});

watch(
  () => props.code,
  async () => {
    const instance = props.lang ? await loadHljs() : undefined;
    updateCodeHtml(instance);
    await nextTick();
    scrollPreToBottom();
  },
);
</script>

<template>
  <div class="ui-code">
    <pre ref="preRef" class="ui-code-text"><code v-html="codeHtml" /></pre>
    <UiCopyButton class="ui-code-copy" :text="code" :duration="3000" />
  </div>
</template>

<style lang="scss" scoped>
.ui-code {
  position: relative;
  background-color: var(--vp-code-block-bg);
  border-radius: var(--vp-radius-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  transition: background-color 0.5s;

  &-text {
    font-family: var(--vp-font-family-mono);
    font-size: var(--vp-code-font-size);
    color: var(--vp-code-block-color);
    line-height: var(--vp-code-line-height);
    margin: 0;
    padding: 20px 0;
    white-space: pre;
    overflow: auto;
    flex: 1;
    min-height: 0;
    transition: color 0.5s;

    code {
      display: block;
      padding: 0 24px;
      width: fit-content;
      min-width: 100%;
    }
  }

  &-copy {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vp-code-copy-code-bg);
    border: 1px solid var(--vp-code-copy-code-border-color);
    border-radius: var(--vp-radius-chrome);
    color: var(--vp-code-copy-code-active-text);
    cursor: pointer;
    opacity: 0;
    transition:
      border-color 0.25s,
      background-color 0.25s,
      opacity 0.25s;
  }

  &:hover &-copy,
  &-copy:focus {
    opacity: 1;
  }

  &-copy:hover {
    border-color: var(--vp-code-copy-code-hover-border-color);
    background-color: var(--vp-code-copy-code-hover-bg);
  }
}
</style>

<style>
.ui-code-text .hljs-keyword {
  color: var(--vp-c-purple-1);
}
.ui-code-text .hljs-string {
  color: var(--vp-c-green-1);
}
.ui-code-text .hljs-title {
  color: var(--vp-c-yellow-1);
}
.ui-code-text .hljs-attr {
  color: var(--vp-c-brand-1);
}
.ui-code-text .hljs-name {
  color: var(--vp-c-brand-1);
}
.ui-code-text .hljs-tag {
  color: var(--vp-c-text-2);
}
.ui-code-text .hljs-number {
  color: var(--vp-c-green-1);
}
.ui-code-text .hljs-literal {
  color: var(--vp-c-brand-1);
}
.ui-code-text .hljs-built_in {
  color: var(--vp-c-yellow-1);
}
.ui-code-text .hljs-params {
  color: var(--vp-c-text-1);
}
.ui-code-text .hljs-comment {
  color: var(--vp-c-text-3);
}
.ui-code-text .hljs-meta {
  color: var(--vp-c-text-3);
}
</style>
