import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { onContentUpdated } from 'vitepress';

export interface OutlineItem {
  id: string;
  text: string;
  level: number;
}

/**
 * The headings of the rendered page and the one the reader is at. Both stay
 * empty on the server and fill in after mount, so the markup hydrates the
 * same for everyone.
 */
export function useOutline(levels: [number, number] = [2, 2]) {
  const items: Ref<OutlineItem[]> = ref([]);
  const active = ref('');

  const selector = Array.from(
    { length: levels[1] - levels[0] + 1 },
    (_, index) => `.vp-doc > div > h${levels[0] + index}`,
  ).join(', ');

  function collect() {
    items.value = [...document.querySelectorAll<HTMLElement>(selector)]
      .filter((heading) => heading.id && heading.hasChildNodes())
      .map((heading) => {
        const clone = heading.cloneNode(true) as HTMLElement;

        clone
          .querySelectorAll('.header-anchor, .theme-badge, .footnote-ref')
          .forEach((node) => node.remove());

        return {
          id: heading.id,
          text: (clone.textContent ?? '').trim(),
          level: Number(heading.tagName[1]),
        };
      });

    spy();
  }

  function spy() {
    const offset =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--db-header-h',
        ),
      ) || 64;
    let current = '';

    for (const item of items.value) {
      const heading = document.getElementById(item.id);

      if (heading && heading.getBoundingClientRect().top - offset - 32 <= 0) {
        current = item.id;
      }
    }

    // At the very bottom the last heading may never reach the top.
    if (
      items.value.length &&
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
    ) {
      current = items.value[items.value.length - 1].id;
    }

    active.value = current || (items.value[0]?.id ?? '');
  }

  let frame = 0;

  function onScroll() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(spy);
  }

  onMounted(() => {
    collect();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  });

  onUnmounted(() => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  });

  onContentUpdated(collect);

  return { items, active };
}
