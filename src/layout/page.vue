<template>
  <IonPage id="main-page">
    <IonHeader>
      <IonToolbar
        :color="settingStore.isDark ? undefined : 'primary'"
        class="!pt-[var(--safe-area-inset-top)]"
      >
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
            <IonSelectOption v-for="item in forumStore.groupList" :key="item.gid" :value="item.gid">
              {{ item.title }}
            </IonSelectOption>
          </IonSelect>
        </IonTitle>
        <IonTitle v-else-if="route.name === 'Thread'"> {{ forumStore.threadTitle }} </IonTitle>
        <IonTitle v-else> {{ title }} </IonTitle>
        <IonButtons v-if="route.name === 'ForumView'" slot="primary">
          <IonButton @click="popoverOpen">
            <IonIcon slot="icon-only" :icon="FilterIcon" />
          </IonButton>
          <IonPopover :is-open="popover" @did-dismiss="popover = false">
            <IonContent>
              <IonList lines="none">
                <IonListHeader>排序方式</IonListHeader>
                <IonItem button :color="setFilterColor('')" @click="setFilter('')">
                  默认排序
                </IonItem>
                <IonItem button :color="setFilterColor('dateline')" @click="setFilter('dateline')">
                  主题发布时间
                </IonItem>
                <IonItem button :color="setFilterColor('lastpost')" @click="setFilter('lastpost')">
                  最后回复时间
                </IonItem>
                <IonItem button :color="setFilterColor('views')" @click="setFilter('views')">
                  主题查看数
                </IonItem>
                <IonItem button :color="setFilterColor('replies')" @click="setFilter('replies')">
                  主题回复数
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
          <IonButton id="popover-button">
            <IonIcon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical" />
          </IonButton>
          <IonPopover trigger="popover-button">
            <IonContent>
              <IonList lines="none">
                <IonItem
                  button
                  :detail="false"
                  @click="
                    openUrl({
                      url: `${baseUrl}/forum.php?mod=forumdisplay&fid=${route.params.fid}`,
                    })
                  "
                >
                  转到浏览器
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
        </IonButtons>
        <IonButtons v-if="route.name === 'Thread'" slot="primary">
          <IonButton id="thread-button">
            <IonIcon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical" />
          </IonButton>
          <IonPopover trigger="thread-button">
            <IonContent>
              <IonList lines="none">
                <IonItem
                  button
                  :detail="false"
                  @click="
                    openUrl({
                      url: `${baseUrl}/forum.php?mod=viewthread&tid=${route.params.tid}`,
                    })
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
  import { /*getStorage,*/ openUrl } from '@/utils';
  import { useForumStore } from '@/stores/modules/forum';
  import { ellipsisHorizontal, ellipsisVertical, filter as FilterIcon } from 'ionicons/icons';
  import { threadFilterKey } from '@/utils/provideInjectType';
  import { baseUrl } from '@/utils/config';
  import { useSettingStore } from '@/stores/modules/setting';

  // interface Group {
  //   gid: number;
  //   title: string;
  // }

  defineOptions({
    name: 'PageLayout',
  });

  const title = ref('天使动漫论坛');
  const route = useRoute();
  // const groupList = ref<Group[]>([]);
  const gidRef = ref(0);
  const forumStore = useForumStore();
  const filter = ref('');
  const popover = ref(false);
  const settingStore = useSettingStore();

  provide(threadFilterKey, {
    filter,
  });

  watch(
    route,
    async (val) => {
      if (val.name === 'Forum') {
        const gid = val.params.gid as string;
        gidRef.value = Number(gid);
        // const groupListStorage = await getStorage('groupList');
        // if (groupListStorage) {
        //   groupList.value = groupListStorage;
        const group = forumStore.groupList.find((item: any) => item.gid === Number(gid));
        if (group) {
          title.value = group.title;
        }
        // }
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

  async function setFilter(filters: string) {
    filter.value = filters;
    popover.value = false;
  }

  const popoverOpen = () => {
    popover.value = true;
  };

  const setFilterColor = (filters: string) => {
    if (filter.value === filters) {
      if (settingStore.isDark) {
        return 'medium';
      } else {
        return 'primary';
      }
    }
  };
</script>

<style scoped>
  ion-select::part(icon) {
    color: white;
  }
</style>
