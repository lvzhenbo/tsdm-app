import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { pinia } from './stores';

import { IonicVue } from '@ionic/vue';
import { SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

// Theme variables
import './theme/variables.css';
// Tailwind
import './theme/tailwind.css';

const app = createApp(App);

app.use(IonicVue);
app.use(router);
app.use(pinia);

router.isReady().then(() => {
  app.mount('#app');
  SafeAreaController.injectCSSVariables();
});
