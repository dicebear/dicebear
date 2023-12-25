<script setup lang="ts">
import useMainStore from "@/stores/main";
import type { SelectedStyleOptions } from "@/types";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import Avatar from "./Avatar.vue";
import Footer from "./Footer.vue";

const props = defineProps<{
  navOffetTop: number;
}>();

const store = useMainStore();
const { t } = useI18n();

const selectedTab = ref(0);

const tabs = computed(() => {
  const result: Record<
    string,
    Array<{
      avatar: string;
      active?: boolean;
      onClick: () => void;
    }>
  > = {};

  result["style"] = Object.keys(store.availableStyles).map((styleName) => ({
    avatar: store.availableStyles[styleName][0].avatar.toString(),
    active: store.selectedStyleName === styleName,
    onClick: () => changeStyleName(styleName),
  }));

  for (const key in store.selectedStyleCombinations) {
    result[key] = store.selectedStyleCombinations[key].map((combination) => ({
      avatar: combination.avatar.toString(),
      active: combination.active,
      onClick: () => changeOptions(combination.options),
    }));
  }

  return result;
});

function changeStyleName(styleName: string) {
  const scrollY = window.scrollY;

  store.selectedStyleName = styleName;

  requestAnimationFrame(() => {
    // Workaround. Scroll to the previous position after the tab is changed.
    window.scrollTo({ top: scrollY });
  });
}

function changeOptions(options: SelectedStyleOptions) {
  store.selectedStyleOptions = options;
}
</script>

<template>
  <div class="options">
    <van-tabs
      v-model:active="selectedTab"
      swipeable
      shrink
      sticky
      :offset-top="props.navOffetTop"
    >
      <van-tab
        v-for="(key, i) in Object.keys(tabs)"
        :key="i"
        :title="t(key)"
        :disabled="tabs[key].length <= 1"
      >
        <div class="options-body-slide">
          <div class="options-body-grid">
            <button
              v-for="(combination, ci) in tabs[key]"
              :key="ci"
              :class="{
                'options-body-avatar': true,
                'options-body-avatar-active': combination.active,
              }"
              @click="combination.onClick"
            >
              <Avatar
                :svg="combination.avatar"
                :invisible="selectedTab != i"
                class="options-body-avatar-component"
              />
            </button>
          </div>
          <Footer :tab="key" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped lang="scss">
.options {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;

  &-body {
    display: flex;
    overflow: scroll;
    scroll-snap-type: x mandatory;
    flex-grow: 1;

    &-slide {
      padding: var(--van-padding-md) var(--van-padding-sm);
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    &-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
      gap: 20px;
      width: 100%;
    }

    &-avatar {
      position: relative;

      &-component {
        border-radius: 12px;
        overflow: hidden;
      }

      &::after {
        content: "";
        position: absolute;
        top: -6px;
        right: -6px;
        bottom: -6px;
        left: -6px;
        border-radius: 18px;
        border: 0 solid #1689cc;
        transition: border-width 0.12s ease-in-out;
      }

      &-active {
        &::after {
          border-width: 3px;
        }
      }

      @media (pointer: fine) {
        &:hover {
          &::after {
            border-width: 3px;
          }
        }
      }
    }
  }
}
</style>
