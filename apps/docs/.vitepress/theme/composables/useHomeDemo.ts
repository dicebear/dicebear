/**
 * The state of the home page hero: one seed and the styles the fan shows it
 * in. The seed field changes it, or the die rolls a new one.
 */
import {
  computed,
  inject,
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
  }

  function setSeed(value: string) {
    seed.value = value;
  }

  const demo: HomeDemo = {
    seed,
    styleName,
    styles,
    style,
    options,
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
