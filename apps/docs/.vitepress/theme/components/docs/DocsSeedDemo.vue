<script setup lang="ts">
/**
 * Interactive seed demo for the quickstart: a seed field and a grid of
 * avatars that re-render on every keystroke. Rendering happens locally with
 * the library, so typing costs no API requests. Each avatar is labeled with
 * its style id and selectable. The URL row below shows the HTTP API
 * equivalent for the selected style, so clicking a tile visibly swaps one
 * word in the URL.
 */
import { computed, ref } from 'vue';
import { computedAsync } from '@vueuse/core';
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { loadAvatarStyle } from '@theme/utils/avatar/style';
import UiCopyButton from '@theme/components/ui/UiCopyButton.vue';
import UiDemoFrame from '@theme/components/ui/UiDemoFrame.vue';

const props = withDefaults(
  defineProps<{
    styleNames?: string[];
    initialSeed?: string;
  }>(),
  {
    styleNames: () => ['lorelei', 'bottts', 'thumbs', 'pixel-art'],
    initialSeed: 'Alice',
  },
);

const seed = ref(props.initialSeed);
const selectedStyle = ref(props.styleNames[0]);

const apiUrl = computed(() =>
  getAvatarApiUrl(selectedStyle.value, { seed: seed.value }),
);

/** The URL cut around the style id, which the URL row picks out. */
const urlParts = computed(() => {
  const marker = `/${selectedStyle.value}/`;
  const index = apiUrl.value.indexOf(marker);

  return index < 0
    ? { head: apiUrl.value, tail: '' }
    : {
        head: apiUrl.value.slice(0, index + 1),
        tail: apiUrl.value.slice(index + marker.length - 1),
      };
});

/** One data URI per style for the current seed. */
const sources = computedAsync<Record<string, string>>(async () => {
  const currentSeed = seed.value;
  const entries = await Promise.all(
    props.styleNames.map(async (styleName) => {
      try {
        const style = await loadAvatarStyle(styleName);
        const avatar = new Avatar(style, { seed: currentSeed });

        return [styleName, avatar.toDataUri()] as const;
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn('Avatar render failed:', e);
        }

        return [styleName, ''] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
}, {});
</script>

<template>
  <UiDemoFrame title="Try it" playground-url="/playground/">
    <div class="docs-seed-demo">
      <label class="docs-seed-demo-field">
        <span>Seed</span>
        <input
          v-model="seed"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Type anything"
        />
      </label>

      <div class="docs-seed-demo-avatars">
        <button
          v-for="styleName in styleNames"
          :key="styleName"
          type="button"
          class="docs-seed-demo-tile"
          :aria-pressed="styleName === selectedStyle"
          @click="selectedStyle = styleName"
        >
          <span class="docs-seed-demo-avatar">
            <img
              v-if="sources[styleName]"
              :src="sources[styleName]"
              :alt="`${styleName} avatar for the seed ${seed}`"
            />
          </span>
          <code>{{ styleName }}</code>
        </button>
      </div>

      <div class="docs-seed-demo-url">
        <code
          >{{ urlParts.head }}<b>{{ selectedStyle }}</b
          >{{ urlParts.tail }}</code
        >
        <UiCopyButton :text="apiUrl" :duration="1600" label="Copy URL" />
      </div>
    </div>
  </UiDemoFrame>
</template>

<style lang="scss" scoped>
@use '../../styles/control' as c;

.docs-seed-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.docs-seed-demo-field {
  @include c.control;
  @include c.control-size(lg);

  display: flex;
  align-items: center;
  gap: 14px;

  span {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-muted);
  }

  input {
    flex: 1;
    min-width: 0;
    align-self: stretch;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--db-ink);

    &::placeholder {
      font-weight: 500;
      color: var(--db-muted);
    }
  }
}

.docs-seed-demo-avatars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.docs-seed-demo-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 10px;
  border: 0;
  border-radius: 14px;
  background: var(--db-paper);
  box-shadow: 0 0 0 1px var(--db-line);
  font-family: inherit;
  cursor: pointer;
  transition:
    background-color 0.12s,
    box-shadow 0.12s;

  &:hover {
    background: var(--db-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: 3px;
  }

  &[aria-pressed='true'] {
    box-shadow: 0 0 0 2px var(--db-brand);

    code {
      color: var(--db-brand-text);
    }
  }

  code {
    font-family: var(--db-font-mono);
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
    transition: color 0.12s;
  }
}

.docs-seed-demo-avatar {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  background: var(--db-tile);
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.docs-seed-demo-url {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 8px 0 14px;
  border: 1px solid var(--db-line);
  border-radius: var(--db-radius-3);
  background: var(--db-paper);

  code {
    flex: 1;
    min-width: 0;
    padding: 6px 0;
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 20px;
    color: var(--db-ink-2);
    overflow-wrap: anywhere;
  }

  b {
    font-weight: 600;
    color: var(--db-brand-text);
  }
}
</style>
