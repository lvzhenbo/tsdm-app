<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary" class="!pt-[var(--safe-area-inset-top)]">
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle> 发表帖子 </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent color="light">
      <IonList :inset="true">
        <IonItem>
          <IonInput label="标题"></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>
            正文
            <div class="border w-full h-28 overflow-scroll rounded">
              <Editor v-model="content" />
            </div>
          </IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { htmlToBBCode } from '@/utils/html2bbcode';

  defineOptions({
    name: 'ThreadAdd',
  });

  const content = ref('');

  watch(content, (value) => {
    console.log(value);
    console.log(htmlToBBCode(value));
  });
</script>

<style scoped></style>
