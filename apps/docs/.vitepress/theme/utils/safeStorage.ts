import type { StorageLike } from '@vueuse/core';

type StorageKind = 'localStorage' | 'sessionStorage';

const memory = new Map<StorageKind, StorageLike>();

function inMemory(kind: StorageKind): StorageLike {
  let store = memory.get(kind);

  if (!store) {
    const values = new Map<string, string>();

    store = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => void values.set(key, value),
      removeItem: (key) => void values.delete(key),
    };
    memory.set(kind, store);
  }

  return store;
}

/**
 * The browser's storage, or one that lasts as long as the page where the
 * reader blocks site data: merely touching `window.localStorage` throws
 * then, and the playground must still work.
 */
export function safeStorage(kind: StorageKind): StorageLike {
  try {
    const storage = window[kind];

    storage.getItem('dicebear-storage-probe');

    return storage;
  } catch {
    return inMemory(kind);
  }
}
