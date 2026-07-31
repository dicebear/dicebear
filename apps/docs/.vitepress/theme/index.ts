import '@fontsource-variable/inter';
import { App, onMounted, watchEffect } from 'vue';
import DefaultTheme from 'vitepress/theme-without-fonts';
import Layout from './Layout.vue';
import { createPinia } from 'pinia';
import { useData } from 'vitepress';
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import Tooltip from 'primevue/tooltip';
import { track } from '@theme/utils/track';

const DiceBearPreset = definePreset(Aura, {
  semantic: {
    formField: {
      borderRadius: 'var(--vp-radius-sm)',
    },
    content: {
      borderRadius: 'var(--vp-radius-sm)',
    },
    text: {
      color: 'var(--vp-c-text-1)',
      hoverColor: 'var(--vp-c-text-1)',
      mutedColor: 'var(--vp-c-text-2)',
      hoverMutedColor: 'var(--vp-c-text-1)',
    },
    // Brand blue is the official DiceBear #0284C7 (Tailwind `sky-600`), so map
    // PrimeVue's primary ramp to `sky` (not `blue`) — keeps filled buttons,
    // sliders and active states in sync with the CSS `--vp-c-brand-*` tokens.
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{stone.50}',
          100: '{stone.100}',
          200: '{stone.200}',
          300: '{stone.300}',
          400: '{stone.400}',
          500: '{stone.500}',
          600: '{stone.600}',
          700: '{stone.700}',
          800: '{stone.800}',
          900: '{stone.900}',
          950: '{stone.950}',
        },
        content: {
          background: 'var(--vp-c-bg-elv)',
          hoverBackground: 'var(--vp-c-bg-soft)',
          borderColor: 'var(--pg-border)',
          color: 'var(--vp-c-text-1)',
          hoverColor: 'var(--vp-c-text-1)',
        },
        formField: {
          // Same fix as the dark block below: Aura's light form-field border
          // defaults to {surface.300} (#d6d3d1, a warm stone). Pin it to the
          // shared --pg-border token (#e2e2e3) so inputs/selects match the
          // slider tracks and content borders instead of reading warm.
          borderColor: 'var(--pg-border)',
          // Placeholders + form-field icons (select chevron, input icons,
          // number +/- buttons) all default to {surface.400} (#78716c, a warm
          // stone) — browner and darker than the app's neutral grays. These
          // are muted *foreground* colors, so pin them to the shared
          // subtle-text token instead of a surface step.
          placeholderColor: 'var(--ui-c-text-subtle)',
          iconColor: 'var(--ui-c-text-subtle)',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#3f3f46',
          700: '#2c2c32',
          800: '#242429',
          900: '#1a1a1e',
          950: '#111115',
        },
        content: {
          background: 'var(--vp-c-bg-soft)',
          hoverBackground: 'var(--vp-c-bg-soft)',
          borderColor: 'var(--pg-border)',
          color: 'var(--vp-c-text-1)',
          hoverColor: 'var(--vp-c-text-1)',
        },
        formField: {
          background: 'var(--vp-c-bg-soft)',
          // Aura's resting form-field border defaults to {surface.600}
          // (#3f3f46, a cool zinc step) — the one control token not on a
          // VitePress gray. Inputs/selects therefore read colder than the
          // cards, slider tracks and dividers around them (all #3c3f44).
          // Pull it onto the shared --pg-border token so every border matches.
          borderColor: 'var(--pg-border)',
          hoverBorderColor: 'var(--vp-c-gray-1)',
          // Match the light block: pull placeholder + icon colors off the
          // warm {surface.400} stone onto the app's subtle-text token.
          placeholderColor: 'var(--ui-c-text-subtle)',
          iconColor: 'var(--ui-c-text-subtle)',
        },
        text: {
          mutedColor: 'rgba(235, 235, 245, 0.78)',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        // Aura's outlined-secondary uses surface tokens that render almost
        // invisible against our bg-soft surface in dark mode and read very
        // muted in light mode. Lift border + text to VitePress tokens so
        // outlined buttons stay legible in both themes.
        //
        // Aura's contrast hover is also too subtle (one step on the surface
        // scale). Bump it a few steps so the hover state is noticeable.
        light: {
          outlined: {
            secondary: {
              borderColor: 'var(--vp-c-border)',
              color: 'var(--vp-c-text-1)',
              // Aura's hover background is `surface.50` (#fafaf9) — identical
              // to VitePress's `--vp-c-bg` in light mode, so the hover state
              // is invisible against the page. `bg-elv` is pure white and
              // semantically right for an "elevated on hover" effect.
              hoverBackground: 'var(--vp-c-bg-elv)',
              activeBackground: 'var(--vp-c-bg-soft)',
            },
          },
          root: {
            // Filled secondary defaults to ~surface-100 which blends with
            // VitePress's --vp-c-bg-soft (also surface-100). Lift to bg-elv
            // (#ffffff) so filled buttons sit a step above the page surface,
            // matching the card-like "elevated" presence the design calls for.
            secondary: {
              background: 'var(--vp-c-bg-elv)',
              hoverBackground: 'var(--vp-c-bg-soft)',
              activeBackground: 'var(--vp-c-bg-soft)',
              borderColor: 'var(--vp-c-border)',
              hoverBorderColor: 'var(--vp-c-border)',
              activeBorderColor: 'var(--vp-c-border)',
              color: 'var(--vp-c-text-1)',
              hoverColor: 'var(--vp-c-text-1)',
              activeColor: 'var(--vp-c-text-1)',
            },
            contrast: {
              hoverBackground: '{surface.800}',
              hoverBorderColor: '{surface.800}',
            },
          },
          link: {
            color: 'var(--vp-c-text-1)',
            hoverColor: 'var(--p-text-color)',
            activeColor: 'var(--p-text-color)',
          },
        },
        dark: {
          outlined: {
            secondary: {
              borderColor: 'var(--vp-c-border)',
              color: 'var(--vp-c-text-1)',
            },
          },
          root: {
            // Filled secondary defaults to bg-soft (#242429), identical to
            // the card surface around them — buttons read flat. Lift to
            // bg-elv (#2c2c32) for a clear one-step elevation above the
            // card, matching the visual presence of the primary CTA group.
            secondary: {
              background: 'var(--vp-c-bg-elv)',
              hoverBackground: '{surface.600}',
              activeBackground: '{surface.600}',
              borderColor: 'var(--vp-c-bg-elv)',
              hoverBorderColor: '{surface.600}',
              activeBorderColor: '{surface.600}',
              color: 'var(--vp-c-text-1)',
              hoverColor: 'var(--vp-c-text-1)',
              activeColor: 'var(--vp-c-text-1)',
            },
            contrast: {
              hoverBackground: '{surface.100}',
              hoverBorderColor: '{surface.100}',
            },
          },
          link: {
            color: 'var(--p-text-muted-color)',
            hoverColor: 'var(--p-text-color)',
            activeColor: 'var(--p-text-color)',
          },
        },
      },
      // Buttons used here put icon + label in the default slot, so PrimeVue
      // does not wrap the text in `.p-button-label`. Apply Aura's label
      // weight to the button root so default-slot text picks it up via
      // inheritance (Aura default is 500).
      css: () => `
        .p-button {
          font-weight: 500;
        }
      `,
    },
    accordion: {
      colorScheme: {
        dark: {
          header: {
            background: 'var(--vp-c-bg-soft)',
            hoverBackground: 'var(--vp-c-bg-soft)',
            activeBackground: 'var(--vp-c-bg-soft)',
            activeHoverBackground: 'var(--vp-c-bg-soft)',
          },
          content: {
            background: 'var(--vp-c-bg-soft)',
          },
        },
      },
    },
    tag: {
      colorScheme: {
        dark: {
          secondary: {
            background: 'var(--vp-c-bg)',
          },
        },
      },
    },
    togglebutton: {
      colorScheme: {
        dark: {
          root: {
            background: 'var(--vp-c-bg)',
            hoverBackground: 'var(--vp-c-bg)',
            checkedBackground: 'var(--vp-c-bg)',
            borderColor: 'var(--vp-c-bg)',
            checkedBorderColor: 'var(--vp-c-bg)',
          },
          content: {
            checkedBackground: 'var(--vp-c-bg-soft)',
          },
        },
      },
    },
    menu: {
      colorScheme: {
        // The shared content tokens map background and hoverBackground to
        // the same VitePress surface, so the default menu-item hover is
        // invisible against the menu's own background. Lift hover to an
        // adjacent surface step so it actually shows.
        dark: {
          item: {
            focusBackground: '{surface.700}',
          },
        },
        light: {
          item: {
            focusBackground: '{surface.100}',
          },
        },
      },
    },
    inputnumber: {
      colorScheme: {
        // The +/- button color is independent of formField.iconColor and
        // still resolves to {surface.400} (#78716c, warm stone). Pull it onto
        // the same subtle-text token as the other form-field affordances.
        light: {
          button: {
            color: 'var(--ui-c-text-subtle)',
          },
        },
        dark: {
          button: {
            color: 'var(--ui-c-text-subtle)',
          },
        },
      },
    },
  },
});

let clickListenerAdded = false;

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('Badge', VPBadge);

    const pinia = createPinia();

    app.use(pinia);
    app.directive('tooltip', Tooltip);
    app.use(PrimeVue, {
      theme: {
        preset: DiceBearPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    });
  },
  setup: () => {
    const { site, frontmatter } = useData();

    onMounted(() => {
      watchEffect(() => {
        const lang = frontmatter.value.lang ?? site.value.lang;
        const dir = frontmatter.value.dir ?? site.value.dir;

        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
      });

      if (typeof window !== 'undefined' && !clickListenerAdded) {
        clickListenerAdded = true;
        window.addEventListener('click', (e) => {
          const link = (e.target as HTMLElement)?.closest('a');

          if (link && link.hostname) {
            if (link.hostname !== window.location.hostname) {
              track('Outbound Link', { url: link.hostname });
            }
          }
        });
      }
    });
  },
};
