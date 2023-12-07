import { setStorage } from '@/utils';

export interface Config {
  theme: string;
  emotion: string;
  comment: string;
  autoSignIn: boolean;
}

export const useSettingStore = defineStore('setting', () => {
  const config = ref<Config | null>(null);
  const isDark = ref(false);

  const setConfig = (value: Config) => {
    setStorage('config', value);
    config.value = value;
  };

  const getConfig = async () => {
    return config.value;
  };

  return {
    config,
    isDark,
    setConfig,
    getConfig,
  };
});
