import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tsdm39.app',
  appName: '天使动漫论坛',
  webDir: 'dist',
  server: {
    hostname: 'www.tsdm39.com',
    androidScheme: 'https',
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
};

export default config;
