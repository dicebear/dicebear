import { onBeforeUnmount, ref } from 'vue';

/**
 * The old way of copying, for pages without the clipboard API such as a
 * local server opened on a phone. The field goes into the open dialog, if
 * any: outside of it, it could not take the selection.
 */
function copyWithSelection(text: string): boolean {
  const active = document.activeElement as HTMLElement | null;
  const host = active?.closest('dialog') ?? document.body;
  const field = document.createElement('textarea');

  field.value = text;
  field.readOnly = true;
  field.setAttribute('aria-hidden', 'true');
  field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  host.append(field);
  field.select();
  field.setSelectionRange(0, text.length);

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
    active?.focus({ preventScroll: true });
  }
}

export async function writeClipboard(text: string): Promise<boolean> {
  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);

      return true;
    } catch {
      // Refused, for example without focus: the old way may still work.
    }
  }

  return copyWithSelection(text);
}

/** Copies text; `copied` stays true for `duration` milliseconds after. */
export function useCopy(duration = 2000) {
  const copied = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy(text: string): Promise<boolean> {
    const done = await writeClipboard(text);

    clearTimeout(timer);
    copied.value = done;

    if (done) {
      timer = setTimeout(() => {
        copied.value = false;
      }, duration);
    }

    return done;
  }

  onBeforeUnmount(() => clearTimeout(timer));

  return { copy, copied };
}
