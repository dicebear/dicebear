import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'node:child_process';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

const commitHash = (
  process.env.GIT_REV ?? execSync('git rev-parse --short HEAD').toString()
).slice(0, 7);

// The languages to bundle, comma separated. The public editor is built with
// VITE_LOCALES=en, because the legal pages it links to exist in English only
// and an interface in another language would promise a translation that is not
// there. Unset, every file in src/messages goes into the build.
const locales = (process.env.VITE_LOCALES ?? '')
  .split(',')
  .map((locale) => locale.trim())
  .filter(Boolean);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    VueI18nPlugin({
      include:
        locales.length > 0
          ? locales.map((locale) => `./src/messages/${locale}.json`)
          : './src/messages/*.json',
      strictMessage: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __dicebearEditorVersion: JSON.stringify(
      `${new Date().toISOString().split('T')[0]}-${commitHash}`,
    ),
  },
});
