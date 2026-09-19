import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';

/**
 * One open state for the search dialog. The header field, the phone icon and
 * the keyboard shortcuts all go through it.
 */
const open = ref(false);

export function useSearch() {
  return {
    open,
    show: () => {
      open.value = true;
    },
    hide: () => {
      open.value = false;
    },
  };
}

function isEditing(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;

  if (!target) {
    return false;
  }

  return (
    target.isContentEditable ||
    ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
  );
}

/** Cmd or Ctrl with K, or a slash outside of fields. Call once, in the layout. */
export function useSearchShortcuts() {
  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      open.value = true;

      return;
    }

    if (event.key === '/' && !isEditing(event) && !open.value) {
      event.preventDefault();
      open.value = true;
    }
  });
}
