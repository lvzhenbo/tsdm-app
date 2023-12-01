<template>
  <div class="p-1 border w-full min-h-[8rem] overflow-scroll rounded">
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

  defineExpose({
    editor,
    editorCMD,
  });
</script>

<style scoped></style>
