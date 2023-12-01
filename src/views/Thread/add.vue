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
            <Editor :editor="editor" />
          </IonLabel>
        </IonItem>
      </IonList>
      <CommendTab slot="fixed" :editor="editor" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
  import { htmlToBBCode } from '@/utils/html2bbcode';
  import StarterKit from '@tiptap/starter-kit';
  import Color from '@tiptap/extension-color';
  import TextStyle from '@tiptap/extension-text-style';
  import Underline from '@tiptap/extension-underline';
  import TextAlign from '@tiptap/extension-text-align';
  import { useEditor } from '@tiptap/vue-3';

  defineOptions({
    name: 'ThreadAdd',
  });

  const content = ref('');
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

  watch(content, (value) => {
    console.log(value);
    console.log(htmlToBBCode(value));
  });
</script>

<style scoped></style>
