/// <reference types="vitepress/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}

interface Umami {
  track(event: string, data?: Record<string, string>): void;
}

declare const umami: Umami | undefined;

interface ImportMetaEnv {
  readonly VITE_PRIVACY_POLICY_URL?: string;
  readonly VITE_COOKIE_POLICY_URL?: string;
  readonly VITE_LEGAL_NOTICE_URL?: string;
}
