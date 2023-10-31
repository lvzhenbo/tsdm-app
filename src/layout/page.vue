<template>
  <IonPage id="main-page">
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <IonButtons slot="start">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        <IonTitle v-if="route.name === 'Forum'">
          <IonSelect
            aria-label="Fruit"
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
          <IonButton id="popover-button">
            <IonIcon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical" />
          </IonButton>
          <IonPopover trigger="popover-button">
            <IonContent>
              <IonList lines="none">
                <IonItem
                  :button="true"
                  :detail="false"
                  @click="
                    async () => {
                      await Browser.open({ url: 'https://ionicframework.com/' });
                    }
                  "
                >
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
  import { getStorage } from '@/utils';
  import { useForumStore } from '@/stores/modules/forum';
  import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
  import { Browser } from '@capacitor/browser';

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
</script>

<style scoped>
  ion-select::part(icon) {
    color: white;
  }
</style>
