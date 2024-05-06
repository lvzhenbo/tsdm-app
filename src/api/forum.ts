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

interface PayInfoParams {
  tid: string;
  pid: string;
}

export interface PayParams {
  formhash: string;
  referer: string;
  tid: string;
  paysubmit: string;
}

export interface SearchParams {
  query: string;
  page: string;
}

export interface RateParams {
  tid: string;
  pid: string;
}

interface ReplyParams {
  noticetrimstr: string;
  reppid: string;
  formhash: string;
  clienthash: string;
  message: string;
  noticeauthor: string;
  tid: string;
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
  PayInfo: {
    method: 'GET',
    url: '/forum.php',
    params: {
      tsdmapp: '1',
      mod: 'misc',
      action: 'pay',
      mobile: 'yes',
    },
  } as HttpOptions,
  Pay: {
    method: 'POST',
    url: '/forum.php',
    params: {
      mod: 'misc',
      action: 'pay',
      mobile: 'yes',
      paysubmit: 'yes',
      infloat: 'yes',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  } as HttpOptions,
  Search: {
    method: 'GET',
    url: '/plugin.php',
    params: {
      id: 'Kahrpba:search',
      mobile: 'yes',
      tsdmapp: '1',
    },
  } as HttpOptions,
  CoinRemain: {
    method: 'GET',
    url: '/forum.php',
    params: {
      mobile: 'yes',
      tsdmapp: '1',
      mod: 'misc',
      action: 'rate',
    },
  } as HttpOptions,
  Notification: {
    method: 'GET',
    url: '/plugin.php',
    params: {
      id: 'Kahrpba:usernotify',
    },
  } as HttpOptions,
  NewThreadType: {
    method: 'GET',
    url: '/forum.php',
    params: {
      mobile: 'yes',
      tsdmapp: '1',
      mod: 'post',
      action: 'newthread',
    },
  } as HttpOptions,
  ReplyInfo: {
    method: 'GET',
    url: '/forum.php',
    params: {
      mobile: 'yes',
      tsdmapp: '1',
      mod: 'post',
      action: 'reply',
    },
  } as HttpOptions,
  Reply: {
    method: 'POST',
    url: '/forum.php',
    params: {
      mobile: 'yes',
      tsdmapp: '1',
      mod: 'post',
      action: 'reply',
      replysubmit: 'yes',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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

export const payInfo = (params: PayInfoParams) =>
  request({
    ...API.PayInfo,
    params: {
      ...API.PayInfo.params,
      ...params,
    },
  });

export const pay = (params: PayParams) =>
  request({
    ...API.Pay,
    data: params,
  });

export const search = (params: SearchParams) =>
  request({
    ...API.Search,
    params: {
      ...API.Search.params,
      ...params,
    },
  });

export const coinRemain = (params: RateParams) =>
  request({
    ...API.CoinRemain,
    params: {
      ...API.CoinRemain.params,
      ...params,
    },
  });

export const notification = (params: { last_updated: string }) =>
  request({
    ...API.Notification,
    params: {
      ...API.Notification.params,
      ...params,
    },
  });

export const newThreadType = (params: string) =>
  request({
    ...API.NewThreadType,
    params: {
      ...API.NewThreadType.params,
      fid: params,
    },
  });

export const replyInfo = (params: { tid: string; repquote: string }) =>
  request({
    ...API.ReplyInfo,
    params: {
      ...API.ReplyInfo.params,
      ...params,
    },
  });

export const reply = (params: ReplyParams) =>
  request({
    ...API.Reply,
    data: params,
  });
