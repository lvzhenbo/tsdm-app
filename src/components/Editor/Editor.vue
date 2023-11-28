<template>
  <EditorContent :editor="editor" class="editor" />
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
  });
</script>

<style scoped>
  .editor :deep(.tiptap) {
    @apply focus:outline-none focus:caret-[--ion-color-primary];
  }
</style>
