import { setStorage, getStorage, removeStorage } from '.';

export const setCookie = async (value: string) => {
  await setStorage('cookie', value);
};

export const getCookie = async () => {
  const value = await getStorage('cookie');
  return value;
};

export const removeCookie = async () => {
  await removeStorage('cookie');
};
