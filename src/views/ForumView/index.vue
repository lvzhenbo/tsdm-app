<template>
  <IonPage>
    <IonContent>
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
      <IonList v-else lines="none" :inset="true">
        <IonItem v-for="item in forumData" :key="item.tid" :button="true">
          <IonLabel>
            {{ item.title }} <br />
            <IonNote color="medium"> {{ item.author }} </IonNote>
          </IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>
<script setup lang="ts">
  import { forumView } from '@/api/forum';

  interface ForumData {
    fid: number;
    username: string;
    tid: number;
    title: string;
    authorid: string;
    author: string;
    name: string;
    typeid: string;
    total: number;
  }

  defineOptions({
    name: 'ForumView',
  });

  const forumData = ref<ForumData[]>([]);
  const route = useRoute();
  const fid = route.params.fid as string;
  const pages = ref(1);
  const loading = ref(false);

  onMounted(async () => {
    getForumData();
  });

  async function getForumData() {
    try {
      loading.value = true;
      const res = await forumView(fid, String(pages));
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          forumData.value = data.thread;
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
