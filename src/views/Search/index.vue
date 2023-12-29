<template>
  <IonPage>
    <IonContent color="light">
      <div v-if="loading" class="flex justify-center h-full items-center">
        <IonSpinner name="circular"></IonSpinner>
      </div>
      <h2 v-if="noResult" class="flex justify-center items-center h-40 text-xl text-slate-500"
        >没有搜索结果
      </h2>
      <IonList v-if="searchData?.results != undefined && searchData?.results.length" lines="none">
        <IonItem
          v-for="(item, index) in searchData.results"
          :key="item.thread_id"
          button
          :class="index % 2 === 0 ? 'cusitem' : ''"
          @click="handleToThread(item)"
        >
          <IonLabel>
            {{ item.title }}
            <div class="flex justify-between">
              <IonNote>{{ item.author_name }}</IonNote>
              <IonNote>{{ item.forum_name }}</IonNote>
            </div>
          </IonLabel>
        </IonItem>
      </IonList>
      <IonInfiniteScroll v-if="!loadDone" @ion-infinite="ionInfinite">
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { search, type SearchParams } from '@/api/forum';
  import { useSettingStore } from '@/stores/modules/setting';
  import type { InfiniteScrollCustomEvent } from '@ionic/vue';

  interface SearchData {
    keywords: string;
    total: number;
    page_size: number;
    results: Result[];
  }

  interface Result {
    title: string;
    forum_id: number;
    forum_name: string;
    timestamp: number;
    author_id: number;
    author_name: string;
    thread_id: number;
  }

  defineOptions({
    name: 'SearchIndex',
  });

  const route = useRoute();
  const router = useRouter();
  const page = ref(1);
  const searchParams = ref<SearchParams>({
    query: '',
    page: '1',
  });
  const searchData = ref<SearchData>();
  const settingStore = useSettingStore();
  const theme = computed(() => {
    if (settingStore.isDark) {
      return {
        bg: '#121212',
      };
    } else {
      return {
        bg: '#f8f8f8',
      };
    }
  });
  const loading = ref(false);
  const loadDone = ref(false);
  const noResult = ref(false);

  onMounted(() => {
    searchParams.value = { ...searchParams.value, ...route.query };
    handleSearch();
  });

  const handleSearch = async () => {
    try {
      loading.value = true;
      const res = await search(searchParams.value);
      if (res.data) {
        const data = JSON.parse(res.data);
        const totalPage = Math.ceil(data.total / data.page_size);
        if (page.value === 1) {
          searchData.value = data;
        } else {
          searchData.value?.results.push(...data.results);
        }
        if (searchData.value?.total === 0) {
          loading.value = false;
          noResult.value = true;
          loadDone.value = true;
          return;
        }
        page.value += 1;
        searchParams.value.page = page.value.toString();
        if (page.value > totalPage) {
          loadDone.value = true;
        }
      }
      loading.value = false;
    } catch (error) {
      console.log(error);
    }
  };

  const handleToThread = (item: Result) => {
    router.push({
      name: 'Thread',
      params: {
        tid: item.thread_id,
      },
    });
  };

  const ionInfinite = async (ev: InfiniteScrollCustomEvent) => {
    await handleSearch();
    ev.target.complete();
  };
</script>

<style scoped>
  .cusitem {
    --background: v-bind(theme.bg);
  }
</style>
