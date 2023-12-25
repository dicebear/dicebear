import getRandomOptions from "@/utils/getRandomOptions";
import { defineStore } from "pinia";
import { computed } from "vue";
import type {
  SelectedStyleCombinations,
  SelectedStyleOptionsCollection,
} from "@/types";
import { createAvatar } from "@/utils/createAvatar";
import getAvatarCombinations from "@/utils/getAvatarCombinations";
import styleCollection from "@/config/styles";
import { useLocalStorage, useStorage } from "@vueuse/core";

const useMainStore = defineStore("main", () => {
  const selectedStyleName = useLocalStorage(
    "editor_style",
    Object.keys(styleCollection)[0]
  );

  const selectedStyleOptionsCollection =
    useStorage<SelectedStyleOptionsCollection>(
      `editor_avatar_options_${__dicebearEditorVersion}`,
      Object.keys(styleCollection).reduce<SelectedStyleOptionsCollection>(
        (acc, key) => {
          acc[key] = getRandomOptions(styleCollection[key].options);

          return acc;
        },
        {}
      )
    );

  const selectedStyleOptions = computed({
    get: () => selectedStyleOptionsCollection.value[selectedStyleName.value],
    set: (value) => {
      selectedStyleOptionsCollection.value[selectedStyleName.value] = value;
    },
  });

  const selectedStyleCombinations = computed(() => {
    return getAvatarCombinations(
      selectedStyleName.value,
      selectedStyleOptionsCollection.value[selectedStyleName.value]
    );
  });

  const availableStyles = computed(() => {
    const result: SelectedStyleCombinations = {};

    for (const key in styleCollection) {
      if (false === styleCollection.hasOwnProperty(key)) {
        continue;
      }

      result[key] = [
        {
          active: selectedStyleName.value === key,
          avatar: createAvatar(key, selectedStyleOptionsCollection.value[key]),
          options: selectedStyleOptionsCollection.value[key],
        },
      ];
    }

    return result;
  });

  const selectedStylePreview = computed(() => {
    return createAvatar(
      selectedStyleName.value,
      selectedStyleOptionsCollection.value[selectedStyleName.value]
    );
  });

  return {
    availableStyles,
    selectedStyleName,
    selectedStylePreview,
    selectedStyleCombinations,
    selectedStyleOptions,
  };
});

export default useMainStore;
