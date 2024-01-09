<template>
  <IonContent>
    <IonList lines="none">
      <IonItem button :detail="false"> 回复 </IonItem>
      <IonItem button :detail="false" @click="rateFunc"> 评分 </IonItem>
    </IonList>
  </IonContent>
</template>

<script setup lang="ts">
  const emits = defineEmits(['rateAction']);
  const rateFunc = () => {
    emits('rateAction', true);
  };
</script>

<style scoped></style>
