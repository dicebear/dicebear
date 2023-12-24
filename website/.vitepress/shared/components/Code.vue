<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import 'highlight.js/styles/base16/material-palenight.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import copy from 'copy-to-clipboard';

const props = defineProps<{
  lang?: string;
  code: string;
}>();

const codeHtml = ref(props.code);
const copied = ref(false);
let timeout: any = null;

function onCopy() {
  copy(props.code);

  copied.value = true;

  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    copied.value = false;
  }, 3000);
}

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
});

onMounted(async () => {
  hljs.getLanguage('js') || hljs.registerLanguage('js', javascript);
  hljs.getLanguage('html') || hljs.registerLanguage('html', xml);

  if (props.lang) {
    codeHtml.value =
      hljs.highlight(props.code, {
        language: props.lang,
      }).value ?? '';
  }
});
</script>

<template>
  <div :class="['code', `code-language-${lang}`]">
    <span
      :class="['code-copy', copied ? 'code-copied' : null]"
      @click.prevent="onCopy"
    ></span>
    <pre><code v-html="codeHtml" /></pre>
  </div>
</template>

<style scoped lang="scss">
.code {
  position: relative;
  margin: 16px 0;
  background-color: var(--vp-code-block-bg);
  overflow-x: auto;
  transition: background-color 0.5s;
  border-radius: 6px;

  + .code {
    margin-top: -8px;
  }

  pre,
  code {
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  pre {
    position: relative;
    z-index: 1;
    margin: 0;
    padding: 16px 0;
    background: transparent;
    overflow-x: auto;
  }

  code {
    display: block;
    padding: 0 24px;
    width: fit-content;
    line-height: var(--vp-code-line-height);
    font-size: var(--vp-code-font-size);
    color: var(--vp-code-block-color);
    transition: color 0.5s;
  }

  .code-copy {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    display: block;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    background-color: var(--vp-code-block-bg);
    opacity: 0;
    cursor: pointer;
    background-image: var(--vp-icon-copy);
    background-position: 50%;
    background-size: 20px;
    background-repeat: no-repeat;
    transition: opacity 0.25s;
  }

  &:hover > .code-copy {
    opacity: 1;
  }

  > .code-copy:hover {
    background-color: var(--vp-code-copy-code-hover-bg);
  }

  > .code-copy.code-copied,
  > .code-copy:hover.code-copied {
    border-radius: 0 4px 4px 0;
    background-color: var(--vp-code-copy-code-hover-bg);
    background-image: var(--vp-icon-copied);
  }

  > span.code-copy.code-copied::before,
  > span.code-copy:hover.code-copied::before {
    position: relative;
    left: -65px;
    display: block;
    border-radius: 4px 0 0 4px;
    padding-top: 8px;
    width: 64px;
    height: 40px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: var(--vp-code-copy-code-active-text);
    background-color: var(--vp-code-copy-code-hover-bg);
    white-space: nowrap;
    content: 'Copied';
  }

  &::before {
    position: absolute;
    top: 6px;
    right: 12px;
    z-index: 2;
    font-size: 12px;
    font-weight: 500;
    color: var(--vp-c-text-dark-3);
    transition: color 0.5s, opacity 0.5s;
  }

  &:hover::before {
    opacity: 0;
  }

  &.code-language-html::before {
    content: 'html';
  }
  &.code-language-js::before {
    content: 'js';
  }
}
</style>
