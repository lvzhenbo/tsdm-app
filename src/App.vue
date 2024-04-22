<template>
  <IonApp>
    <IonRouterOutlet />
  </IonApp>
</template>

<script setup lang="ts">
  import { isPlatform } from '@ionic/vue';
  import { StatusBar } from '@capacitor/status-bar';
  import { useSettingStore } from '@/stores/modules/setting';
  import { getStorage } from './utils';
  import { usePreferredDark } from '@vueuse/core';
  import { autoSignInKey } from '@/utils/provideInjectType';
  import { useUserStore } from '@/stores/modules/user';
  import { formatISO } from 'date-fns';
  import { CapacitorCookies } from '@capacitor/core';
  import { getCookie } from '@/utils/cookie';
  import { baseUrl } from '@/utils/config';
  import { SplashScreen } from '@capacitor/splash-screen';

  if (isPlatform('android') && isPlatform('hybrid')) {
    StatusBar.setOverlaysWebView({ overlay: true });
  }

  const userStore = useUserStore();
  const settingStore = useSettingStore();
  const autoSignIn = ref(false);

  onBeforeMount(async () => {
    await SplashScreen.show();
    const cookie = await getCookie();
    if (cookie) {
      const cookieKeys = Object.keys(cookie);
      const cookieValues = Object.values(cookie);
      for (let i = 0; i < cookieKeys.length; i++) {
        CapacitorCookies.setCookie({
          url: baseUrl.split('www')[1],
          key: cookieKeys[i],
          value: cookieValues[i],
        });
      }
    }
  });

  onMounted(async () => {
    const config = await getStorage('config');
    if (config) {
      settingStore.setConfig(config);
    }
    const signInDate = await getStorage('storedDate');
    if (signInDate) {
      userStore.signInDate = signInDate;
    }
    if (userStore.userInfo != undefined && config?.autoSignIn) {
      handleAutoSignIn();
    }
  });

  const isDark = usePreferredDark();

  watch(
    () => settingStore.config,
    (val) => {
      if (val) {
        if (val.theme === 'system') {
          settingStore.isDark = isDark.value;
          document.documentElement.classList.toggle('ion-palette-dark', isDark.value);
          // document.body.classList.toggle('dark', isDark.value);
        } else if (val.theme === 'light') {
          settingStore.isDark = false;
          document.documentElement.classList.toggle('ion-palette-dark', false);
          // document.body.classList.toggle('dark', false);
        } else if (val.theme === 'dark') {
          settingStore.isDark = true;
          document.documentElement.classList.toggle('ion-palette-dark', true);
          // document.body.classList.toggle('dark', true);
        }
      } else {
        settingStore.isDark = isDark.value;
        document.documentElement.classList.toggle('ion-palette-dark', isDark.value);
        // document.body.classList.toggle('dark', isDark.value);
      }
    },
    { deep: true, immediate: true },
  );

  watch(isDark, (val) => {
    if (settingStore.config) {
      if (settingStore.config.theme === 'system') {
        settingStore.isDark = val;
        document.documentElement.classList.toggle('ion-palette-dark', val);
        // document.body.classList.toggle('dark', val);
      }
    } else {
      settingStore.isDark = val;
      document.documentElement.classList.toggle('ion-palette-dark', val);
      // document.body.classList.toggle('dark', val);
    }
  });

  provide(autoSignInKey, {
    autoSignIn,
  });

  const handleAutoSignIn = async () => {
    const currentStamp = Date.now();
    const currentDate = formatISO(new Date(currentStamp), { representation: 'date' });
    const storedStamp = await getStorage('storedStamp');
    const storedDate = await getStorage('storedDate');

    if (currentDate !== storedDate && currentStamp !== storedStamp) {
      autoSignIn.value = true;
    } else {
      autoSignIn.value = false;
    }
  };
</script>
