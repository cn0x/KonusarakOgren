import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async set({ key, value }: any) {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
    } catch (e) {
      console.error(`AsyncStorage set error for key "${key}":`, e);
    }
  },

  async get(key: any, fallback = null) {
    try {
      const json = await AsyncStorage.getItem(key);
      return json != null ? JSON.parse(json) : fallback;
    } catch (e) {
      console.error(`AsyncStorage get error for key "${key}":`, e);
      return fallback;
    }
  },

  async remove(key: any) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`AsyncStorage remove error for key "${key}":`, e);
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('AsyncStorage clear error:', e);
    }
  },
};
