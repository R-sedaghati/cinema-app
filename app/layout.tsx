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

const danaFont = localFont({
  variable: "--font-dana",
  display: "swap",
  src: [
    {
      path: "../public/assets/fonts/DanaVF.woff",
      weight: "100 900",
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
      <body className={`${danaFont.variable} font-sans min-h-dvh`}>
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
