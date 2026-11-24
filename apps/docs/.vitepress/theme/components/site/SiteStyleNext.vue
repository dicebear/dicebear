<script setup lang="ts">
/**
 * The way onward at the end of a style page: the previous and the next
 * style in the alphabet, the list wrapping around at both ends.
 */
import { computed } from 'vue';
import { ArrowLeft, ArrowRight } from '@lucide/vue';
import { useAvatarStyleList } from '@theme/composables/avatar';
import { styleDisplayName } from '@theme/utils/styleMeta';

const props = defineProps<{
  styleName: string;
}>();

const styles = useAvatarStyleList();

const neighbours = computed(() => {
  const sorted = [...styles.value].sort((a, b) =>
    styleDisplayName(a).localeCompare(styleDisplayName(b)),
  );
  const index = sorted.indexOf(props.styleName);
  const count = sorted.length;
  return {
    previous: sorted[(index - 1 + count) % count],
    next: sorted[(index + 1) % count],
  };
});
</script>

<template>
  <nav class="site-container site-style-next" aria-label="Neighbouring styles">
    <div class="site-style-next-target">
      <span class="site-label">Previous style</span>
      <a
        :href="`/styles/${neighbours.previous}/`"
        class="site-heading site-style-next-link"
      >
        <ArrowLeft :size="20" />
        {{ styleDisplayName(neighbours.previous) }}
      </a>
    </div>
    <div class="site-style-next-target is-next">
      <span class="site-label">Next style</span>
      <a
        :href="`/styles/${neighbours.next}/`"
        class="site-heading site-style-next-link"
      >
        {{ styleDisplayName(neighbours.next) }}
        <ArrowRight :size="20" />
      </a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.site-style-next {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px 48px;
  padding-top: clamp(48px, 6vw, 88px);
  /* The last block of a style page, so it also holds the space to the footer. */
  padding-bottom: clamp(64px, 8vw, 112px);

  &-target {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;

    /* Wrapped under the previous style, it still ends on the right. */
    &.is-next {
      align-items: flex-end;
      margin-left: auto;
      text-align: right;
    }
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;

    color: var(--db-ink);

    svg {
      flex-shrink: 0;
      transition: transform 0.25s var(--ease-spring);
    }

    &:hover svg {
      transform: translateX(4px);
    }
  }

  &-target:not(.is-next) &-link:hover svg {
    transform: translateX(-4px);
  }
}
</style>
