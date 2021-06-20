import type { Style } from '@dicebear/avatars';
import Editor from './components/editor.svelte';

type Options<O> = {
  mode?: 'prng' | 'fixed';
  defaults?: O;
  hiddenFields?: keyof O;
};

function createEditor<O>(style: Style<O>, target: HTMLElement, options: Options<O> = {}) {
  return new Editor({
    target,
    props: {
      ...options,
      style,
    },
  });
}

export { Editor, createEditor };
