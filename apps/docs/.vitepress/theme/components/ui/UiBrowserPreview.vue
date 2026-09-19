<script setup lang="ts">
/**
 * A result row for an HTTP API URL: the avatar the URL returns, the URL with
 * its style and parameters picked out, and the whole row opens it.
 */
import { computed } from 'vue';
import { ArrowUpRight } from '@lucide/vue';

const props = defineProps<{
  url: string;
}>();

const parts = computed(() => {
  const [base, query = ''] = props.url.split('?');
  const segments = base.split('/');

  // https://api.dicebear.com/<version>/<style>/<format>
  const hasStyle = segments.length >= 6;

  return {
    head: hasStyle ? `${segments.slice(0, 4).join('/')}/` : base,
    style: hasStyle ? segments[4] : '',
    tail: hasStyle ? `/${segments.slice(5).join('/')}` : '',
    params: query
      .split('&')
      .filter(Boolean)
      .map((pair) => {
        const index = pair.indexOf('=');

        return index < 0
          ? { key: pair, value: '' }
          : { key: pair.slice(0, index), value: pair.slice(index + 1) };
      }),
  };
});
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener"
    class="ui-browser-preview hv-thumb"
  >
    <span class="ui-browser-preview-tile">
      <img
        :src="url"
        width="80"
        height="80"
        alt="Avatar returned by this URL"
        loading="lazy"
      />
    </span>
    <code class="ui-browser-preview-url"
      >{{ parts.head }}<b>{{ parts.style }}</b
      >{{ parts.tail
      }}<template v-for="(param, index) in parts.params" :key="index"
        >{{ index === 0 ? '?' : '&'
        }}<span class="ui-browser-preview-key">{{ param.key }}</span
        >=<b>{{ param.value }}</b></template
      ></code
    >
    <ArrowUpRight class="ui-browser-preview-arrow" :size="16" />
  </a>
</template>

<style lang="scss" scoped>
.ui-browser-preview {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 10px 16px 10px 10px;
  border: 1px solid var(--db-line);
  border-radius: 14px;
  background: var(--db-paper);
  text-decoration: none;

  &:hover {
    border-color: var(--db-hover-border);
  }

  /* Rows that follow each other in a page read as one group. */
  & + & {
    margin-top: 10px;
  }

  &-tile {
    flex-shrink: 0;
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background: var(--db-tile);
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &-url {
    flex: 1;
    min-width: 0;
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 21px;
    color: var(--db-muted);
    overflow-wrap: anywhere;

    b {
      font-weight: 600;
      color: var(--db-ink);
    }
  }

  &-key {
    color: var(--db-brand-text);
  }

  &-arrow {
    flex-shrink: 0;
    color: var(--db-muted);
  }

  @media (max-width: 767px) {
    gap: 12px;
    padding-right: 12px;

    &-tile {
      width: 64px;
      height: 64px;
    }
  }
}
</style>
