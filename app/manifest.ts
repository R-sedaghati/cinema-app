import type { MetadataRoute } from "next";

// Icon URL redirects to the admin-uploaded app icon, else public/app-icon-default.png.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "آرشیو هنر",
    short_name: "آرشیو هنر",
    description: "آرشیو هنر",
    lang: "fa",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d89a2b",
    icons: [
      { src: "/api/app-icon", sizes: "192x192", purpose: "any" },
      { src: "/api/app-icon", sizes: "512x512", purpose: "any" },
    ],
  };
}
