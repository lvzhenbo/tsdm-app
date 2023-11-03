<template>
  <IonMenu menu-id="main-menu" content-id="main-page">
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <div slot="start" class="p-2">
          <IonAvatar class="flex justify-center items-center">
            <IonIcon v-if="!userStore.userInfo" :icon="personCircle" class="text-6xl"></IonIcon>
            <IonImg v-else :src="userStore.userInfo.avatar" />
          </IonAvatar>
        </div>
        <IonTitle v-if="!userStore.userInfo" @click="handleToLogin">请登录</IonTitle>
        <IonTitle v-else>{{ userStore.userInfo!.username }}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList lines="none">
        <IonMenuToggle>
          <IonItem button @click="handleTo('/home')">
            <IonIcon slot="start" aria-hidden="true" :icon="home"></IonIcon>
            <IonLabel>首页</IonLabel>
          </IonItem>
          <IonItem button @click="handleTo('/userInfo', true)">
            <IonIcon slot="start" aria-hidden="true" :icon="person"></IonIcon>
            <IonLabel>我的资料</IonLabel>
          </IonItem>
          <IonItem button @click="openUrl({ url: 'https://www.tsdm39.com' })">
            <IonIcon slot="start" aria-hidden="true" :icon="globe"></IonIcon>
            <IonLabel>网页论坛</IonLabel>
          </IonItem>
          <IonItem button @click="handleTo('/settings')">
            <IonIcon slot="start" aria-hidden="true" :icon="settings"></IonIcon>
            <IonLabel>设置</IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonList>
    </IonContent>
  </IonMenu>
</template>

<script setup lang="ts">
  import { menuController, alertController } from '@ionic/vue';
  import { personCircle, home, person, globe, settings } from 'ionicons/icons';
  import { useUserStore } from '@/stores/modules/user';
  import { getStorage, openUrl } from '@/utils';

  defineOptions({
    name: 'MenuLayout',
  });

  const router = useRouter();
  const userStore = useUserStore();

  onMounted(() => {
    getUserInfo();
  });

  const handleToLogin = async () => {
    await menuController.close('main-menu');
    router.push('/login');
  };

  const handleTo = async (path: string, auth = false) => {
    if (auth && !userStore.userInfo) {
      const alert = await alertController.create({
        header: '提示',
        message: '请先登录',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
          },
          {
            text: '确定',
            role: 'confirm',
            handler: () => {
              router.push('/login');
            },
          },
        ],
      });
      await alert.present();
      return;
    }
    router.push(path);
  };

  const getUserInfo = async () => {
    const res = await getStorage('userInfo');
    if (res) {
      userStore.setUserInfo(res);
    }
  };
</script>

<style scoped></style>
