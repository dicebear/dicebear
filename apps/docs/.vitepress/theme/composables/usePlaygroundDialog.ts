import { ref, computed } from 'vue';
import useStore from '../stores/playground';

export function usePlaygroundDialog(seed: () => string) {
  const store = useStore();

  const open = ref(false);

  const options = computed(() => ({
    ...store.avatarStyleOptionsWithoutDefaults,
    seed: seed(),
  }));

  function showDialog() {
    open.value = true;
  }

  return {
    store,
    open,
    options,
    showDialog,
  };
}
