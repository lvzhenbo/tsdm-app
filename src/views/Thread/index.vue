<template>
  <IonPage>
    <IonContent color="light">
      <IonCard v-for="item in postData?.postlist" :key="item.pid">
        <IonCardHeader>
          <div class="flex items-center">
            <IonAvatar class="w-12 h-12">
              <IonImg :src="item.avatar" />
            </IonAvatar>
            <div class="ml-3 min-w-0 flex-1">
              <div class="truncate mb-1">
                <span :class="settingStore.isDark ? 'text-white' : 'text-black'">
                  {{ item.author }}
                </span>
                <span v-if="item.author_nickname"> | {{ item.author_nickname }} </span>
              </div>
              <div v-html="item.authortitle"></div>
            </div>
          </div>
        </IonCardHeader>
        <IonCardContent :class="settingStore.isDark ? 'text-white' : 'text-black'">
          <div class="msg" @click="handleClick" v-html="item.message"></div>
        </IonCardContent>
      </IonCard>
      <IonInfiniteScroll v-if="!loadDone" @ion-infinite="ionInfinite">
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { thread } from '@/api/forum';
  import { useSettingStore } from '@/stores/modules/setting';
  import type { InfiniteScrollCustomEvent } from '@ionic/vue';
  import { openUrl } from '@/utils';
  import Viewer from 'viewerjs';
  import 'viewerjs/dist/viewer.css';
  import { onIonViewWillLeave, useBackButton } from '@ionic/vue';

  export interface PostData {
    status: number;
    postlist: Postlist[];
    totalpost: string;
    tpp: string;
    subject: string;
    fid: string;
    thread_author: string;
    thread_authorid: number;
    ismoderator: number;
    extcreditsname: { [key: string]: string };
    thread_price: string;
    thread_paid: number;
  }

  export interface Postlist {
    pid: string;
    author: string;
    authorid: string;
    avatar: string;
    timestamp: string;
    subject: string;
    message: string;
    first: string;
    floor: number;
    platform: number;
    authortitle: string;
    authorgid: string;
    ratelog: any[];
    ratelogextcredits: any[];
    author_nickname: string;
  }

  defineOptions({
    name: 'ThreadIndex',
  });

  const route = useRoute();
  const router = useRouter();
  const settingStore = useSettingStore();
  const page = ref(1);
  const postData = ref<PostData | null>(null);
  const loadDone = ref(false);
  const viewer = ref<Viewer[]>([]);
  const isShow = ref(false);

  onMounted(() => {
    getThead();
  });
  onIonViewWillLeave(() => {
    destroyImgViewer();
  });

  useBackButton(10, (processNextHandler) => {
    if (isShow.value) {
      hideImgViewer();
    } else {
      processNextHandler();
    }
  });

  const theme = computed(() => {
    if (settingStore.isDark) {
      return {
        color: '#374151',
        bg: '#030712',
      };
    } else {
      return {
        color: '#d1d5db',
        bg: '#f3f4f6',
      };
    }
  });

  const getThead = async () => {
    try {
      const res = await thread({
        tid: route.params.tid as string,
        page: page.value.toString(),
      });

      // console.log(res);

      const data = JSON.parse(
        res.data.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t'),
      );

      console.log(data);

      if (data.postlist.length < 10) {
        loadDone.value = true;
      }

      if (data.status === 0) {
        if (postData.value) {
          postData.value.postlist.push(...data.postlist);
        } else {
          postData.value = data;
        }
      }
      nextTick(() => {
        destroyImgViewer();
        viewer.value = [];
        document.querySelectorAll('.msg').forEach((item) => {
          viewer.value.push(
            new Viewer(item as HTMLElement, {
              toolbar: false,
              keyboard: false,
              url(image: HTMLImageElement) {
                return image.src;
              },
              show() {
                isShow.value = true;
              },
              hide() {
                isShow.value = false;
              },
            }),
          );
        });
      });
      page.value++;
    } catch (error) {
      console.error(error);
    }
  };

  const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    await getThead();
    ev.target.complete();
  };

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    console.log(target);

    if (target.tagName === 'A') {
      e.preventDefault();
      const url = new URL(target.getAttribute('href') as string);
      if (url.host === 'www.tsdm39.com') {
        if (url.searchParams.get('tid')) {
          router.push({
            name: 'Thread',
            params: {
              tid: url.searchParams.get('tid') as string,
            },
          });
        }
      } else {
        openUrl({ url: url.href });
      }

      // const href = target.getAttribute('href');
      // if (href) {
      //   window.open(href, '_blank');
      // }
    }
  };
  const destroyImgViewer = () => {
    viewer.value.forEach((item) => {
      item.destroy();
    });
  };
  const hideImgViewer = () => {
    viewer.value.forEach((item) => {
      item.hide();
    });
  };
</script>

<style scoped>
  .msg :deep(.quote) {
    @apply p-1 border-l-4 border-[v-bind('theme.color')] bg-[v-bind('theme.bg')] rounded-md shadow-md backdrop-blur-sm;
  }
  .msg :deep(.quote blockquote) {
    @apply text-[#999999] pr-6;
  }
</style>
