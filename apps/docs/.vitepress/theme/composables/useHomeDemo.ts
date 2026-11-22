/**
 * The state of the home page demo: one seed shared by every section of the
 * page, and the styles the hero shows it in. The seed field of the hero
 * changes it, and the code sample and the crowd further down follow. The
 * style in the middle of the hero is the one the code uses.
 */
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { styleDisplayName } from '@theme/utils/styleMeta';

/** The names the die lands on. Short, so they fit the seed field. */
export const DEMO_NAMES = [
  'Felix',
  'Mia',
  'Noah',
  'Aiko',
  'Lena',
  'Omar',
  'Ines',
  'Kofi',
  'Jule',
  'Ravi',
  'Nora',
  'Emil',
  'Zoe',
  'Luca',
  'Amara',
  'Theo',
  'Yuki',
  'Ida',
  'Malik',
  'Frida',
  'Jonas',
  'Leila',
  'Oskar',
  'Sana',
];

export interface HomeDemoStyle {
  name: string;
  title: string;
  animated: boolean;
}

export interface HomeDemo {
  seed: Ref<string>;
  styleName: Ref<string>;
  /** The styles of the hero fan, the chosen one among them. */
  styles: ComputedRef<HomeDemoStyle[]>;
  style: ComputedRef<HomeDemoStyle>;
  /** The options of the chosen style, the way they go into an avatar. */
  options: ComputedRef<Record<string, unknown>>;
  /** True once someone typed or rolled. */
  touched: Ref<boolean>;
  roll: () => void;
  setSeed: (value: string) => void;
}

const HOME_DEMO_KEY: InjectionKey<HomeDemo> = Symbol('home-demo');

export function provideHomeDemo(config: {
  styles: string[];
  style: string;
  seed?: string;
}): HomeDemo {
  const { theme } = useData<ThemeOptions>();

  const styles = computed<HomeDemoStyle[]>(() =>
    config.styles
      .filter((name) => theme.value.avatarStyles[name] !== undefined)
      .map((name) => ({
        name,
        title: styleDisplayName(name),
        animated: theme.value.avatarStyles[name]?.animated === true,
      })),
  );

  const seed = ref(config.seed ?? DEMO_NAMES[0]);
  const styleName = ref(config.style);
  const touched = ref(false);

  const style = computed(
    () =>
      styles.value.find((entry) => entry.name === styleName.value) ??
      styles.value[0],
  );

  // Avatars move wherever their style can.
  const options = computed(() =>
    style.value?.animated
      ? { seed: seed.value, animation: true }
      : { seed: seed.value },
  );

  function roll() {
    const others = DEMO_NAMES.filter((name) => name !== seed.value);

    seed.value = others[Math.floor(Math.random() * others.length)];
    touched.value = true;
  }

  function setSeed(value: string) {
    seed.value = value;
    touched.value = true;
  }

  const demo: HomeDemo = {
    seed,
    styleName,
    styles,
    style,
    options,
    touched,
    roll,
    setSeed,
  };

  provide(HOME_DEMO_KEY, demo);

  return demo;
}

export function useHomeDemo(): HomeDemo {
  const demo = inject(HOME_DEMO_KEY);

  if (!demo) {
    throw new Error('useHomeDemo() needs provideHomeDemo() further up.');
  }

  return demo;
}

/**
 * Types a few names into the seed by itself until someone takes over, so the
 * field shows what it is for. Waits while `active` is false, for example
 * while the hero is out of view.
 */
export function useSeedTyping(
  demo: HomeDemo,
  names: string[],
  active: Ref<boolean> = ref(true),
) {
  const TYPE_MS = 200;
  const ERASE_MS = 80;
  const HOLD_MS = 2200;

  const typing = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let index = 0;

  function step(erasing: boolean) {
    if (demo.touched.value) {
      typing.value = false;

      return;
    }

    if (!active.value) {
      timer = setTimeout(() => step(erasing), HOLD_MS);

      return;
    }

    if (erasing) {
      if (demo.seed.value.length > 0) {
        demo.seed.value = demo.seed.value.slice(0, -1);
        timer = setTimeout(() => step(true), ERASE_MS);

        return;
      }

      index = (index + 1) % names.length;
    }

    const name = names[index];

    if (demo.seed.value.length < name.length) {
      demo.seed.value = name.slice(0, demo.seed.value.length + 1);
      timer = setTimeout(() => step(false), TYPE_MS);

      return;
    }

    timer = setTimeout(() => step(true), HOLD_MS);
  }

  function stop() {
    clearTimeout(timer);
    typing.value = false;

    // A half-erased name would otherwise stay in the field.
    if (!demo.touched.value && demo.seed.value !== names[index]) {
      demo.seed.value = names[index];
    }
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    typing.value = true;
    timer = setTimeout(() => step(true), HOLD_MS);
  });

  onBeforeUnmount(() => clearTimeout(timer));

  return { typing, stop };
}
