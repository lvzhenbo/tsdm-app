import { setStorage } from '@/utils';

export interface UserInfo {
  uid: number;
  username: string;
  nickname: string;
  gid: number;
  aid: number;
  credits: number;
  miku: number;
  threads: number;
  posts: number;
  readaccess: number;
  regdate: string;
  cpuid: number;
  cpusername: string;
  customstatus: string;
  avatar: string;
  extcredits1: string;
  extcredits2: string;
  extcredits3: string;
  extcredits4: string;
  extcredits5: string;
  extcredits6: string;
  extcredits7: string;
  extcredits8: string;
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null);

  const setUserInfo = (info: UserInfo) => {
    setStorage('userInfo', info);
    userInfo.value = info;
  };
  return {
    userInfo,
    setUserInfo,
  };
});
