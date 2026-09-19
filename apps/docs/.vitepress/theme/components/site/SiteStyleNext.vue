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
        class="site-heading site-style-next-link hv-row"
      >
        <ArrowLeft :size="20" class="hv-chev" />
        {{ styleDisplayName(neighbours.previous) }}
      </a>
    </div>
    <div class="site-style-next-target is-next">
      <span class="site-label">Next style</span>
      <a
        :href="`/styles/${neighbours.next}/`"
        class="site-heading site-style-next-link hv-row"
      >
        {{ styleDisplayName(neighbours.next) }}
        <ArrowRight :size="20" class="hv-chev" />
      </a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.site-style-next {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  padding-top: 120px;
  /* The last block of a style page, so it also holds the space to the footer. */
  padding-bottom: 96px;

  &-target {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;

    &.is-next {
      align-items: flex-end;
      text-align: right;
    }
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;

    svg {
      flex-shrink: 0;
    }
  }

  @media (max-width: 767px) {
    gap: 24px;
    padding-top: 80px;
    padding-bottom: 64px;
  }
}
</style>
