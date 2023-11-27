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
          <IonButton
            v-if="item.floor === 1 && postData?.thread_price !== '0' && !postData?.thread_paid"
            @click="getPayInfo(item.pid)"
          >
            支付
          </IonButton>
          <div class="msg" @click="handleGetPayInfo" v-html="item.message"></div>
        </IonCardContent>
      </IonCard>
      <IonInfiniteScroll v-if="!loadDone" @ion-infinite="ionInfinite">
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>
      <IonModal :is-open="isOpen">
        <IonHeader>
          <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
            <IonButtons slot="start">
              <IonButton @click="isOpen = false">
                <IonIcon slot="icon-only" :icon="close" />
              </IonButton>
            </IonButtons>
            <IonTitle>购买主题</IonTitle>
            <IonButtons slot="end">
              <IonButton @click="handlePay">
                <IonIcon slot="icon-only" :icon="checkmark" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent color="light">
          <IonList :inset="true">
            <IonItem>
              <IonLabel>作者</IonLabel>
              <IonNote slot="end">{{ payInfoData.author }}</IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>售价(天使币)</IonLabel>
              <IonNote slot="end">{{ payInfoData.price }}</IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>作者所得(天使币)</IonLabel>
              <IonNote slot="end">{{ payInfoData.authorIncome }}</IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>购买后余额(天使币)</IonLabel>
              <IonNote slot="end">{{ payInfoData.balance }}</IonNote>
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { thread, payInfo, type PayParams, pay } from '@/api/forum';
  import { useSettingStore } from '@/stores/modules/setting';
  import { openUrl } from '@/utils';
  import { useForumStore } from '@/stores/modules/forum';
  import type { InfiniteScrollCustomEvent } from '@ionic/vue';
  import { onIonViewWillLeave, useBackButton } from '@ionic/vue';
  import { close, checkmark } from 'ionicons/icons';
  import Viewer from 'viewerjs';
  import 'viewerjs/dist/viewer.css';

  interface PostData {
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

  interface Postlist {
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

  interface PayInfoData {
    author: string;
    price: string;
    authorIncome: string;
    balance: string;
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
  const forumStore = useForumStore();
  const isOpen = ref(false);
  const payInfoData = ref<PayInfoData>({
    author: '',
    price: '',
    authorIncome: '',
    balance: '',
  });
  const payParams = ref<PayParams>({
    formhash: '',
    referer: '',
    tid: route.params.tid as string,
    paysubmit: 'true',
  });

  onMounted(() => {
    getThead();
  });
  onIonViewWillLeave(() => {
    destroyImgViewer();
  });
  onUnmounted(() => {
    forumStore.threadTitleUndo();
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

      if (data.status === 0) {
        if (page.value === 1) {
          forumStore.setThreadTitle(data.subject);
        }
        if (data.postlist.length < 10) {
          loadDone.value = true;
        }
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

  const handleGetPayInfo = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    console.log(target);

    if (target.tagName === 'A') {
      e.preventDefault();
      const url = new URL(target.getAttribute('href') as string);
      if (url.host === 'www.tsdm39.com') {
        // 暂不支持楼层直达
        if (url.searchParams.get('tid') || url.searchParams.get('ptid')) {
          router.push({
            name: 'Thread',
            params: {
              tid:
                (url.searchParams.get('tid') as string) || (url.searchParams.get('ptid') as string),
            },
          });
        } else if (url.searchParams.get('username')) {
          router.push({
            name: 'OtherUserInfo',
            params: {
              username: url.searchParams.get('username') as string,
            },
          });
        }
      } else {
        openUrl({ url: url.href });
      }
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

  const getPayInfo = async (pid: string) => {
    try {
      const res = await payInfo({
        tid: route.params.tid as string,
        pid,
      });
      const data = res.data;
      const html = new DOMParser().parseFromString(data, 'text/html');
      console.log(html);
      const td = html.querySelectorAll('td');
      payInfoData.value.author = td[0].textContent as string;
      payInfoData.value.price = td[1].textContent as string;
      payInfoData.value.authorIncome = td[2].textContent as string;
      payInfoData.value.balance = td[3].textContent as string;
      payParams.value.formhash = html.querySelector('input[name=formhash]')?.getAttribute('value')!;
      payParams.value.referer = `https://www.tsdm39.com/forum.php?mod=viewthread&tid=${route.params.tid}&mobile=yes`;
      isOpen.value = true;
    } catch (error) {
      console.error(error);
    }
  };

  const handlePay = async () => {
    try {
      const res = await pay(payParams.value);
      const data = res.data;
      const html = new DOMParser().parseFromString(data, 'text/html');
      console.log(html);
      isOpen.value = false;
      page.value = 1;
      postData.value = null;
      getThead();
    } catch (error) {
      console.error(error);
    }
  };
</script>

<style scoped>
  .msg :deep(.quote) {
    @apply p-1 border-l-4 border-[v-bind('theme.color')] bg-[v-bind('theme.bg')] rounded-md shadow-md backdrop-blur-sm;
  }
  .msg :deep(.quote blockquote) {
    @apply text-[#999999] pr-6;
  }
  .msg :deep(a) {
    @apply text-[--ion-color-primary];
  }
</style>
