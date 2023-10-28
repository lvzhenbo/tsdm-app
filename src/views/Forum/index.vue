<template>
  <IonPage>
    <IonContent color="light">
      <IonList v-if="loading" lines="full" :inset="true">
        <IonItem v-for="n in 3" :key="n">
          <IonLabel>
            <IonSkeletonText :animated="true" style="width: 30%" />
            <IonNote color="medium">
              <IonSkeletonText :animated="true" style="width: 40%" />
            </IonNote>
          </IonLabel>
        </IonItem>
      </IonList>
      <IonList v-else lines="full" :inset="true">
        <IonItem v-for="item in subGroupList" :key="item.fid" :button="true">
          <IonLabel>
            {{ item.title }} <br />
            <IonNote color="medium"> 今日发帖：{{ item.todaypost }} </IonNote>
          </IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { subGroup } from '@/api/forum';

  interface SubGroupList {
    fid: number;
    title: string;
    todaypost: number;
  }

  defineOptions({
    name: 'ForumIndex',
  });

  const subGroupList = ref<SubGroupList[]>([]);
  const route = useRoute();
  const gid = route.params.gid as string;
  const loading = ref(false);

  onMounted(async () => {
    getSubGroup();
  });

  async function getSubGroup() {
    try {
      loading.value = true;
      const res = await subGroup(gid);
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          subGroupList.value = data.forum;
        }
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
</script>

<style scoped></style>
