import request from '@/utils/http';
import type { HttpOptions } from '@capacitor/core';

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
