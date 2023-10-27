<template>
  <IonApp>
    <IonRouterOutlet />
  </IonApp>
</template>

<script setup lang="ts">
  import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/vue';
  import { StatusBar } from '@capacitor/status-bar';

  if (isPlatform('android') && isPlatform('hybrid')) {
    StatusBar.setOverlaysWebView({ overlay: true });
  }
</script>
