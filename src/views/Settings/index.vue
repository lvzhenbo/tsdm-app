<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle> 设置 </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList lines="full">
        <IonItem>
          <IonSelect
            label="主题"
            interface="popover"
            :value="config.theme"
            @ion-change="config.theme = $event.detail.value"
          >
            <IonSelectOption value="system">跟随系统</IonSelectOption>
            <IonSelectOption value="light">浅色模式</IonSelectOption>
            <IonSelectOption value="dark">深色模式</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/stores/modules/setting';

  defineOptions({
    name: 'SettingsIndex',
  });

  const settingStore = useSettingStore();

  onMounted(async () => {
    if (settingStore.config) {
      config.value = settingStore.config;
    }
  });

  const config = ref({
    theme: 'system',
  });

  watch(
    config,
    (val) => {
      settingStore.setConfig(val);
    },
    { deep: true },
  );
</script>

<style scoped></style>
