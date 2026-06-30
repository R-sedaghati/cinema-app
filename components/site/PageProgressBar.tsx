"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function PageProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    setWidth(0);
    setVisible(true);
    // animate to ~80% quickly, then complete on next tick
    requestAnimationFrame(() => {
      setWidth(80);
      timerRef.current = setTimeout(() => {
        setWidth(100);
        setTimeout(() => setVisible(false), 300);
      }, 200);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
      style={{ backgroundColor: "var(--accent)" }}
    >
      <div
        style={{
          width: `${width}%`,
          height: "100%",
          backgroundColor: "var(--accent)",
          transition: width === 0 ? "none" : "width 0.3s ease",
          boxShadow: "0 0 8px var(--accent)",
        }}
      />
    </div>
  );
}
