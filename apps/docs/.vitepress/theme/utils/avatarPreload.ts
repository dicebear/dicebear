export interface PreloadBuffer {
  getPreloadedUrl(): string;
}

/**
 * Keeps a handful of avatar URLs warm in the browser cache. A marker that
 * appears with an image still in flight shows an empty disc for a moment,
 * so every URL handed out has been requested a few seconds earlier.
 */
export function createPreloadBuffer(
  generateUrl: () => string,
  size = 6,
): PreloadBuffer {
  const preloadedUrls: string[] = [];

  function preload(url: string) {
    const img = new Image();
    img.src = url;
  }

  while (preloadedUrls.length < size) {
    const url = generateUrl();
    preloadedUrls.push(url);
    preload(url);
  }

  return {
    getPreloadedUrl(): string {
      if (preloadedUrls.length > 0) {
        const url = preloadedUrls.shift()!;
        const newUrl = generateUrl();
        preloadedUrls.push(newUrl);
        preload(newUrl);
        return url;
      }
      return generateUrl();
    },
  };
}
