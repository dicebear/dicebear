/**
 * What the home page says beyond its own copy: the guides it points to, the
 * places that read a style definition and an excerpt of a real one.
 */

export interface GuideLink {
  label: string;
  href: string;
}

/** Framework guides in the docs, each one a page of its own. */
export const FRAMEWORK_GUIDES: GuideLink[] = [
  { label: 'React', href: '/integrations/javascript/react/' },
  { label: 'Vue', href: '/integrations/javascript/vue/' },
  { label: 'Svelte', href: '/integrations/javascript/svelte/' },
  { label: 'Angular', href: '/integrations/javascript/angular/' },
  { label: 'Next.js', href: '/integrations/javascript/next-js/' },
  { label: 'Nuxt', href: '/integrations/javascript/nuxt/' },
  { label: 'React Native', href: '/integrations/javascript/react-native/' },
  { label: 'Flutter', href: '/integrations/dart/flutter/' },
  { label: 'Unity', href: '/integrations/csharp/unity/' },
  { label: 'Godot', href: '/integrations/csharp/godot/' },
];

/** Everything that loads a style from its definition file. */
export const DEFINITION_READERS = [
  'Playground',
  'JavaScript',
  'PHP',
  'Python',
  'Rust',
  'Go',
  'Dart',
  'C#',
  'CLI',
  'HTTP API',
];

/** The day of the first commit in the repository. */
export const FIRST_COMMIT = { year: 2017, month: 'March' } as const;

export const LINKS = {
  playground: '/playground/',
  docs: '/start/',
  styles: '/styles/',
  animated: '/animated-avatars/',
  httpApi: '/integrations/http-api/',
  selfHost: '/recipes/self-host-the-http-api/',
  stats: '/stats/',
  studio: '/studio/',
  figmaGuide: '/create-styles/with-figma/',
  schema: '/create-styles/definition-schema/',
  fromScratch: '/create-styles/from-scratch/',
  integrations: '/start/pick-your-integration/',
  support: '/support/',
  github: 'https://github.com/dicebear/dicebear',
} as const;

/** The style the excerpt below comes from. */
export const DEFINITION_STYLE = 'thumbs';

/**
 * The shape of `thumbs.json`, shortened. Every key and value is in the real
 * file, the dots stand for what was left out.
 */
export const DEFINITION_EXCERPT = `{
  "meta": { "license": { "name": "CC0 1.0" } },
  "canvas": { "width": 100, "height": 100, "elements": [ … ] },
  "components": {
    "eyes": {
      "variants": { "variant01": { … }, "variant02": { … } }
    },
    "mouth": { … }
  },
  "colors": {
    "eyes": {
      "contrastTo": "shape",
      "values": ["#000000", "#ffffff"]
    }
  }
}`;
