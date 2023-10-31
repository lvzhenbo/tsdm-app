export const useForumStore = defineStore('forum', () => {
  const forumTitle = ref('板块名称');

  const setForumTitle = (title: string) => {
    forumTitle.value = title;
  };

  return {
    forumTitle,
    setForumTitle,
  };
});
