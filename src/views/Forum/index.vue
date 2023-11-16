<template>
  <IonPage>
    <IonContent color="light">
      <IonList v-if="loading" lines="none" :inset="true">
        <IonItem v-for="n in 4" :key="n">
          <IonLabel>
            <IonSkeletonText :animated="true" class="w-1/3" />
            <IonNote color="medium">
              <IonSkeletonText :animated="true" class="w-1/2" />
            </IonNote>
          </IonLabel>
        </IonItem>
      </IonList>
      <IonRefresher slot="fixed" @ion-refresh="handleRefresh($event)">
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <IonList v-if="listShow" lines="none" :inset="true">
        <IonItem
          v-for="item in subGroupList"
          :key="item.fid"
          :button="true"
          :detail="true"
          @click="handleToForumView(item)"
        >
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
  import { useForumStore } from '@/stores/modules/forum';
  import type { RefresherCustomEvent } from '@ionic/vue';

  interface SubGroup {
    fid: number;
    title: string;
    todaypost: number;
  }

  defineOptions({
    name: 'ForumIndex',
  });

  const subGroupList = ref<SubGroup[]>([]);
  const route = useRoute();
  const router = useRouter();
  const gid = route.params.gid as string;
  const loading = ref(false);
  const forumStore = useForumStore();
  const listShow = ref(false);

  onMounted(async () => {
    getSubGroup();
  });

  async function getSubGroup() {
    try {
      listShow.value = false;
      loading.value = true;
      const res = await subGroup(gid);
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          subGroupList.value = data.forum;
        }
      }
      loading.value = false;
      listShow.value = true;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }

  function handleToForumView(data: SubGroup) {
    forumStore.setForumTitle(data.title);
    router.push(`/forumview/${data.fid}`);
  }

  const handleRefresh = async (event: RefresherCustomEvent) => {
    await getSubGroup();
    event.target.complete();
  };
</script>

<style scoped></style>
