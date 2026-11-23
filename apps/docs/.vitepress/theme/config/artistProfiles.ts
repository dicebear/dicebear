/**
 * Where to find the guest artists beyond the one URL their style definitions
 * carry, keyed by the creator's name in the definitions. The profiles come
 * from the artists' own pages and from the Figma files their styles are based
 * on, so an account the artist does not point to stays out even when the
 * handle matches. LinkedIn is an exception for individuals, chosen per artist:
 * it shows little of their art and can tie a pen name to a legal name.
 */
export const ARTIST_PROFILES: Record<string, readonly string[]> = {
  'Ashley Seo': [
    'https://dribbble.com/ashley-seo',
    'https://www.figma.com/@ashleykseo',
    'https://www.linkedin.com/in/ashley-seo-14759a46',
  ],
  'Davis Uche': ['https://www.figma.com/@davedirect3'],
  'Draftbit - draftbit.com': [
    'https://x.com/draftbit',
    'https://github.com/draftbit',
    'https://www.linkedin.com/company/draftbit',
  ],
  'Johan Melin': [
    'https://x.com/thegamedev',
    'https://www.figma.com/@thegamedev',
    'https://github.com/Johan-Melin',
  ],
  'Matt Houser': ['https://www.figma.com/@matthou'],
  'Micah Lanier': ['https://x.com/micahlanier', 'https://www.figma.com/@micah'],
  'Natalia Spivak': [
    'https://x.com/life_glitched',
    'https://www.figma.com/@nataspvk',
  ],
  'Pablo Stanley': [
    'https://www.pablostanley.com/',
    'https://www.instagram.com/pablostanley',
    'https://github.com/pablostanley',
    'https://pablostanley.substack.com',
  ],
  'The Bootstrap Authors': [
    'https://x.com/getbootstrap',
    'https://github.com/twbs',
  ],
  'vijay verma': [
    'https://x.com/realvjy',
    'https://www.threads.com/@realvjy',
    'https://www.figma.com/@realvjy',
    'https://www.youtube.com/@realvjy',
  ],
  Webpixels: [
    'https://x.com/webpixels_',
    'https://dribbble.com/webpixels',
    'https://www.figma.com/@webpixels',
    'https://github.com/webpixels',
  ],
  Zoish: [
    'https://www.instagram.com/heyzoish',
    'https://x.com/heyzoish',
    'https://www.threads.net/@heyzoish',
  ],
};

/**
 * Creator URLs in the published definitions that no longer lead to the
 * artist. They replace the URL everywhere the site credits the creator.
 */
export const CREATOR_URL_FIXES: Record<string, string> = {
  // The team's own domain is parked.
  'The Visual Team': 'https://www.figma.com/@thevisualteam',
};
