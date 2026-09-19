import { ref } from 'vue';

/**
 * The language tab a reader picked last. Every code window on a style page
 * follows it, so choosing PHP once under Usage also opens the option examples
 * in PHP. The ids are the ones of `usageSnippets`.
 */
const activeCodeTab = ref('http-api');

export function useCodeTab() {
  return activeCodeTab;
}
