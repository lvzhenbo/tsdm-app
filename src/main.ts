import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { pinia } from './stores';

import { IonicVue, isPlatform } from '@ionic/vue';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { SafeArea } from '@capacitor-community/safe-area';

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

/**
 * Ionic Dark Palette
 * -----------------------------------------------------
 * For more information, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/vue/css/palettes/dark.always.css';
import '@ionic/vue/css/palettes/dark.class.css';
// import '@ionic/vue/css/palettes/dark.system.css';

// Theme variables
import './theme/variables.css';
// Tailwind
import './theme/tailwind.css';

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

SafeArea.enable({
  config: {
    customColorsForSystemBars: true,
    statusBarColor: isDark ? '#111111' : '#ffffff',
  },
});

const app = createApp(App);

app.use(IonicVue);
app.use(router);
app.use(pinia);

SplashScreen.hide().then(async () => {
  await SplashScreen.show({
    autoHide: false,
  });
  await router.isReady();
  app.mount('#app');
  setTimeout(async () => {
    await SplashScreen.hide();
    if (isPlatform('android') && isPlatform('hybrid')) {
      await StatusBar.setOverlaysWebView({ overlay: true });
    }
  }, 500);
});
