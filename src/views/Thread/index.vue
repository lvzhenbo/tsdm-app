<template>
  <IonPage>
    <IonContent>
      <IonCard>
        <IonCardContent>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="message"> </div>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { thread } from '@/api/forum';

  defineOptions({
    name: 'ThreadIndex',
  });

  const route = useRoute();
  const page = ref(1);
  const message = ref('');

  onMounted(() => {
    getThead();
  });

  const getThead = async () => {
    const res = await thread({
      tid: route.params.tid as string,
      page: page.value.toString(),
    });
    const data = JSON.parse(
      res.data.replace(/\r\n/g, '<br />').replace(/\n/g, '').replace(/\r/g, ''),
    );

    message.value = data.postlist[0].message;
  };
</script>

<style scoped></style>
