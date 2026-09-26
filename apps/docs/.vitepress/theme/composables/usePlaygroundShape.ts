import { computed } from 'vue';
import { Circle, Square, Squircle } from '@lucide/vue';
import useStore from '@theme/stores/playground';

const RADIUS_KEY = 'borderRadius';

/** The three corners the simple and the editor view offer. */
export const PLAYGROUND_SHAPES = [
  { value: 0, label: 'Square', icon: Square },
  { value: 20, label: 'Rounded', icon: Squircle },
  { value: 50, label: 'Circle', icon: Circle },
] as const;

/**
 * The shape of the avatar as a border radius. Square is the style's own
 * corner, so choosing it removes the option instead of writing a 0.
 */
export function usePlaygroundShape() {
  const store = useStore();

  return computed({
    get: () => {
      const value = store.avatarStyleOptions[RADIUS_KEY];

      return typeof value === 'number' ? value : 0;
    },
    set: (value: number) => {
      if (value === 0) {
        delete store.avatarStyleOptions[RADIUS_KEY];
      } else {
        store.avatarStyleOptions[RADIUS_KEY] = value;
      }
    },
  });
}
