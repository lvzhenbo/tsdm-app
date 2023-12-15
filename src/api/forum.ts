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
