<template>
  <div class="p-1 border w-full min-h-[8rem] overflow-scroll rounded">
    <div class="flex overflow-x-auto">
      <div class="icon ion-activatable" @click="editorCMD?.setColor('#958DF1').run()">
        <IonIcon :icon="colorPalette" />
        <IonRippleEffect />
      </div>
      <div class="icon ion-activatable" @click="editorCMD?.toggleBold().run()">
        <IonIcon
          src="/src/assets/svg/BoldOutlined.svg"
          :color="editor?.isActive('bold') ? 'primary' : ''"
        />
        <IonRippleEffect />
      </div>
      <div class="icon ion-activatable" @click="editorCMD?.toggleItalic().run()">
        <IonIcon
          src="/src/assets/svg/ItalicOutlined.svg"
          :color="editor?.isActive('italic') ? 'primary' : ''"
        />
        <IonRippleEffect />
      </div>
      <div class="icon ion-activatable" @click="editorCMD?.toggleUnderline().run()">
        <IonIcon
          src="/src/assets/svg/UnderlineOutlined.svg"
          :color="editor?.isActive('underline') ? 'primary' : ''"
        />
        <IonRippleEffect />
      </div>
      <div class="icon ion-activatable" @click="editorCMD?.toggleStrike().run()">
        <IonIcon
          src="/src/assets/svg/StrikethroughOutlined.svg"
          :color="editor?.isActive('strike') ? 'primary' : ''"
        />
        <IonRippleEffect />
      </div>
      <div class="icon ion-activatable" @click="editorCMD?.setTextAlign('left').run()">
        <IonIcon
          src="/src/assets/svg/AlignLeftOutlined.svg"
          :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : ''"
        />
        <IonRippleEffect />
      </div>
      <div class="icon ion-activatable" @click="editorCMD?.setTextAlign('center').run()">
        <IonIcon
          src="/src/assets/svg/AlignCenterOutlined.svg"
          :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : ''"
        />
        <IonRippleEffect />
      </div>
      <div class="icon ion-activatable" @click="editorCMD?.setTextAlign('right').run()">
        <IonIcon
          src="/src/assets/svg/AlignRightOutlined.svg"
          :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : ''"
        />
        <IonRippleEffect />
      </div>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Color from '@tiptap/extension-color';
  import TextStyle from '@tiptap/extension-text-style';
  import Underline from '@tiptap/extension-underline';
  import TextAlign from '@tiptap/extension-text-align';
  import { colorPalette } from 'ionicons/icons';

  defineOptions({
    name: 'EditorComponent',
  });

  const content = defineModel<string>();
  content.value = '';

  const editor = useEditor({
    content: content.value,
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    onUpdate: ({ editor }) => {
      content.value = editor.getHTML();
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none focus:caret-[--ion-color-primary]',
      },
    },
  });

  const editorCMD = computed(() => editor.value?.chain().focus());
</script>

<style scoped>
  .icon {
    @apply relative rounded-full overflow-hidden text-xl w-8 h-8 flex justify-center items-center;
  }
</style>
