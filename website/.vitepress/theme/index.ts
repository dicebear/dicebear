import { App, onMounted, watchEffect } from 'vue';
import { createVuetify } from 'vuetify';
import DefaultTheme from 'vitepress/theme';
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue';
import Layout from './Layout.vue';
import { createPinia } from 'pinia';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { useData } from 'vitepress';

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component('Badge', VPBadge);

    const isSsr = typeof window === 'undefined';

    const pinia = createPinia();

    const vuetify = createVuetify({
      ssr: isSsr,
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
      theme: {
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1689cc',
              secondary: '#E2E2E2',
              surface: '#F9F9F9',
            },
            variables: {
              'activated-opacity': 0.08,
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#1689cc',
              secondary: '#3A3A3A',
              surface: '#2F2F2F',
            },
            variables: {
              'activated-opacity': 0.08,
            },
          },
        },
      },
    });

    app.use(pinia);
    app.use(vuetify);
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
    });
  },
};
