<template>
  <IonPage>
    <IonContent>
      <IonCard>
        <IonCardHeader class="flex flex-row items-center justify-between">
          <IonCardTitle>论坛分区</IonCardTitle>
          <IonIcon
            v-if="!reload"
            color="primary"
            :icon="reloadOutline"
            class="text-2xl"
            @click="getForumGroup"
          />
          <IonSpinner v-else class="w-6 h-6" color="primary" />
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol v-for="item in groupList" :key="item.gid" size="6">
                <div
                  class="ion-activatable text-center rounded relative overflow-hidden leading-9 cursor-pointer"
                  :class="settingStore.isDark ? 'text-white' : 'text-black'"
                  @click="() => $router.push(`/forum/${item.gid}`)"
                >
                  {{ item.title }}
                  <IonRippleEffect />
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { forumGroup } from '@/api/forum';
  import { setStorage, getStorage } from '@/utils';
  import { reloadOutline } from 'ionicons/icons';
  import { useSettingStore } from '@/stores/modules/setting';

  interface Group {
    gid: number;
    title: string;
  }

  defineOptions({
    name: 'HomeIndex',
  });

  const groupList = ref<Group[]>([]);
  const reload = ref(false);
  const settingStore = useSettingStore();

  onMounted(async () => {
    const groupListStorage = await getStorage('groupList');
    if (groupListStorage) {
      groupList.value = groupListStorage;
    }
    getForumGroup();
  });

  async function getForumGroup() {
    try {
      reload.value = true;
      const res = await forumGroup();
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          groupList.value = data.group;
          setStorage('groupList', data.group);
        }
      }
      reload.value = false;
    } catch (error) {
      reload.value = false;
      console.error(error);
    }
  }
</script>

<style scoped></style>
