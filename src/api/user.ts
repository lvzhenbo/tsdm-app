import request from '@/utils/http';
import type { HttpOptions } from '@capacitor/core';

interface LoginParams {
  username: string;
  password: string;
  tsdm_verify: string;
}

interface SignInParams {
  client_hash: string;
  emotion: string;
  comment: string;
}

const API = {
  Captcha: {
    method: 'GET',
    url: '/plugin.php',
    params: {
      id: 'oracle:verify',
    },
    responseType: 'blob',
  } as HttpOptions,
  Login: {
    method: 'POST',
    url: '/member.php',
    params: {
      mod: 'logging',
      action: 'login',
      loginsubmit: 'yes',
      mobile: 'yes',
      tsdmapp: '1',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  } as HttpOptions,
  UserInfo: {
    method: 'GET',
    url: '/home.php',
    params: {
      mobile: 'yes',
      tsdmapp: '1',
      mod: 'space',
      do: 'profile',
    },
  } as HttpOptions,
  SignIn: {
    method: 'POST',
    url: '/plugin.php',
    params: {
      id: 'minerva:sign_in',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  } as HttpOptions,
};

export const captcha = () => request(API.Captcha);

export const login = (params: LoginParams) =>
  request({
    ...API.Login,
    data: params,
  });

export const userInfo = (uid: string) =>
  request({
    ...API.UserInfo,
    params: {
      ...API.UserInfo.params,
      uid,
    },
  });

export const otherUserInfo = (username: string) =>
  request({
    ...API.UserInfo,
    params: {
      ...API.UserInfo.params,
      username,
    },
  });

export const permissionUserInfo = () =>
  request({
    ...API.UserInfo,
  });

export const signIn = (params: SignInParams) =>
  request({
    ...API.SignIn,
    data: params,
  });
