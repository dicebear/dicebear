import { createApp, defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { definePreset } from '@primeuix/themes';
import Loader from './Loader.vue';

import './assets/reset.scss';
import 'primeicons/primeicons.css';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const Theme = definePreset(Aura, {});

// The build decides which languages ship (see VITE_LOCALES in vite.config), so
// the browser's language is only taken when the bundle carries it. vue-i18n
// would fall back to English on its own, but the locale is also written into
// <html lang>, and a page whose text is English should not claim otherwise.
const browserLocale = navigator.language.split('-')[0];
const locale = Object.keys(messages ?? {}).includes(browserLocale)
  ? browserLocale
  : 'en';

const AsyncApp = defineAsyncComponent({
  loader: () => import('./App.vue'),
  loadingComponent: Loader,
});

const app = createApp(AsyncApp);

app.use(createPinia());
app.use(
  createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages,
  }),
);
app.use(PrimeVue, {
  theme: {
    preset: Theme,
    options: {
      darkModeSelector: '.dark',
    },
  },
});

app.mount('#app');
