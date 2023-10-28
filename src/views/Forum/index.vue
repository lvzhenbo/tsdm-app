<template>
  <IonPage>
    <IonContent>
      <IonList lines="none" :inset="true">
        <IonItem v-for="item in subGroupList" :key="item.fid" :button="true">
          <IonLabel>
            <strong class="text-xl">{{ item.title }}</strong> <br />
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

  onMounted(async () => {
    getSubGroup();
  });

  async function getSubGroup() {
    try {
      const res = await subGroup(gid);
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          subGroupList.value = data.forum;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<style scoped></style>
