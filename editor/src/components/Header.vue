<script setup lang="ts">
import { useI18n } from "vue-i18n";
import useMainStore from "@/stores/main";
import { SparklesIcon } from "@heroicons/vue/24/outline";
import getRandomOptions from "@/utils/getRandomOptions";
import availableStyles from "@/config/styles";
import getApiUrl from "@/utils/getApiUrl";
import { computed, ref } from "vue";

const { t } = useI18n();
const store = useMainStore();
const show = ref(false);

const styleMeta = computed(
  () => availableStyles[store.selectedStyleName].style.meta
);

function onShuffle() {
  store.selectedStyleOptions = getRandomOptions(
    availableStyles[store.selectedStyleName].options
  );
}

async function onDownload() {
  show.value = true;

  const apiUrl = getApiUrl(
    store.selectedStyleName,
    store.selectedStyleOptions,
    "png"
  );

  const response = await fetch(apiUrl);
  const blob = await response.blob();
  const file = URL.createObjectURL(blob);
  const timestamp = new Date().getTime();

  const link = document.createElement("a");
  link.href = file;
  link.download = `${store.selectedStyleName}-${timestamp}.png`;
  link.target = "_blank";
  link.click();
  link.remove();

  URL.revokeObjectURL(file);
}
</script>

<template>
  <van-dialog
    v-model:show="show"
    :title="t('downloadStarted')"
    :confirm-button-text="t('close')"
  >
    <p class="header-dialog-text">{{ t("downloadStartedDescription") }}</p>
    <p
      v-if="styleMeta?.license?.name !== 'CC0 1.0'"
      class="header-dialog-text"
      v-html="
        t('downloadStartedDescriptionLicense', {
          title: styleMeta?.title,
          source: styleMeta?.source,
          creator: styleMeta?.creator,
          homepage: styleMeta?.homepage,
          licenseName: styleMeta?.license?.name,
          licenseUrl: styleMeta?.license?.url,
        })
      "
    ></p>
  </van-dialog>

  <div class="header">
    <button class="header-shuffle" @click="onShuffle" :title="t('shuffle')">
      <SparklesIcon></SparklesIcon>
    </button>
    <button class="header-save" @click="onDownload">{{ t("save") }}</button>
  </div>
</template>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;

  &-dialog-text {
    text-align: center;
    font-size: 14px;
    margin: 16px 12px;
  }

  &-shuffle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background-color: #fff;
    color: #0f172a;
    opacity: 0.9;

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      opacity: 1;
    }
  }

  &-save {
    display: flex;
    align-items: center;
    height: 40px;
    border-radius: 20px;
    padding: 0 16px;
    font-weight: 600;
    line-height: 1;
    background-color: #fff;
    color: #0f172a;
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
