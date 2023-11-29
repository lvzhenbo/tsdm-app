<template>
  <div class="p-1">
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';

  defineOptions({
    name: 'EditorComponent',
  });

  const content = defineModel<string>();
  content.value = '';

  const editor = useEditor({
    content: content.value,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      content.value = editor.getHTML();
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none focus:caret-[--ion-color-primary]',
      },
    },
  });
</script>

<style scoped></style>
