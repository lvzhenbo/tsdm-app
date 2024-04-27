<template>
  <IonPage>
    <IonHeader>
      <IonToolbar
        :color="settingStore.isDark ? undefined : 'primary'"
        class="!pt-[var(--safe-area-inset-top)]"
      >
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle> 通知 </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="light">
      <var-loading description="加载中" :loading="loading" class="h-full">
        <IonSegment value="notification" @ion-change="segmentChange">
          <IonSegmentButton value="notification">
            <IonLabel>提醒</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="private">
            <IonLabel>私人消息</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="public">
            <IonLabel>公共消息</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <div v-show="selectSegment === 'notification'">
          <div> 暂时没有可用数据结构 </div>
        </div>
        <div v-show="selectSegment === 'private'">
          <IonList>
            <IonItem v-for="item in privateList" :key="item.plid" button>
              <div slot="start" class="w-2.5">
                <div
                  v-if="!item.read"
                  class="bg-[var(--ion-color-primary)] w-2.5 h-2.5 rounded-full"
                ></div>
              </div>
              <IonLabel>
                <div>
                  <IonText color="primary"> 私人消息 </IonText>
                  <ion-note> {{ timeFormat(item.timestamp) }} </ion-note>
                </div>
                <IonNote color="dark">
                  {{
                    item.send ? `您对 ${item.peer_username} 说：` : `${item.peer_username} 对您说：`
                  }}
                  {{ item.message }}
                </IonNote>
              </IonLabel>
            </IonItem>
          </IonList>
        </div>
        <div v-show="selectSegment === 'public'">
          <IonList>
            <IonItem v-for="item in publicList" :key="item.pmid" button>
              <div slot="start" class="w-2.5">
                <div
                  v-if="!item.read"
                  class="bg-[var(--ion-color-primary)] w-2.5 h-2.5 rounded-full"
                ></div>
              </div>
              <IonLabel>
                <div>
                  <IonText color="primary"> 公共消息 </IonText>
                  <ion-note> {{ timeFormat(item.timestamp) }} </ion-note>
                </div>
                <IonNote color="dark"> {{ item.preview }} </IonNote>
              </IonLabel>
            </IonItem>
          </IonList>
        </div>
      </var-loading>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/stores/modules/setting';
  import { notification } from '@/api/forum';
  import { onIonViewWillEnter, type SegmentCustomEvent } from '@ionic/vue';
  import { format } from 'date-fns';
  import { zhCN } from 'date-fns/locale';

  interface Private {
    plid: string;
    peer_uid: string;
    peer_username: string;
    message: string;
    read: boolean;
    send: boolean;
    timestamp: number;
  }

  interface Public {
    pmid: string;
    preview: string;
    read: boolean;
    timestamp: number;
  }

  defineOptions({
    name: 'NotificationIndex',
  });

  const settingStore = useSettingStore();
  const notificationList = ref([]); // 未知数据格式，暂时不知道如何定义类型
  const privateList = ref<Private[]>([]);
  const publicList = ref<Public[]>([]);
  const selectSegment = ref('notification');
  const loading = ref(true);

  onIonViewWillEnter(() => {
    getNotification();
  });

  const getNotification = async () => {
    try {
      loading.value = true;
      const res = await notification({
        last_updated: '1',
      });
      if (res.data) {
        const data = JSON.parse(res.data);
        console.log(data);

        notificationList.value = data.notification;
        privateList.value = data.private_message;
        publicList.value = data.public_message;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const segmentChange = (e: SegmentCustomEvent) => {
    selectSegment.value = e.detail.value as string;
  };

  const timeFormat = (time: number) => {
    return format(new Date(time * 1000), 'PPP HH:mm', {
      locale: zhCN,
    });
  };
</script>

<style scoped></style>
