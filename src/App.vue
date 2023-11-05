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

  if (isPlatform('android') && isPlatform('hybrid')) {
    StatusBar.setOverlaysWebView({ overlay: true });
  }

  const settingStore = useSettingStore();

  onMounted(async () => {
    const config = await getStorage('config');
    if (config) {
      settingStore.setConfig(config);
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
</script>
