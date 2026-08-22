/**
 * Ready-made option sets per avatar style, shown as a gallery on the style
 * pages. A preset is nothing but a bag of regular render options, so it works
 * in every library and as HTTP-API query parameters without the definition
 * format or any of the seven cores knowing that presets exist.
 *
 * The files live in theme/presets/<style>.json and are picked up by the glob
 * below, so adding a style means adding one file and nothing else.
 * scripts/validate-presets.ts checks them against the current style
 * definitions.
 *
 * The glob is lazy on purpose. Eagerly inlined, all 55 files became one 214 KB
 * chunk that every style page pulled in to use a single style's presets. Now
 * Vite emits one chunk per style and the page fetches the one it needs.
 */

export type StylePreset = {
  /** Stable, kebab-case. Used in the `?preset=` playground link. */
  id: string;
  name: string;
  /** One line, shown next to the avatars. */
  summary: string;
  /** The longer rationale, shown when the card is expanded. */
  description: string;
  options: Record<string, unknown>;
};

type PresetFile = { presets: StylePreset[] };

const loaders = new Map<string, () => Promise<PresetFile>>();

for (const [path, load] of Object.entries(
  import.meta.glob<PresetFile>('../presets/*.json', { import: 'default' }),
)) {
  loaders.set(path.slice(path.lastIndexOf('/') + 1, -'.json'.length), load);
}

/**
 * The presets for a style, or an empty list. Missing presets are a normal
 * state, since most styles have none yet, so this deliberately does not throw
 * the way getPreviewRowSeeds does.
 */
export async function loadStylePresets(
  styleName: string,
): Promise<StylePreset[]> {
  const load = loaders.get(styleName);

  return load ? (await load()).presets : [];
}

export async function loadStylePreset(
  styleName: string,
  id: string,
): Promise<StylePreset | undefined> {
  const presets = await loadStylePresets(styleName);

  return presets.find((preset) => preset.id === id);
}
