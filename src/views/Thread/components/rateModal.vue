<template>
  <IonModal :is-open="isOpen">
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <IonButtons slot="start">
          <IonButton @click="closeFunc">
            <IonIcon slot="icon-only" :icon="close" />
          </IonButton>
        </IonButtons>
        <IonTitle>评分</IonTitle>
        <IonButtons slot="end">
          <!-- 确认按钮 -->
          <IonButton>
            <IonIcon slot="icon-only" :icon="checkmark" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent color="light">
      <IonList v-if="loading" lines="none" :inset="true">
        <IonItem v-for="n in 3" :key="n">
          <IonLabel>
            <IonSkeletonText :animated="true" class="w-1/3" />
            <IonNote color="medium">
              <IonSkeletonText :animated="true" class="w-1/2" />
            </IonNote>
          </IonLabel>
        </IonItem>
      </IonList>
      <div v-if="modalContent">
        <div v-for="items in userRateInfo?.items" :key="items.id">
          <IonList v-if="items.available != 0" :inset="true">
            <IonItem>
              <IonLabel>{{ items.name }}</IonLabel>
              <div class="flex flex-col mr-36">
                <IonNote>{{ items.floor }} ~ {{ items.ceil }}</IonNote>
                <IonNote>今日剩余 {{ items.available }}</IonNote>
              </div>
              <VarCounter v-model="items.counterValue" :min="items.floor" :max="items.ceil" />
            </IonItem>
          </IonList>
        </div>
        <IonList :inset="true">
          <IonItem>
            <IonLabel>评分理由</IonLabel>
            <IonInput aria-label="评分理由" placeholder="请输入评分理由"></IonInput>
          </IonItem>
          <div class="mt-4 ml-4 mb-3">
            <IonCheckbox label-placement="end">发送评分通知</IonCheckbox>
            <IonCheckbox label-placement="end" class="ml-4">连续操作</IonCheckbox>
          </div>
        </IonList>
      </div>
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
  import { coinRemain } from '@/api/forum';
  import { type IonLabel } from '@ionic/vue';
  import { close, checkmark } from 'ionicons/icons';

  interface UserRateInfo {
    formhash: string;
    multiplier: number;
    status: number;
    items: Item[];
  }

  interface Item {
    name: string;
    available: number;
    ceil: number;
    floor: number;
    id: number;
    counterValue: number;
  }

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    pid: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(['close']);

  const route = useRoute();
  const loading = ref(false);
  const modalContent = ref(true);
  const userRateInfo = ref<UserRateInfo | null>(null);

  watch(
    () => props.pid,
    (val) => {
      console.log(val);
      getRemainCoin();
    },
  );

  const getRemainCoin = async () => {
    try {
      modalContent.value = false;
      loading.value = true;
      const res = await coinRemain({ tid: route.params.tid as string, pid: props.pid });
      if (res.data) {
        const data = JSON.parse(res.data);
        if (data.status === 0) {
          userRateInfo.value = data;
          if (userRateInfo.value) {
            userRateInfo.value.items = userRateInfo.value.items.map((item: Item) => {
              item.counterValue = 0;
              return item;
            });
          }
          modalContent.value = true;
        } else {
          console.log('获取失败弹窗');
          modalContent.value = false;
        }
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };

  const closeFunc = () => {
    emits('close', false);
  };
</script>

<style scoped></style>
