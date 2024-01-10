<template>
  <IonPage>
    <IonContent ref="contentRef" color="light">
      <IonRefresher slot="fixed" @ion-refresh="handleRefresh($event)">
        <IonRefresherContent />
      </IonRefresher>
      <div v-if="loading">
        <IonCard v-for="i in 4" :key="i">
          <IonCardHeader>
            <div class="flex items-center">
              <IonAvatar class="w-12 h-12">
                <IonSkeletonText :animated="true" />
              </IonAvatar>
              <div class="ml-3 min-w-0 flex-1">
                <div class="truncate mb-1">
                  <IonSkeletonText :animated="true" class="w-24" />
                </div>
                <div>
                  <IonSkeletonText :animated="true" class="w-20" />
                </div>
              </div>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonSkeletonText :animated="true" />
            <IonSkeletonText :animated="true" />
            <IonSkeletonText :animated="true" />
            <IonSkeletonText :animated="true" />
          </IonCardContent>
        </IonCard>
      </div>
      <div v-else>
        <IonCard v-for="item in postData?.postlist" :key="item.pid">
          <IonCardHeader>
            <div class="flex items-center">
              <IonAvatar class="w-12 h-12">
                <IonImg :src="item.avatar" @ion-error="$event.target.src = Avatar" />
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
              class="flex"
              @click="getPayInfo(item.pid)"
            >
              支付
            </IonButton>
            <div class="msg mt-4" @click="handleClick" v-html="item.message"></div>
            <div v-if="item.ratelog.length">
              <div class="border-t my-1"></div>
              <div>
                <div v-for="rateItem in item.ratelog" :key="rateItem.uid" class="my-1">
                  <div>
                    <IonText color="secondary">
                      {{ rateItem.username }}
                    </IonText>
                    <span v-if="rateItem.reason"> 「{{ rateItem.reason }}」 </span>
                  </div>
                  <div class="flex">
                    <div v-for="scoreItem in rateItem.score" :key="scoreItem" class="mx-1">
                      <IonText color="medium">
                        {{
                          postData?.extcreditsname[Number(scoreItem.split(':')[0])] +
                          '+' +
                          scoreItem.split(':')[1]
                        }}
                      </IonText>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center">
                <div
                  v-for="ratelogextcredit in item.ratelogextcredits"
                  :key="ratelogextcredit"
                  class="mx-1"
                >
                  {{
                    postData?.extcreditsname[Number(ratelogextcredit.split(':')[0])] +
                    '+' +
                    ratelogextcredit.split(':')[1]
                  }}
                </div>
              </div>
            </div>
          </IonCardContent>
          <div class="flex items-center justify-end">
            <div>{{ dateFormat(item.timestamp) }}</div>
            <div class="ml-3 mr-1 text-[--ion-color-primary]">{{ '#' + item.floor }}</div>
            <div>
              <IonButton :id="`pid-${item.pid}`" fill="clear" size="small">
                <IonIcon slot="icon-only" :icon="ellipsisHorizontal" />
              </IonButton>
              <IonPopover :trigger="`pid-${item.pid}`">
                <IonContent>
                  <IonList lines="none">
                    <IonItem button :detail="false"> 回复 </IonItem>
                    <IonItem button :detail="false" @click="openRateModal(item)"> 评分 </IonItem>
                  </IonList>
                </IonContent>
              </IonPopover>
            </div>
          </div>
        </IonCard>
        <IonInfiniteScroll v-if="!loadDone" @ion-infinite="ionInfinite">
          <IonInfiniteScrollContent />
        </IonInfiniteScroll>
      </div>
      <IonFab v-if="fabVisible" slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon :icon="grid" />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton color="secondary" @click="contentRef?.$el.scrollToTop(500)">
            <IonIcon :icon="arrowUp"></IonIcon>
          </IonFabButton>
          <IonFabButton color="primary">
            <IonIcon :icon="add"></IonIcon>
          </IonFabButton>
          <IonFabButton color="tertiary" @click="refresh">
            <IonIcon :icon="refreshOutline"></IonIcon>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonContent>
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
    <RateModal :is-open="rateVisible" :pid="pid" @close="closeRateModal" />
  </IonPage>
</template>

<script setup lang="ts">
  import { thread, payInfo, type PayParams, pay } from '@/api/forum';
  import { useSettingStore } from '@/stores/modules/setting';
  import { openUrl } from '@/utils';
  import { useForumStore } from '@/stores/modules/forum';
  import type { InfiniteScrollCustomEvent, RefresherCustomEvent } from '@ionic/vue';
  import {
    onIonViewWillLeave,
    useBackButton,
    alertController,
    loadingController,
    IonContent,
  } from '@ionic/vue';
  import {
    close,
    checkmark,
    ellipsisHorizontal,
    arrowUp,
    add,
    grid,
    refreshOutline,
  } from 'ionicons/icons';
  import { destr } from 'destr';
  import Viewer from 'viewerjs';
  import 'viewerjs/dist/viewer.css';
  import Avatar from '@/assets/svg/Avatar.svg';
  import { format } from 'date-fns';
  import { zhCN } from 'date-fns/locale';
  import { baseUrl } from '@/utils/config';
  import RateModal from './components/rateModal.vue';

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
    ratelog: Ratelog[];
    ratelogextcredits: any[];
    author_nickname: string;
  }

  interface Ratelog {
    uid: number;
    username: string;
    status: number;
    score: string[];
    reason: string;
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
  const forumStore = useForumStore();
  const contentRef = ref<null | InstanceType<typeof IonContent>>(null);

  const isOpen = ref(false);
  const fabVisible = ref(false);
  const rateVisible = ref(false);
  const pid = ref('');

  const loading = ref(false);
  const loadDone = ref(false);
  const page = ref(1);
  const postData = ref<PostData | null>(null);

  const viewer = ref<Viewer[]>([]);
  const isPicShow = ref(false);

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
    if (isPicShow.value) {
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

  // 获取帖子
  const getThead = async () => {
    try {
      if (page.value === 1) {
        loading.value = true;
        fabVisible.value = false;
      }
      const res = await thread({
        tid: route.params.tid as string,
        page: page.value.toString(),
      });

      // console.log(res);

      const data = JSON.parse(
        res.data
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          // eslint-disable-next-line no-control-regex
          .replace(/\u0000/g, '')
          // eslint-disable-next-line no-control-regex
          .replace(/\u0014/g, '\\u0014'),
      );

      console.log(data);

      if (data.status === 0) {
        if (page.value === 1) {
          forumStore.setThreadTitle(data.subject);
          fabVisible.value = true;
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
                isPicShow.value = true;
              },
              hide() {
                isPicShow.value = false;
              },
            }),
          );
        });
      });
      page.value++;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  };

  // 上拉加载
  const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    await getThead();
    ev.target.complete();
  };

  const refresh = async () => {
    page.value = 1;
    postData.value = null;
    loadDone.value = false;
    await getThead();
  };

  // 下拉刷新
  const handleRefresh = async (event: RefresherCustomEvent) => {
    await refresh();
    event.target.complete();
  };

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    console.log(target);

    // 处理链接
    function handleUrl(target: Element, e: Event) {
      e.preventDefault();
      const url = new URL(target.getAttribute('href') as string);
      if (url.host === new URL(baseUrl).host) {
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

    // 递归查找父元素是否为a标签
    function findParentLink(element: Element) {
      if (element.tagName === 'A') {
        return element;
      } else if (element.parentElement) {
        return findParentLink(element.parentElement);
      } else {
        return null;
      }
    }

    if (target.tagName === 'A') {
      handleUrl(target, e);
    } else {
      const link = findParentLink(target);
      if (link) {
        handleUrl(link, e);
      }
    }
  };

  // 销毁图片查看器
  const destroyImgViewer = () => {
    viewer.value.forEach((item) => {
      item.destroy();
    });
  };

  // 隐藏图片查看器
  const hideImgViewer = () => {
    viewer.value.forEach((item) => {
      item.hide();
    });
  };

  // 时间格式化
  const dateFormat = (date: string) => {
    date = date.padEnd(13, '0');
    return format(new Date(Number(date)), 'PPP HH:mm', {
      locale: zhCN,
    });
  };

  // 获取支付信息
  const getPayInfo = async (pid: string) => {
    const loading = await loadingController.create({
      message: '加载中...',
    });
    try {
      await loading.present();
      const res = await payInfo({
        tid: route.params.tid as string,
        pid,
      });
      const data = res.data;
      const result = destr(data);
      if (typeof result !== 'string') {
        await loading.dismiss();
        coinNotEnough();
      }
      const html = new DOMParser().parseFromString(data, 'text/html');
      console.log(html);
      const td = html.querySelectorAll('td');
      payInfoData.value.author = td[0].textContent as string;
      payInfoData.value.price = td[1].textContent as string;
      payInfoData.value.authorIncome = td[2].textContent as string;
      payInfoData.value.balance = td[3].textContent as string;
      payParams.value.formhash = html.querySelector('input[name=formhash]')?.getAttribute('value')!;
      payParams.value.referer = `${baseUrl}/forum.php?mod=viewthread&tid=${route.params.tid}&mobile=yes`;
      await loading.dismiss();
      isOpen.value = true;
    } catch (error) {
      console.error(error);
    }
  };

  // 支付
  const handlePay = async () => {
    try {
      const loading = await loadingController.create({
        message: '支付中...',
      });
      await loading.present();
      const res = await pay(payParams.value);
      const data = res.data;
      const html = new DOMParser().parseFromString(data, 'text/html');
      console.log(html);
      await loading.dismiss();
      const alert = await alertController.create({
        header: '提示',
        message: '购买成功',
        buttons: [
          {
            text: '确定',
            role: 'cancel',
            handler: () => {
              isOpen.value = false;
              page.value = 1;
              postData.value = null;
              getThead();
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      console.error(error);
    }
  };

  // 天使币不足
  const coinNotEnough = async () => {
    const alert = await alertController.create({
      header: '错误',
      message: '天使币不足',
      buttons: [
        {
          text: '确定',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  };

  const openRateModal = (item: Postlist) => {
    pid.value = item.pid;
    rateVisible.value = true;
  };

  const closeRateModal = (rateBool: boolean) => {
    rateVisible.value = rateBool;
  };
</script>

<style scoped>
  ion-skeleton-text {
    --border-radius: 9999px;
  }
  .msg {
    @apply select-auto;
  }
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
