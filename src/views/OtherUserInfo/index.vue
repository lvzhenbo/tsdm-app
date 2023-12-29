<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle> 个人资料 </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="light">
      <div v-if="loading" class="flex justify-center h-full items-center">
        <IonSpinner name="circular"></IonSpinner>
      </div>
      <UserInfoCard v-if="!loading && showInfoCard" :user-info="userInfo!" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { otherUserInfo } from '@/api/user';
  import { type UserInfo } from '@/stores/modules/user';
  import { toastController } from '@ionic/vue';

  const route = useRoute();
  const username = route.params.username as string;
  const userInfo = ref<UserInfo | null>(null);
  const toast = ref<null | HTMLIonToastElement>(null);
  const loading = ref(true);
  const showInfoCard = ref(false);

  defineOptions({
    name: 'OtherotherUserInfo',
  });

  onMounted(() => {
    getOtherotherUserInfo();
  });

  async function getOtherotherUserInfo() {
    showInfoCard.value = false;
    loading.value = true;
    const res = await otherUserInfo(username);
    if (res.data) {
      const data = JSON.parse(res.data);
      if (data.status === 0) {
        userInfo.value = data;
        showInfoCard.value = true;
      } else {
        notLoggedInToast();
      }
    }
    loading.value = false;
  }

  async function notLoggedInToast() {
    toast.value = await toastController.create({
      message: '无法获取用户信息',
      duration: 5000,
      position: 'bottom',
      buttons: [
        {
          text: '刷新',
          role: 'refresh',
          handler: () => {
            getOtherotherUserInfo();
          },
        },
      ],
    });
    await toast.value.present();
  }
</script>

<style scoped></style>
