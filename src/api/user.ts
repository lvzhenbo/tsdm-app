import request from '@/utils/http';
import type { HttpOptions } from '@capacitor/core';

interface LoginParams {
  username: string;
  password: string;
  tsdm_verify: string;
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
};

export const captcha = () => request(API.Captcha);

export const login = (params: LoginParams) =>
  request({
    ...API.Login,
    data: new URLSearchParams(params as unknown as Record<string, string>).toString(),
  });
