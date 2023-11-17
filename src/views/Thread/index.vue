<template>
  <IonPage>
    <IonContent color="light">
      <IonCard v-for="item in postData?.postlist" :key="item.pid">
        <IonCardHeader>
          <div class="flex items-center">
            <IonAvatar class="w-12 h-12 min-w-0">
              <IonImg :src="item.avatar" />
            </IonAvatar>
            <div class="ml-1 min-w-0">
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
          <div class="msg" v-html="item.message"> </div>
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
  const settingStore = useSettingStore();
  const page = ref(1);
  const postData = ref<PostData | null>(null);
  const loadDone = ref(false);

  onMounted(() => {
    getThead();
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
      page.value++;
    } catch (error) {
      console.error(error);
    }
  };

  const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    await getThead();
    ev.target.complete();
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
