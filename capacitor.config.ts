import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.archive.cinema",
  appName: "ArchiveHonar",
  webDir: "public",
  server: {
    url: "https://archivehonar.ir",
    androidScheme: "https",
    // Without this, Capacitor sends any off-site navigation to an external browser via
    // Intent, and a browser opened that way sends no Referer — which SEP rejects the
    // payment token for (see buildStartPayUrl). Keep the gateway and the API callback
    // inside the WebView so the whole payment round trip stays in the app.
    allowNavigation: ["*.shaparak.ir", "api.archivehonar.ir"],
  },
};

export default config;
