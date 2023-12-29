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
  import { autoSignInKey } from '#/provideInject.d';
  import { useUserStore } from '@/stores/modules/user';
  import { formatISO } from 'date-fns';

  if (isPlatform('android') && isPlatform('hybrid')) {
    StatusBar.setOverlaysWebView({ overlay: true });
  }

  const userStore = useUserStore();
  const settingStore = useSettingStore();
  const autoSignIn = ref(false);

  onMounted(async () => {
    console.log(import.meta.env);

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
          document.body.classList.toggle('dark', isDark.value);
        } else if (val.theme === 'light') {
          settingStore.isDark = false;
          document.body.classList.toggle('dark', false);
        } else if (val.theme === 'dark') {
          settingStore.isDark = true;
          document.body.classList.toggle('dark', true);
        }
      } else {
        settingStore.isDark = isDark.value;
        document.body.classList.toggle('dark', isDark.value);
      }
    },
    { deep: true, immediate: true },
  );

  watch(isDark, (val) => {
    if (settingStore.config) {
      if (settingStore.config.theme === 'system') {
        settingStore.isDark = val;
        document.body.classList.toggle('dark', val);
      }
    } else {
      settingStore.isDark = val;
      document.body.classList.toggle('dark', val);
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
