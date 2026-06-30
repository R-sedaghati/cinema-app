import { ToastContainer } from "react-toastify";
import localFont from "next/font/local";
import { Metadata, Viewport } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "آرشیو هنرمندان سینما",
  description: "آرشیو هنرمندان حوزه سینما (نسخه توسعه با داده‌های ساختگی)",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const meemFont = localFont({
  variable: "--font-meem",
  display: "swap",
  src: [
    {
      path: "../public/assets/fonts/Meem-UltraLight.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-DemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-UltraBold.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Meem-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${meemFont.variable} font-sans min-h-dvh`}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {children}
      </body>
    </html>
  );
}
