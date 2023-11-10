export const useForumStore = defineStore('forum', () => {
  const forumTitle = ref('板块名称');
  const prevTitle = ref('');
  const threadTitle = ref('');

  const setForumTitle = (title: string) => {
    forumTitle.value = title;
  };

  const setPrevTitle = (title: string) => {
    prevTitle.value = title;
  };

  const setThreadTitle = (title: string) => {
    threadTitle.value = title;
  };

  return {
    forumTitle,
    prevTitle,
    threadTitle,
    setForumTitle,
    setPrevTitle,
    setThreadTitle,
  };
});
