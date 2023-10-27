<template>
  <IonPage>
    <MenuLayout />
    <PageLayout />
  </IonPage>
</template>

<script setup lang="ts">
  import MenuLayout from './menu.vue';
  import PageLayout from './page.vue';

  defineOptions({
    name: 'LayoutIndex',
  });
</script>

<style scoped></style>
