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
    <div id="image-button" class="icon ion-activatable">
      <IonIcon :icon="image" />
      <IonRippleEffect />
    </div>
    <IonAlert
      trigger="image-button"
      header="请输入图片地址"
      :buttons="imageButtons"
      :inputs="imageInputs"
    ></IonAlert>
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
  import { colorPalette, image } from 'ionicons/icons';
  import { Keyboard } from '@capacitor/keyboard';
  import { isPlatform, alertController, type AlertButton, type AlertInput } from '@ionic/vue';

  const props = defineProps({
    editor: {
      type: Object as PropType<Editor>,
      default: null,
    },
  });

  const editorCMD = computed(() => props.editor.chain().focus());
  const keyboardHeight = ref('0px');
  const imageInputs: AlertInput[] = [
    {
      name: 'image',
      type: 'url',
      placeholder: '请输入图片地址，以https://开头',
    },
  ];
  const imageButtons: AlertButton[] = [
    {
      text: '取消',
      role: 'cancel',
    },
    {
      text: '确认',
      role: 'confirm',
      handler: async (e: { image: string }) => {
        try {
          if (!e.image.startsWith('https://')) {
            const alert = await alertController.create({
              header: '错误',
              message: '图片地址必须以https://开头',
              buttons: ['确认'],
            });
            await alert.present();
            return false;
          }
          new URL(e.image);
          editorCMD.value.setImage({ src: e.image }).run();
        } catch (error) {
          const alert = await alertController.create({
            header: '错误',
            message: '图片地址不合法，请输入正确的图片地址',
            buttons: ['确认'],
          });
          await alert.present();
          return false;
        }
      },
    },
  ];

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
