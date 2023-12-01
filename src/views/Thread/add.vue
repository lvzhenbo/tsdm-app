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
            <Editor ref="editorRef" v-model="content" />
          </IonLabel>
        </IonItem>
      </IonList>
      <div slot="fixed" class="cmd">
        <div class="icon ion-activatable" @click="editorRef?.editorCMD?.setColor('#958DF1').run()">
          <IonIcon :icon="colorPalette" />
          <IonRippleEffect />
        </div>
        <div class="icon ion-activatable" @click="editorRef?.editorCMD?.toggleBold().run()">
          <IonIcon
            :src="BoldOutlined"
            :color="editorRef?.editor?.isActive('bold') ? 'primary' : ''"
          />
          <IonRippleEffect />
        </div>
        <div class="icon ion-activatable" @click="editorRef?.editorCMD?.toggleItalic().run()">
          <IonIcon
            :src="ItalicOutlined"
            :color="editorRef?.editor?.isActive('italic') ? 'primary' : ''"
          />
          <IonRippleEffect />
        </div>
        <div class="icon ion-activatable" @click="editorRef?.editorCMD?.toggleUnderline().run()">
          <IonIcon
            :src="UnderlineOutlined"
            :color="editorRef?.editor?.isActive('underline') ? 'primary' : ''"
          />
          <IonRippleEffect />
        </div>
        <div class="icon ion-activatable" @click="editorRef?.editorCMD?.toggleStrike().run()">
          <IonIcon
            :src="StrikethroughOutlined"
            :color="editorRef?.editor?.isActive('strike') ? 'primary' : ''"
          />
          <IonRippleEffect />
        </div>
        <div class="icon ion-activatable" @click="editorRef?.editorCMD?.setTextAlign('left').run()">
          <IonIcon
            :src="AlignLeftOutlined"
            :color="editorRef?.editor?.isActive({ textAlign: 'left' }) ? 'primary' : ''"
          />
          <IonRippleEffect />
        </div>
        <div
          class="icon ion-activatable"
          @click="editorRef?.editorCMD?.setTextAlign('center').run()"
        >
          <IonIcon
            :src="AlignCenterOutlined"
            :color="editorRef?.editor?.isActive({ textAlign: 'center' }) ? 'primary' : ''"
          />
          <IonRippleEffect />
        </div>
        <div
          class="icon ion-activatable"
          @click="editorRef?.editorCMD?.setTextAlign('right').run()"
        >
          <IonIcon
            :src="AlignRightOutlined"
            :color="editorRef?.editor?.isActive({ textAlign: 'right' }) ? 'primary' : ''"
          />
          <IonRippleEffect />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { htmlToBBCode } from '@/utils/html2bbcode';
  import BoldOutlined from '@/assets/svg/BoldOutlined.svg';
  import ItalicOutlined from '@/assets/svg/ItalicOutlined.svg';
  import UnderlineOutlined from '@/assets/svg/UnderlineOutlined.svg';
  import StrikethroughOutlined from '@/assets/svg/StrikethroughOutlined.svg';
  import AlignLeftOutlined from '@/assets/svg/AlignLeftOutlined.svg';
  import AlignCenterOutlined from '@/assets/svg/AlignCenterOutlined.svg';
  import AlignRightOutlined from '@/assets/svg/AlignRightOutlined.svg';
  import Editor from '@/components/Editor/Editor.vue';
  import { colorPalette } from 'ionicons/icons';
  import { Keyboard } from '@capacitor/keyboard';
  import { isPlatform } from '@ionic/vue';

  defineOptions({
    name: 'ThreadAdd',
  });

  const content = ref('');
  const editorRef = ref<InstanceType<typeof Editor> | null>();
  const keyboardHeight = ref('0px');

  onMounted(() => {
    // 因 Web 端跨域问题导致不可用，暂时不考虑 web 端
    if (isPlatform('hybrid')) {
      Keyboard.addListener('keyboardWillShow', (info) => {
        console.log('keyboard will show with height:', info.keyboardHeight);
        keyboardHeight.value = info.keyboardHeight + 'px';
      });
      Keyboard.addListener('keyboardWillHide', () => {
        console.log('keyboard will hide');
        keyboardHeight.value = '0px';
      });
    }
  });
  onUnmounted(() => {
    if (isPlatform('hybrid')) {
      Keyboard.removeAllListeners();
    }
  });

  watch(content, (value) => {
    console.log(value);
    console.log(htmlToBBCode(value));
  });
</script>

<style scoped>
  .icon {
    @apply relative rounded-full overflow-hidden text-xl w-8 h-8 flex justify-center items-center;
  }
  .cmd {
    @apply flex overflow-x-auto w-full bottom-[v-bind(keyboardHeight)] transition-all duration-150 p-2 bg-[--ion-background-color] shadow-md text-[--ion-text-color];
  }
</style>
