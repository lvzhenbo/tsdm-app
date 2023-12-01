<template>
  <div class="p-1 border w-full min-h-[8rem] overflow-scroll rounded">
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
  import { EditorContent, Editor } from '@tiptap/vue-3';

  defineOptions({
    name: 'EditorComponent',
  });
  defineProps({
    editor: {
      type: Object as PropType<Editor>,
      default: null,
    },
  });
</script>

<style scoped></style>
