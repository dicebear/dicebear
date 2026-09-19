import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export type PopoverAlign = 'left' | 'right';

interface PopoverPositionOptions {
  /** The floating panel. It has to exist once `ready` is true. */
  panel: Ref<HTMLElement | null>;
  /** Anchor to use when `show()` gets no event, for example a trigger slot. */
  anchor?: () => HTMLElement | null | undefined;
  align?: () => PopoverAlign;
  onShow?: () => void;
  onHide?: () => void;
}

/** Gap between the anchor and the panel, and between the panel and the viewport edge. */
const GAP = 8;

/**
 * Opens a panel below an anchor and keeps it there. The panel uses the Popover
 * API where the browser has it, which puts it in the top layer (above a modal
 * dialog too) and brings light dismiss and Esc. Without the API the same panel
 * is a fixed box toggled with `v-show`, and this composable closes it on an
 * outside press and on Esc.
 *
 * The consumer renders the panel only when `ready` is true, sets
 * `popover="auto"` when `native` is true, and binds `style`, `onToggle` (the
 * native `toggle` event) and `v-show="native || open"`.
 */
export function usePopoverPosition(options: PopoverPositionOptions) {
  const { panel } = options;

  const ready = ref(false);
  const native = ref(false);
  const open = ref(false);
  const style = ref<Record<string, string>>({});

  let anchorEl: HTMLElement | null = null;
  let frame = 0;
  let reopenGuard = false;
  let reopenTimer: ReturnType<typeof setTimeout> | undefined;

  function place() {
    const el = panel.value;

    if (!el || !anchorEl) return;

    const rect = anchorEl.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;

    // The anchor left the viewport, for example after scrolling its container.
    if (rect.bottom < 0 || rect.top > viewportHeight) {
      hide();

      return;
    }

    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const align = options.align?.() ?? 'left';

    let left = align === 'right' ? rect.right - width : rect.left;
    left = Math.max(GAP, Math.min(left, viewportWidth - width - GAP));

    let top = rect.bottom + GAP;
    const above = rect.top - GAP - height;

    if (top + height > viewportHeight - GAP && above >= GAP) {
      top = above;
    }

    style.value = { top: `${Math.round(top)}px`, left: `${Math.round(left)}px` };
  }

  function schedulePlace() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(place);
  }

  function onDocumentPointerDown(event: PointerEvent) {
    const target = event.target as Node | null;
    const onAnchor = !!target && !!anchorEl?.contains(target);

    if (native.value) {
      // Light dismiss closes the panel before the click reaches the anchor.
      // The guard keeps that click from opening it again.
      reopenGuard = onAnchor;

      return;
    }

    if (!onAnchor && !(target && panel.value?.contains(target))) {
      hide();
    }
  }

  function onDocumentKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || native.value) return;

    event.preventDefault();
    event.stopPropagation();

    const focusInside = panel.value?.contains(document.activeElement);

    hide();

    if (focusInside) anchorEl?.focus();
  }

  function listen() {
    window.addEventListener('resize', schedulePlace);
    window.addEventListener('scroll', schedulePlace, {
      capture: true,
      passive: true,
    });
    document.addEventListener('pointerdown', onDocumentPointerDown, true);
    document.addEventListener('keydown', onDocumentKeyDown, true);
  }

  function unlisten() {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', schedulePlace);
    window.removeEventListener('scroll', schedulePlace, true);
    document.removeEventListener('pointerdown', onDocumentPointerDown, true);
    document.removeEventListener('keydown', onDocumentKeyDown, true);
  }

  function markClosed() {
    if (!open.value) return;

    open.value = false;
    unlisten();
    options.onHide?.();

    // The click that follows a light dismiss arrives right away. After that
    // the guard must not swallow a later, unrelated click.
    clearTimeout(reopenTimer);
    reopenTimer = setTimeout(() => (reopenGuard = false), 250);
  }

  async function show(event?: Event) {
    const target = event?.currentTarget ?? null;

    anchorEl =
      target instanceof HTMLElement
        ? target
        : (options.anchor?.() ?? panel.value?.parentElement ?? null);

    if (open.value || !ready.value) {
      if (open.value) place();

      return;
    }

    reopenGuard = false;
    open.value = true;

    // Content that renders only while open has to exist before measuring.
    await nextTick();

    const el = panel.value;

    if (!el || !open.value) return;

    if (native.value && !el.matches(':popover-open')) {
      el.showPopover();
    }

    place();
    listen();
    options.onShow?.();
  }

  function hide() {
    const el = panel.value;

    if (native.value && el?.matches(':popover-open')) {
      // Fires `toggle`, which ends in `markClosed`. Calling it here as well
      // keeps the state right when the event arrives late.
      el.hidePopover();
    }

    markClosed();
  }

  function toggle(event?: Event) {
    if (open.value) {
      hide();
      reopenGuard = false;

      return;
    }

    if (reopenGuard) {
      reopenGuard = false;

      return;
    }

    void show(event);
  }

  /** Handler for the panel's native `toggle` event. */
  function onToggle(event: Event) {
    if ((event as ToggleEvent).newState === 'closed') markClosed();
  }

  onMounted(() => {
    native.value = typeof HTMLElement.prototype.showPopover === 'function';
    ready.value = true;
  });

  onBeforeUnmount(() => {
    unlisten();
    clearTimeout(reopenTimer);
  });

  return { ready, native, open, style, show, hide, toggle, onToggle };
}
