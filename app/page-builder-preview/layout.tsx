import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh text-zinc-100 antialiased">{children}</div>;
}
