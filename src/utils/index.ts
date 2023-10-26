import { Preferences } from '@capacitor/preferences';

export const setStorage = async (key: string, value: string) => {
  await Preferences.set({ key, value });
};

export const getStorage = async (key: string) => {
  const { value } = await Preferences.get({ key });
  return value;
};

export const removeStorage = async (key: string) => {
  await Preferences.remove({ key });
};
