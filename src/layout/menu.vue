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
          <IonItem button @click="handleTo('/home')">首页</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
        </IonMenuToggle>
      </IonList>
    </IonContent>
  </IonMenu>
</template>

<script setup lang="ts">
  import { menuController } from '@ionic/vue';
  import { personCircle } from 'ionicons/icons';
  import { useUserStore } from '@/stores/modules/user';
  import { getStorage } from '@/utils';

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

  const handleTo = async (path: string) => {
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
