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
      <UserInfoVue v-if="!loading" :user-info="userInfo!" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { otherUserInfo } from '@/api/user';
  import { type UserInfo } from '@/stores/modules/user';
  import { toastController } from '@ionic/vue';
  import UserInfoVue from '@/components/UserInfo.vue';

  const route = useRoute();
  const router = useRouter();
  const username = route.params.username as string;
  const userInfo = ref<UserInfo | null>(null);
  const toast = ref<null | HTMLIonToastElement>(null);
  const loading = ref(true);

  defineOptions({
    name: 'OtherotherUserInfo',
  });

  onMounted(() => {
    getOtherotherUserInfo();
  });

  async function getOtherotherUserInfo() {
    loading.value = true;
    const res = await otherUserInfo(username);
    if (res.data) {
      const data = JSON.parse(res.data);
      if (data.status === 0) {
        userInfo.value = data;
      } else {
        notLoggedInToast();
      }
    }
    loading.value = false;
  }

  async function notLoggedInToast() {
    toast.value = await toastController.create({
      message: '您没有权限查看该板块',
      duration: 5000,
      position: 'bottom',
      buttons: [
        {
          text: '刷新',
          role: 'refresh',
          handler: () => {
            handleToLogin();
          },
        },
      ],
    });
    await toast.value.present();
  }

  const handleToLogin = () => {
    router.push({
      name: 'Login',
    });
  };
</script>

<style scoped></style>
