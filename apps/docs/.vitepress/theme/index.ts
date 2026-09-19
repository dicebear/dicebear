import '@fontsource-variable/inter';
import { App, onMounted, watchEffect } from 'vue';
import Layout from './Layout.vue';
import { createPinia } from 'pinia';
import { useData } from 'vitepress';
import ThemeBadge from './components/theme/ThemeBadge.vue';
import { track } from '@theme/utils/track';

let clickListenerAdded = false;

export default {
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('Badge', ThemeBadge);

    const pinia = createPinia();

    app.use(pinia);
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
