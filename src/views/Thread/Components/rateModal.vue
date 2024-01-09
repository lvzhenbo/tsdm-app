<template>
  <IonModal :is-open="modalView">
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
        <IonList :inset="true">
          <IonItem>
            <IonLabel>天使币</IonLabel>
            <div class="flex flex-col mr-36">
              <IonNote>TestText</IonNote>
              <IonNote>TestText</IonNote>
            </div>
            <VarCounter v-model="tenshiCoin" :min="-5" :max="10" />
          </IonItem>
          <IonItem>
            <IonLabel>天然</IonLabel>
            <div class="flex flex-col mr-36">
              <IonNote>TestText</IonNote>
              <IonNote>TestText</IonNote>
            </div>
            <VarCounter v-model="tennenValue" :min="-5" :max="15" />
          </IonItem>
          <IonItem>
            <IonLabel>腹黑</IonLabel>
            <div class="flex flex-col mr-36">
              <IonNote>TestText</IonNote>
              <IonNote>TestText</IonNote>
            </div>
            <VarCounter v-model="harakuroValue" :min="-5" :max="15" />
          </IonItem>
        </IonList>
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
        <IonButton expand="block" class="mt-4" @click="getRemainCoin">获取信息</IonButton>
      </div>
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
  import { coinRemain } from '@/api/forum';
  import { type IonLabel } from '@ionic/vue';
  import { close, checkmark } from 'ionicons/icons';

  const emits = defineEmits(['closeAction']);
  const route = useRoute();
  const tenshiCoin = ref(0);
  const tennenValue = ref(0);
  const harakuroValue = ref(0);
  const loading = ref(false);
  const modalContent = ref(true);

  const props = defineProps({
    modalView: {
      type: Boolean,
      required: true,
    },
    pid: {
      type: String,
      required: true,
    },
  });

  watch(
    () => props,
    (val) => {
      console.log(val);
      // getRemainCoin();
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
          console.log(data);
        } else {
          console.log('获取失败弹窗');
        }
      }
      loading.value = false;
      modalContent.value = true;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };

  const closeFunc = () => {
    emits('closeAction', false);
  };
</script>

<style scoped></style>
