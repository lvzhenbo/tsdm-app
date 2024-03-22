import { useRefHistory } from '@vueuse/core';

interface Group {
  gid: number;
  title: string;
}

export const useForumStore = defineStore('forum', () => {
  const forumTitle = ref('板块标题');
  const prevTitle = ref('');
  const threadTitle = ref('帖子标题');
  const groupList = ref<Group[]>([
    {
      gid: 1,
      title: '天使·后花园',
    },
    {
      gid: 3,
      title: '天使·综合区',
    },
    {
      gid: 451,
      title: '天使·动漫·音乐',
    },
    {
      gid: 7,
      title: '天使·休闲区',
    },
    {
      gid: 21,
      title: '天使·动漫讨论区',
    },
    {
      gid: 29,
      title: '工作组',
    },
    {
      gid: 393,
      title: '美工部',
    },
    {
      gid: 11,
      title: '天使·事务区',
    },
  ]);

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
    groupList,
    setForumTitle,
    setPrevTitle,
    setThreadTitle,
    threadTitleUndo,
    threadTitleRedo,
    canThreadTitleUndo,
    canThreadTitleRedo,
  };
});
