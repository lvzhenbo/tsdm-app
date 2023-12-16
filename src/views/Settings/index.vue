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
        <IonItem>
          <IonSelect
            label="签到心情"
            :value="config.emotion"
            ok-text="确认"
            cancel-text="取消"
            disabled
            @ion-change="config.emotion = $event.detail.value"
          >
            <IonSelectOption value="1">开心</IonSelectOption>
            <IonSelectOption value="2">郁闷</IonSelectOption>
            <IonSelectOption value="3">难过</IonSelectOption>
            <IonSelectOption value="4">无聊</IonSelectOption>
            <IonSelectOption value="5">怒</IonSelectOption>
            <IonSelectOption value="6">擦汗</IonSelectOption>
            <IonSelectOption value="7">奋斗</IonSelectOption>
            <IonSelectOption value="8">衰</IonSelectOption>
            <IonSelectOption value="9">慵懒</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonInput
            label="签到评论"
            placeholder="请输入签到评论"
            class="text-right"
            :value="config.comment"
            disabled
            @ion-input="config.comment = $event.detail.value!"
          />
        </IonItem>
        <IonItem>
          <IonToggle
            :checked="config.autoSignIn"
            disabled
            @ion-change="config.autoSignIn = $event.detail.checked"
          >
            <IonLabel>自动签到</IonLabel>
          </IonToggle>
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
    emotion: '1',
    comment: '安卓客户端签到',
    autoSignIn: false,
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
