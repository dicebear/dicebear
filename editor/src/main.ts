import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import App from "./App.vue";
import "./vant";

import "./assets/reset.scss";
import "./assets/vant.scss";

const app = createApp(App);

app.use(createPinia());
app.use(
  createI18n({
    legacy: false,
    locale: navigator.language.split("-")[0],
    fallbackLocale: "en",
    messages,
  })
);

app.mount("#app");
