<template>
  <IonPage>
    <IonContent color="light">
      <IonList v-if="forumData?.subforum.length" :inset="true">
        <IonListHeader>
          <IonLabel>子版块</IonLabel>
        </IonListHeader>
        <IonItem
          v-for="item in forumData?.subforum"
          :key="item.fid"
          :button="true"
          @click="handleToSub(item)"
        >
          {{ item.name }}
        </IonItem>
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
      <IonList v-if="forumData?.recommend.length" :inset="true">
        <IonListHeader>
          <IonLabel class="text-lg">推荐主题</IonLabel>
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
  import type { InfiniteScrollCustomEvent } from '@ionic/vue';
  import { chevronUpCircle, add, star } from 'ionicons/icons';
  import { useForumStore } from '@/stores/modules/forum';
  import { toastController } from '@ionic/vue';

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
  const router = useRouter();
  const fid = route.params.fid as string;
  const pages = ref(1);
  const loading = ref(false);
  const threadList = ref<Thread[]>([]);
  const forumStore = useForumStore();

  onMounted(async () => {
    getForumData();
    if (forumStore.prevTitle) {
      forumStore.setForumTitle(forumStore.prevTitle);
      forumStore.setPrevTitle('');
    }
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
        } else {
          notAllowedToast();
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
          threadList.value = [...threadList.value, ...data.thread];
        }
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  async function notAllowedToast() {
    const toast = await toastController.create({
      message: '您没有权限查看该板块',
      duration: 5000,
      position: 'bottom',
      buttons: [
        {
          text: '刷新',
          role: 'refresh',
          handler: () => {
            getForumData();
          },
        },
      ],
    });
    await toast.present();
  }

  const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    await loadMorePage();
    ev.target.complete();
  };

  const handleToSub = (item: Subforum) => {
    forumStore.setPrevTitle(forumData.value!.forumname);
    forumStore.setForumTitle(item.name);
    router.push({
      name: 'ForumView',
      params: {
        fid: item.fid,
      },
    });
  };
</script>
<style scoped></style>