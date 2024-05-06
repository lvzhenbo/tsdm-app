import { useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';

export const useMyEditor = () => {
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
      Image.configure({
        inline: true,
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

  return {
    content,
    editor,
  };
};
