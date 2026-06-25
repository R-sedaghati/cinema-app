import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.archive.cinema',
  appName: 'ArchiveHonar',
  webDir: 'public',
  server: {
    url: 'https://archivehonar.ir',
    androidScheme: 'https',
  },
};

export default config;
