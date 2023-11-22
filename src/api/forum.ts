import request from '@/utils/http';
import type { HttpOptions } from '@capacitor/core';

interface ThreadParams {
  tid: string;
  page: string;
}

interface ForumViewParams {
  fid: string;
  page: string;
  orderby: string;
  filter: string;
  typeid: string;
}

const API = {
  ForumGroup: {
    method: 'GET',
    url: '/forum.php',
    params: {
      mobile: 'yes',
      tsdmapp: '1',
    },
  } as HttpOptions,
  Thread: {
    method: 'GET',
    url: '/forum.php',
    params: {
      mobile: 'yes',
      tsdmapp: '1',
      mod: 'viewthread',
    },
  } as HttpOptions,
};

export const forumGroup = () => request(API.ForumGroup);
export const subGroup = (gid: string) =>
  request({
    ...API.ForumGroup,
    params: {
      ...API.ForumGroup.params,
      gid,
    },
  });
export const forumView = (params: ForumViewParams) =>
  request({
    ...API.ForumGroup,
    params: {
      ...API.ForumGroup.params,
      mod: 'forumdisplay',
      ...params,
    },
  });

export const thread = (params: ThreadParams) =>
  request({
    ...API.Thread,
    params: {
      ...API.Thread.params,
      ...params,
    },
  });
