import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue';

type Target = () => HTMLElement | null | undefined;

/**
 * Focus for a menu or a drawer that lies over the page. While it is open,
 * what is behind it takes no focus; the part that holds `keep`, usually the
 * button that toggles it, and a backdrop marked `data-overlay-part` stay
 * reachable. When it closes, focus returns to
 * `opener`, unless the reader has already moved on to something else.
 */
export function useOverlayFocus(
  open: Ref<boolean>,
  overlay: Target,
  opener: Target,
  keep?: Target,
) {
  let held: HTMLElement[] = [];

  function hold() {
    const root = overlay();
    const kept = keep?.();

    for (let node = root; node && node !== document.body;) {
      const parent: HTMLElement | null = node.parentElement;

      for (const sibling of parent?.children ?? []) {
        if (
          sibling !== node &&
          sibling instanceof HTMLElement &&
          !sibling.inert &&
          !sibling.hasAttribute('data-overlay-part') &&
          !(kept && sibling.contains(kept))
        ) {
          sibling.inert = true;
          held.push(sibling);
        }
      }

      node = parent;
    }
  }

  function release() {
    for (const element of held) element.inert = false;

    held = [];
  }

  watch(open, async (isOpen) => {
    await nextTick();

    if (isOpen) {
      hold();

      if (document.activeElement?.closest('[inert]')) {
        overlay()?.querySelector<HTMLElement>('button, a[href]')?.focus();
      }

      return;
    }

    release();

    const active = document.activeElement;

    if (!active || active === document.body || overlay()?.contains(active)) {
      opener()?.focus({ preventScroll: true });
    }
  });

  onBeforeUnmount(release);
}
