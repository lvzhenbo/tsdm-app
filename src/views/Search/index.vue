<template>
  <IonPage>
    <IonContent color="light">
      <IonList v-if="searchData?.results.length" lines="none">
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
  const loadDone = ref(false);

  onMounted(() => {
    searchParams.value = { ...searchParams.value, ...route.query };
    handleSearch();
  });

  const handleSearch = async () => {
    try {
      const res = await search(searchParams.value);
      if (res.data) {
        const data = JSON.parse(res.data);
        // console.log(data);
        const totalPage = Math.ceil(data.total / data.page_size);
        if (page.value === 1) {
          searchData.value = data;
        } else {
          searchData.value?.results.push(...data.results);
        }
        page.value += 1;
        searchParams.value.page = page.value.toString();
        if (page.value > totalPage) {
          loadDone.value = true;
        }
      }
    } catch (error) {
      console.error(error);
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
