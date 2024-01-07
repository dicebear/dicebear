import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'node:child_process';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

const commitHash = (
  process.env.GIT_REV ?? execSync('git rev-parse --short HEAD').toString()
).slice(0, 7);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    VueI18nPlugin({
      include: './src/messages/*.json',
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
      `${new Date().toISOString().split('T')[0]}-${commitHash}`
    ),
  },
});
