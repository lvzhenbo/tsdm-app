<template>
  <IonPage>
    <IonContent>
      <IonCard v-for="item in postData?.postlist" :key="item.pid">
        <IonCardContent :class="settingStore.isDark ? 'text-white' : 'text-black'">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="item.message"> </div>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { thread } from '@/api/forum';
  import { useSettingStore } from '@/stores/modules/setting';

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

  onMounted(() => {
    getThead();
  });

  const getThead = async () => {
    try {
      const res = await thread({
        tid: route.params.tid as string,
        page: page.value.toString(),
      });

      // console.log(res);

      const data = JSON.parse(res.data.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));

      console.log(data);

      postData.value = data;
    } catch (error) {
      console.error(error);
    }
  };
</script>

<style scoped></style>
