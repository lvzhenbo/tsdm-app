<template>
  <IonPage>
    <IonContent color="light">
      <IonList :inset="true">
        <IonListHeader>
          <IonLabel>子版块</IonLabel>
        </IonListHeader>
        <IonItem v-for="item in forumData?.subforum" :button="true">{{ item.name }}</IonItem>
      </IonList>
      <IonChip v-for="item in forumData?.threadtype" :key="item.typeid" class="mt-4 ml-4">
        {{ item.name }}
      </IonChip>
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
      <IonList :inset="true">
        <IonListHeader>
          <IonLabel>子版块</IonLabel>
        </IonListHeader>
        <IonItem v-for="item in forumData?.recommend" :key="item.tid" :button="true">
          <IonLabel> {{ item.title }} <br /> </IonLabel>
        </IonItem>
      </IonList>
      <IonList v-if="forumData?.thread.length" lines="none" :inset="true">
        <IonItem v-for="item in threadList" :key="item.tid" :button="true">
          <IonLabel>
            {{ item.title }} <br />
            <IonNote color="medium"> {{ item.author }} </IonNote>
          </IonLabel>
        </IonItem>
      </IonList>
      <IonInfiniteScroll @ion-infinite="ionInfinite">
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon :icon="chevronUpCircle" />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton>
            <IonIcon :icon="star"></IonIcon>
          </IonFabButton>
          <IonFabButton>
            <IonIcon :icon="add"></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonContent>
  </IonPage>
</template>
<script setup lang="ts">
  import { forumView } from '@/api/forum';
  import { chevronUpCircle, add, star } from 'ionicons/icons';

  interface ForumData {
    thread: Thread[];
    forum_cover: string;
    subforum: Subforum[];
    threadcnt: number;
    total: number;
    forumname: string;
    ismoderator: number;
    moderator: Moderator[];
    recommend: Recommend[];
    threadtype: Threadtype[];
  }

  interface Moderator {
    username: string;
    uid: number;
  }

  interface Recommend {
    tid: number;
    title: string;
  }

  interface Subforum {
    fid: string;
    name: string;
  }

  interface Thread {
    title: string;
    tid: string;
    authorid: string;
    author: string;
    displayorder: string;
    showclass: string;
    showstyle: string;
    views: string;
    replies: string;
    lastpost: string;
    lastposter: string;
    typeid: string;
    closed: string;
    typehtml: string;
    readperm: number;
  }

  interface Threadtype {
    typeid: number;
    name: string;
  }

  defineOptions({
    name: 'ForumView',
  });

  const forumData = ref<ForumData | null>(null);
  const route = useRoute();
  const fid = route.params.fid as string;
  const pages = ref(1);
  const loading = ref(false);
  const threadList = ref<Thread[]>([]);
  const ionInfinite = () => {
    loadMorePage();
  };

  onMounted(async () => {
    getForumData();
  });

  async function getForumData() {
    try {
      loading.value = true;
      const res = await forumView(fid, String(pages.value));
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          forumData.value = data;
          threadList.value = data.thread;
        }
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  async function loadMorePage() {
    try {
      const nextPage = pages.value + 1;
      loading.value = true;
      const res = await forumView(fid, String(nextPage));
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          threadList.value = [...threadList.value, data.thread];
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
