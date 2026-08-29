import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import { triggerDownload } from '@theme/utils/download';
import { styleLabel, track } from '@theme/utils/track';
import type { ThemeOptions } from '@theme/types';

/**
 * Saves a style's definition file, the JSON that every DiceBear library reads
 * and that the Figma plugin imports.
 *
 * The definitions sit on the CDN and browsers ignore the `download` attribute
 * across origins, so the file travels through a fetch and a blob instead of a
 * plain link.
 */
export function useDefinitionDownload(styleName: MaybeRefOrGetter<string>) {
  const { theme } = useData<ThemeOptions>();
  const pending = ref(false);

  const name = computed(() => kebabCase(toValue(styleName)));

  const url = computed(
    () => theme.value.avatarStyles[toValue(styleName)]?.definitionUrl,
  );

  // The Figma plugin takes the style title from the file name, so `bottts.json`
  // reads better than the packaged `bottts.min.json`.
  const fileName = computed(() => `${name.value}.json`);

  async function download(): Promise<void> {
    if (!url.value || pending.value) {
      return;
    }

    pending.value = true;

    try {
      const response = await fetch(url.value);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      triggerDownload(await response.blob(), fileName.value);

      track('Style: Definition Downloaded', { style: styleLabel(name.value) });
    } catch {
      // The definition is a public URL, so a failed fetch still has somewhere
      // to go: hand the tab over to the CDN and let the browser show the file.
      window.open(url.value, '_blank', 'noopener');
    } finally {
      pending.value = false;
    }
  }

  return { url, fileName, pending, download };
}
