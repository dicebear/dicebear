import { ref } from 'vue';

/**
 * The entry the playground shows in its inspector: one of the general
 * entries, a component or a color. The list on the left and the inspector on
 * the right share it, so it lives outside either of them.
 */
export type PlaygroundEntry =
  | {
      kind: 'general';
      id: 'presets' | 'canvas' | 'output' | 'motion' | 'tags';
    }
  | { kind: 'component'; name: string }
  | { kind: 'color'; name: string };

const selected = ref<PlaygroundEntry | undefined>();

export function entryKey(entry: PlaygroundEntry | undefined): string {
  if (!entry) return '';

  return entry.kind === 'general'
    ? `general:${entry.id}`
    : `${entry.kind}:${entry.name}`;
}

export function usePlaygroundSelection() {
  function select(entry: PlaygroundEntry | undefined) {
    selected.value = entry;
  }

  function isSelected(entry: PlaygroundEntry): boolean {
    return entryKey(selected.value) === entryKey(entry);
  }

  return { selected, select, isSelected };
}
