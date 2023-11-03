export const useForumStore = defineStore('forum', () => {
  const forumTitle = ref('板块名称');
  const prevTitle = ref('');

  const setForumTitle = (title: string) => {
    forumTitle.value = title;
  };

  const setPrevTitle = (title: string) => {
    prevTitle.value = title;
  };

  return {
    forumTitle,
    prevTitle,
    setForumTitle,
    setPrevTitle,
  };
});
