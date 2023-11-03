import { Preferences } from '@capacitor/preferences';
import { destr } from 'destr';
import { Browser, type OpenOptions } from '@capacitor/browser';

export const setStorage = async (key: string, value: any) => {
  await Preferences.set({ key, value: JSON.stringify(value) });
};

export const getStorage = async (key: string) => {
  const { value } = await Preferences.get({ key });
  return destr(value) as any;
};

export const removeStorage = async (key: string) => {
  await Preferences.remove({ key });
};

export const openUrl = async (options: OpenOptions) => {
  await Browser.open(options);
};
