<template>
  <div class="cmd">
    <div class="icon ion-activatable" @click="editorCMD?.setColor('#958DF1').run()">
      <IonIcon :icon="colorPalette" />
      <IonRippleEffect />
    </div>
    <div class="icon ion-activatable" @click="editorCMD?.toggleBold().run()">
      <IonIcon :src="BoldOutlined" :color="editor?.isActive('bold') ? 'primary' : ''" />
      <IonRippleEffect />
    </div>
    <div class="icon ion-activatable" @click="editorCMD?.toggleItalic().run()">
      <IonIcon :src="ItalicOutlined" :color="editor?.isActive('italic') ? 'primary' : ''" />
      <IonRippleEffect />
    </div>
    <div class="icon ion-activatable" @click="editorCMD?.toggleUnderline().run()">
      <IonIcon :src="UnderlineOutlined" :color="editor?.isActive('underline') ? 'primary' : ''" />
      <IonRippleEffect />
    </div>
    <div class="icon ion-activatable" @click="editorCMD?.toggleStrike().run()">
      <IonIcon :src="StrikethroughOutlined" :color="editor?.isActive('strike') ? 'primary' : ''" />
      <IonRippleEffect />
    </div>
    <div class="icon ion-activatable" @click="editorCMD?.setTextAlign('left').run()">
      <IonIcon
        :src="AlignLeftOutlined"
        :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : ''"
      />
      <IonRippleEffect />
    </div>
    <div class="icon ion-activatable" @click="editorCMD?.setTextAlign('center').run()">
      <IonIcon
        :src="AlignCenterOutlined"
        :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : ''"
      />
      <IonRippleEffect />
    </div>
    <div class="icon ion-activatable" @click="editorCMD?.setTextAlign('right').run()">
      <IonIcon
        :src="AlignRightOutlined"
        :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : ''"
      />
      <IonRippleEffect />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Editor } from '@tiptap/vue-3';
  import BoldOutlined from '@/assets/svg/BoldOutlined.svg';
  import ItalicOutlined from '@/assets/svg/ItalicOutlined.svg';
  import UnderlineOutlined from '@/assets/svg/UnderlineOutlined.svg';
  import StrikethroughOutlined from '@/assets/svg/StrikethroughOutlined.svg';
  import AlignLeftOutlined from '@/assets/svg/AlignLeftOutlined.svg';
  import AlignCenterOutlined from '@/assets/svg/AlignCenterOutlined.svg';
  import AlignRightOutlined from '@/assets/svg/AlignRightOutlined.svg';
  import { colorPalette } from 'ionicons/icons';
  import { Keyboard } from '@capacitor/keyboard';
  import { isPlatform } from '@ionic/vue';

  const props = defineProps({
    editor: {
      type: Object as PropType<Editor>,
      default: null,
    },
  });

  const editorCMD = computed(() => props.editor.chain().focus());
  const keyboardHeight = ref('0px');

  onMounted(() => {
    // 因 Web 端跨域问题导致不可用，暂时不考虑 web 端
    if (isPlatform('hybrid')) {
      Keyboard.addListener('keyboardWillShow', (info) => {
        keyboardHeight.value = info.keyboardHeight + 'px';
      });
      Keyboard.addListener('keyboardWillHide', () => {
        keyboardHeight.value = '0px';
      });
    }
  });
  onUnmounted(() => {
    if (isPlatform('hybrid')) {
      Keyboard.removeAllListeners();
    }
  });
</script>

<style scoped>
  .icon {
    @apply relative rounded-full overflow-hidden text-xl w-8 h-8 flex justify-center items-center;
  }
  .cmd {
    @apply flex overflow-x-auto w-full bottom-[v-bind(keyboardHeight)] transition-all duration-150 p-2 bg-[--ion-background-color] text-[--ion-text-color] border-t border-slate-900/10;
  }
</style>
