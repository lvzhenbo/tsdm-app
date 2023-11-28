<template>
  <IonPage>
    <IonContent>
      <UserInfoCard :user-info="userStore.userInfo!" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/stores/modules/user';
  import { permissionUserInfo } from '@/api/user';

  defineOptions({
    name: 'UserInfoIndex',
  });

  onMounted(() => {
    getUserInfo();
  });

  const userStore = useUserStore();

  async function getUserInfo() {
    const res = await permissionUserInfo();
    if (res.data) {
      const data = JSON.parse(res.data);
      if (data.status === 0) {
        useUserStore().setUserInfo(data);
      }
    }
  }
</script>

<style scoped></style>
