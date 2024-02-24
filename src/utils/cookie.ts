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

interface Cookie {
  [key: string]: string;
}

function parse(reg: RegExp, text: string): Cookie {
  const hash: Cookie = {};
  let res = reg.exec(text);
  while (res !== null) {
    hash[res[1]] = res[2];
    res = reg.exec(text);
  }
  return hash;
}

export function parseSetCookie(a: string): Cookie[] {
  const arr = a
    .replace(/expires=(.*?)GMT/g, ($1) => 'expires=' + new Date($1).getTime())
    .split(', ');

  return arr.map((item) => parse(/([^=;\s]+)=([^;]+);?/g, item.replace(/; httponly/g, '$&=true')));
}
