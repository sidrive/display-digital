/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import VideoBackground from "vue-responsive-video-background-player";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const app = createApp(App).component("video-background", VideoBackground);

registerPlugins(app);

app.mount("#app");
