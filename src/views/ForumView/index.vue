<template>
  <IonPage>
    <IonContent ref="contentRef" color="light">
      <IonRefresher slot="fixed" @ion-refresh="handleRefresh($event)">
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <IonList v-if="listView && forumData?.subforum.length != 0" :inset="true" lines="none">
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
      <div v-if="listView && forumData?.threadtype.length != 0" class="px-4 mt-3">
        <IonChip :color="chipTypeID === -1 ? 'primary' : ''" @click="handleChipFilterReset">
          全部
        </IonChip>
        <IonChip
          v-for="item in forumData?.threadtype"
          :key="item.typeid"
          :color="chipTypeID === item.typeid ? 'primary' : ''"
          @click="handleChipFilter(item)"
        >
          {{ item.name }}
        </IonChip>
      </div>
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
      <IonList v-if="recommend && forumData?.recommend.length != 0" :inset="true">
        <IonListHeader>
          <IonLabel class="text-lg">推荐主题</IonLabel>
        </IonListHeader>
        <IonItem
          v-for="item in forumData?.recommend"
          :key="item.tid"
          :button="true"
          @click="handleToThread(item)"
        >
          <IonLabel> {{ item.title }} <br /> </IonLabel>
        </IonItem>
      </IonList>
      <IonList v-if="listView" lines="none" :inset="true">
        <IonItem
          v-for="item in threadList"
          :key="item.tid"
          :button="true"
          @click="handleToThread(item)"
        >
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
          <IonIcon :icon="grid" />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton color="secondary" @click="contentRef?.$el.scrollToTop(500)">
            <IonIcon :icon="arrowUp"></IonIcon>
          </IonFabButton>
          <IonFabButton id="open-modal" color="danger">
            <IonIcon :icon="people"></IonIcon>
          </IonFabButton>
          <IonFabButton color="warning">
            <IonIcon :icon="star"></IonIcon>
          </IonFabButton>
          <IonFabButton color="primary">
            <IonIcon :icon="add"></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonContent>
    <IonModal id="dialog-modal" ref="modalRef" trigger="open-modal">
      <div class="mb-2.5">
        <IonList>
          <IonListHeader>
            <IonLabel class="text-base">版主列表</IonLabel>
          </IonListHeader>
          <IonItem
            v-for="item in forumData?.moderator"
            :key="item.uid"
            button
            @click="handleToOtherUserInfo(item)"
          >
            <IonLabel>{{ item.username }}</IonLabel>
          </IonItem>
        </IonList>
      </div>
    </IonModal>
  </IonPage>
</template>
<script setup lang="ts">
  import { forumView } from '@/api/forum';
  import type {
    RefresherCustomEvent,
    InfiniteScrollCustomEvent,
    IonContent,
    IonModal,
  } from '@ionic/vue';
  import { arrowUp, add, star, grid, people } from 'ionicons/icons';
  import { useForumStore } from '@/stores/modules/forum';
  import { toastController } from '@ionic/vue';
  import { threadFilterKey, type ThreadFilterValue } from '#/provideInject.d';

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
  const recommend = ref(false);
  const listView = ref(false);
  const threadList = ref<Thread[]>([]);
  const forumStore = useForumStore();
  const toast = ref<null | HTMLIonToastElement>(null);
  const contentRef = ref<null | InstanceType<typeof IonContent>>(null);
  const modalRef = ref<null | InstanceType<typeof IonModal>>(null);
  const { filter } = inject(threadFilterKey) as ThreadFilterValue;
  const chipFilter = ref('');
  const chipTypeID = ref(-1);

  onMounted(async () => {
    getForumData();
    if (forumStore.prevTitle) {
      forumStore.setForumTitle(forumStore.prevTitle);
      forumStore.setPrevTitle('');
    }
  });
  onUnmounted(() => {
    if (toast.value) {
      toast.value.dismiss();
    }
  });
  watch(
    () => filter.value,
    () => {
      getForumData();
    },
  );

  async function getForumData() {
    try {
      listView.value = false;
      recommend.value = false;
      loading.value = true;
      const res = await forumView(
        fid,
        String(pages.value),
        filter.value,
        chipFilter.value,
        chipTypeID.value === -1 ? '' : String(chipTypeID.value),
      );
      if (res.data) {
        const data = JSON.parse(res.data.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
        if (data.status === 0) {
          forumData.value = data;
          threadList.value = data.thread;
        } else {
          notAllowedToast();
        }
      }
      loading.value = false;
      listView.value = true;
      recommend.value = true;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }
  async function loadMorePage() {
    try {
      const nextPage = pages.value + 1;
      const res = await forumView(
        fid,
        String(nextPage),
        filter.value,
        chipFilter.value,
        chipTypeID.value === -1 ? '' : String(chipTypeID.value),
      );
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          threadList.value = [...threadList.value, ...data.thread];
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function notAllowedToast() {
    toast.value = await toastController.create({
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
    await toast.value.present();
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

  const handleToThread = (item: Thread | Recommend) => {
    forumStore.setThreadTitle(item.title);
    router.push({
      name: 'Thread',
      params: {
        tid: item.tid,
      },
    });
  };

  const handleToOtherUserInfo = (item: Moderator) => {
    modalRef.value?.$el.dismiss(null, 'comfirm');
    router.push({
      name: 'OtherUserInfo',
      params: {
        username: item.username,
      },
    });
  };
  const handleRefresh = async (event: RefresherCustomEvent) => {
    await getForumData();
    event.target.complete();
  };
  const handleChipFilter = (item: Threadtype) => {
    chipFilter.value = 'typeid';
    chipTypeID.value = item.typeid;
    getForumData();
  };
  const handleChipFilterReset = () => {
    chipFilter.value = '';
    chipTypeID.value = -1;
    getForumData();
  };
</script>
<style scoped>
  ion-modal#dialog-modal {
    --width: fit-content;
    --min-width: 300px;
    --height: fit-content;
    --border-radius: 6px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  }
</style>
