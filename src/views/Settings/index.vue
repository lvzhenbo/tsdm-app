<template>
  <IonPage>
    <IonHeader>
      <IonToolbar
        :color="settingStore.isDark ? undefined : 'primary'"
        class="!pt-[var(--safe-area-inset-top)]"
      >
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
            @ion-input="config.comment = $event.detail.value!"
            @ion-blur="config.comment = config.comment || '安卓客户端签到'"
          />
        </IonItem>
        <IonItem>
          <IonToggle
            :checked="config.autoSignIn"
            @ion-change="config.autoSignIn = $event.detail.checked"
          >
            <IonLabel>自动签到</IonLabel>
          </IonToggle>
        </IonItem>
      </IonList>
      <div v-if="userStore.userInfo" class="px-4 mt-4">
        <IonButton expand="block" @click="handleLogOut"> 退出登录 </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/stores/modules/setting';
  import { useUserStore } from '@/stores/modules/user';
  import { CapacitorCookies } from '@capacitor/core';
  import { alertController } from '@ionic/vue';
  import { removeCookie } from '@/utils/cookie';

  defineOptions({
    name: 'SettingsIndex',
  });

  const settingStore = useSettingStore();
  const userStore = useUserStore();
  const router = useRouter();

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

  const handleLogOut = async () => {
    const alert = await alertController.create({
      header: '提示',
      message: '确定要退出登录吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '确定',
          role: 'confirm',
          handler: async () => {
            await CapacitorCookies.clearAllCookies();
            await removeCookie();
            userStore.removeUserInfo();
            router.back();
          },
        },
      ],
    });
    await alert.present();
  };
</script>

<style scoped></style>
