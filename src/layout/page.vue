<template>
  <IonPage id="main-page">
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle v-if="route.name === 'Forum'">
          <IonSelect
            interface="popover"
            placeholder="Select fruit"
            :value="gidRef"
            @ion-change="(e) => $router.replace(`/forum/${e.detail.value}`)"
          >
            <IonSelectOption v-for="item in groupList" :key="item.gid" :value="item.gid">
              {{ item.title }}
            </IonSelectOption>
          </IonSelect>
        </IonTitle>
        <IonTitle v-else> {{ title }} </IonTitle>
        <IonButtons v-if="route.name === 'ForumView'" slot="primary">
          <IonButton @click="popoverOpen">
            <IonIcon slot="icon-only" :ios="filterCircle" :md="filterCircle" />
          </IonButton>
          <IonPopover :is-open="popover" @did-dismiss="popover = false">
            <IonContent>
              <IonList lines="none">
                <IonListHeader>排序方式</IonListHeader>
                <IonItem button @click="setFilter('')">默认排序</IonItem>
                <IonItem button @click="setFilter('dateline')">主题发布时间</IonItem>
                <IonItem button @click="setFilter('lastpost')">最后回复时间</IonItem>
                <IonItem button @click="setFilter('views')">主题查看数</IonItem>
                <IonItem button @click="setFilter('replies')">主题回复数</IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
          <IonButton id="popover-button">
            <IonIcon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical" />
          </IonButton>
          <IonPopover trigger="popover-button">
            <IonContent>
              <IonList lines="none">
                <IonItem button :detail="false" @click="openUrl({ url: 'https://www.tsdm39.com' })">
                  转到浏览器
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonRouterOutlet />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { getStorage, openUrl } from '@/utils';
  import { useForumStore } from '@/stores/modules/forum';
  import { ellipsisHorizontal, ellipsisVertical, filterCircle } from 'ionicons/icons';
  import { threadFilterKey } from '#/provideInject.d';

  interface Group {
    gid: number;
    title: string;
  }

  defineOptions({
    name: 'PageLayout',
  });

  const title = ref('天使动漫论坛');
  const route = useRoute();
  const groupList = ref<Group[]>([]);
  const gidRef = ref(0);
  const forumStore = useForumStore();
  const filter = ref('');
  const popover = ref(false);

  provide(threadFilterKey, {
    filter,
  });

  watch(
    route,
    async (val) => {
      if (val.name === 'Forum') {
        const gid = val.params.gid as string;
        gidRef.value = Number(gid);
        const groupListStorage = await getStorage('groupList');
        if (groupListStorage) {
          groupList.value = groupListStorage;
          const group = groupListStorage.find((item: any) => item.gid === Number(gid));
          if (group) {
            title.value = group.title;
          }
        }
      } else if (val.name === 'ForumView') {
        title.value = forumStore.forumTitle;
      } else if (val.name === 'Thread') {
        title.value = forumStore.threadTitle;
      } else if (val.meta.title) {
        title.value = val.meta.title as string;
      } else {
        title.value = '天使动漫论坛';
      }
    },
    {
      immediate: true,
    },
  );

  async function setFilter(filters: string) {
    filter.value = filters;
    popover.value = false;
  }

  const popoverOpen = () => {
    popover.value = true;
  };
</script>

<style scoped>
  ion-select::part(icon) {
    color: white;
  }
</style>
