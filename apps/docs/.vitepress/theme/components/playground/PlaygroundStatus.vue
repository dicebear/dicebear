<script setup lang="ts">
/**
 * The status line: how many avatars the options can produce, the legal
 * links the footer would otherwise hold, and the license of the style. It
 * closes the picture on a larger screen and sits right above the actions on
 * a phone.
 *
 * Without the count, as in the editor, which makes one avatar, the license
 * comes first and the legal links follow on the same line.
 */
import { Dices, Scale } from '@lucide/vue';
import { legalLinks } from '@theme/config/footer-links';
import { useCombinationCount } from '@theme/composables/useCombinationCount';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';

withDefaults(
  defineProps<{
    combinations?: boolean;
  }>(),
  { combinations: true },
);

const count = useCombinationCount();

const legal = legalLinks.filter((link) => link.label !== 'Licenses');
</script>

<template>
  <div class="pg-status" :class="{ 'is-inline': !combinations }">
    <span v-if="count && combinations" class="pg-status-combos">
      <Dices :size="14" aria-hidden="true" />
      {{ count.display }} combinations
    </span>
    <span class="pg-status-legal">
      <template v-for="(link, index) in legal" :key="link.href">
        <span v-if="index > 0" aria-hidden="true"> · </span>
        <a
          :href="link.href"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
          >{{ link.label }}</a
        >
      </template>
    </span>
    <div class="pg-status-license-row">
      <Scale :size="14" aria-hidden="true" class="pg-status-license-icon" />
      <PlaygroundLicenseText class="pg-status-license" />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Two lines: the count and the legal links first, the license sentence
   with its own symbol under them, so it keeps clear of the links. A long
   combination count pushes the legal links onto a line of their own on a
   phone instead of past the screen's edge. */
.pg-status {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  box-sizing: border-box;
  min-height: 16px;
  padding: 8px 20px 10px;
  border-top: 1px solid var(--db-line);
  font-size: 12px;
  line-height: 16px;
  color: var(--db-muted);

  &-license-row {
    display: flex;
    flex-basis: 100%;
    align-items: flex-start;
    gap: 6px;
    min-width: 0;
  }

  /* The license first, the legal links after it. Where the two do not fit
     side by side, the links take a line of their own under the license. */
  &.is-inline &-license-row {
    flex: 1 1 320px;
    order: -1;
  }

  &-license-icon {
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--db-ink-2);
  }

  /* The license sentence keeps its links, in the quiet color of the line. */
  &-license {
    flex: 1;
    min-width: 0;

    :deep(a) {
      font-weight: 500;
      color: var(--db-ink-2);
      text-decoration: underline;
      text-decoration-style: solid;
      text-underline-offset: 3px;
    }
  }

  &-legal {
    flex-shrink: 0;
    margin-left: auto;
    white-space: nowrap;

    a {
      color: var(--db-ink-2);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  /* How many different avatars the options can produce: a die and the
     count, at the head of the status line. */
  &-combos {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 5px;
    font-variant-numeric: tabular-nums;
    color: var(--db-ink-2);
  }

  @media (max-width: 959px) {
    padding: 8px 16px 10px;
  }
}
</style>
