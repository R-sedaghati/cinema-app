import { useEffect, useState } from "react";
import { SectionId } from "./types";

export default function useResponsiveSidebar(
  setActive: (s: SectionId | null) => void,
  initialShowSidebar = true,
) {
  const [showSidebar, setShowSidebar] = useState<boolean>(initialShowSidebar);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = globalThis.matchMedia("(min-width: 768px)");
    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = !e.matches;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };

    handle(mq);

    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  const handleSelect = (id: SectionId | null) => {
    setActive(id);
    if (isMobile) setShowSidebar(false);
  };

  return { isMobile, showSidebar, setShowSidebar, handleSelect } as const;
}
