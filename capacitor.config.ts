import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.togusa.sockcalculator',
  appName: 'Sock Calculator',
  webDir: 'out',
  plugins: {
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    },
    SplashScreen: {
      launchShowDuration: 0,
      splashScreenDelay: 0
    }
  }
};

export default config;
