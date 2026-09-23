import { ref } from 'vue';
import { Style } from '@dicebear/core';
import useStore from '@theme/stores/playground';
import { registerCustomStyle } from '@theme/utils/avatar/style';
import { track, styleLabel } from '@theme/utils/track';
import { MAX_CUSTOM_STYLE_UPLOAD_BYTES } from '@theme/components/playground/constants';

/**
 * Picking a style and bringing one's own. The list at the style field, the
 * upload dialog and a file dropped on the playground share this state, so
 * it lives outside any of them.
 */

const RECENT_KEY = 'dicebear-playground-recent-styles';
const RECENT_LIMIT = 3;

/** What the upload dialog opens with, for example a dropped file it could not add. */
export type UploadDraft = { json: string; name: string; error: string };

/** A message meant for the person who uploads, not a crash. */
export class StyleUploadError extends Error {}

const recent = ref<string[]>([]);
let recentLoaded = false;

const uploadOpen = ref(false);
const uploadDraft = ref<UploadDraft | undefined>();

// The list may come back empty, for example in a private window, and the
// playground works the same without it.
function readRecent(): string[] {
  try {
    const list: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');

    return Array.isArray(list)
      ? list.filter((name): name is string => typeof name === 'string')
      : [];
  } catch {
    return [];
  }
}

function nameOf(definition: Record<string, unknown>): string {
  const meta = definition.meta as Record<string, unknown> | undefined;
  const source = meta?.source as Record<string, unknown> | undefined;
  const creator = meta?.creator as Record<string, unknown> | undefined;

  if (typeof source?.name === 'string') return source.name;
  if (typeof creator?.name === 'string') return creator.name;
  if (typeof definition.$id === 'string') return definition.$id;

  return 'Custom Style';
}

export function usePlaygroundStyles() {
  const store = useStore();

  if (!recentLoaded && typeof window !== 'undefined') {
    recent.value = readRecent();
    recentLoaded = true;
  }

  /** Puts a style at the top of the styles used last. */
  function remember(name: string) {
    const next = [name, ...recent.value.filter((n) => n !== name)].slice(
      0,
      RECENT_LIMIT,
    );

    recent.value = next;

    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Without storage the list lasts as long as the page.
    }
  }

  function chooseStyle(name: string) {
    store.avatarStyleName = name;

    track('Playground: Style Selected', { style: styleLabel(name) });
  }

  /**
   * Checks a definition and adds it as a style of one's own. Returns the
   * key the style is stored under, throws a `StyleUploadError` with a
   * message for the person otherwise.
   */
  function addStyle(json: string, name?: string): string {
    if (new TextEncoder().encode(json).length > MAX_CUSTOM_STYLE_UPLOAD_BYTES) {
      throw new StyleUploadError('Style definition is too large (max 1 MB).');
    }

    let definition: Record<string, unknown>;

    try {
      definition = JSON.parse(json);
    } catch (err) {
      throw new StyleUploadError(
        `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    try {
      new Style(definition);
    } catch {
      throw new StyleUploadError(
        'Invalid style definition. Check format and required fields.',
      );
    }

    const key = store.addCustomStyle(
      name?.trim() || nameOf(definition),
      definition,
    );

    registerCustomStyle(key, definition);

    return key;
  }

  function openUpload(draft?: UploadDraft) {
    uploadDraft.value = draft;
    uploadOpen.value = true;
  }

  /**
   * Adds a dropped file and switches to it. A file that is not a style
   * opens the upload dialog with its content and the reason, so the person
   * can fix it there.
   */
  async function addFile(file: File) {
    if (file.size > MAX_CUSTOM_STYLE_UPLOAD_BYTES) {
      openUpload({
        json: '',
        name: '',
        error: 'File is too large (max 1 MB).',
      });

      return;
    }

    let json: string;

    try {
      json = await file.text();
    } catch {
      openUpload({ json: '', name: '', error: 'Could not read file.' });

      return;
    }

    try {
      chooseStyle(addStyle(json));
    } catch (err) {
      openUpload({
        json,
        name: '',
        error:
          err instanceof StyleUploadError
            ? err.message
            : 'An unknown error occurred.',
      });
    }
  }

  return {
    recent,
    remember,
    chooseStyle,
    addStyle,
    addFile,
    uploadOpen,
    uploadDraft,
    openUpload,
  };
}
