import { useRefHistory } from '@vueuse/core';

export const useForumStore = defineStore('forum', () => {
  const forumTitle = ref('板块标题');
  const prevTitle = ref('');
  const threadTitle = ref('帖子标题');

  const setForumTitle = (title: string) => {
    forumTitle.value = title;
  };

  const setPrevTitle = (title: string) => {
    prevTitle.value = title;
  };

  const setThreadTitle = (title: string) => {
    threadTitle.value = title;
  };

  const {
    undo: threadTitleUndo,
    redo: threadTitleRedo,
    canUndo: canThreadTitleUndo,
    canRedo: canThreadTitleRedo,
  } = useRefHistory(threadTitle);

  return {
    forumTitle,
    prevTitle,
    threadTitle,
    setForumTitle,
    setPrevTitle,
    setThreadTitle,
    threadTitleUndo,
    threadTitleRedo,
    canThreadTitleUndo,
    canThreadTitleRedo,
  };
});
