import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import { SectionId } from "../types";
import { SideBarSections } from "./ProfileSidebar";

interface MenuSectionProps {
  sections: SideBarSections[];
  active: SectionId | null;
  setActive: (s: SectionId | null) => void;
}

export default function MenuSection({
  sections,
  active,
  setActive,
}: Readonly<MenuSectionProps>) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-zinc-700/60 bg-gray-100/60 backdrop-blur-xl">
      {sections.map((s, index) => {
        const activeItem = s.id === active;
        const isLast = index === sections.length - 1;

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={clsx(
              "relative flex w-full items-center justify-between px-5 py-4 transition min-h-16",
              !isLast && "border-b border-zinc-800/70",
              activeItem
                ? "bg-zinc-600/50 text-zinc-100"
                : "text-zinc-300 hover:bg-zinc-600/20",
            )}
          >
            <div className="flex items-center gap-3">
              <span className={activeItem ? "text-zinc-100" : "text-zinc-400"}>
                {s.icon}
              </span>
              <span className="text-sm text-right">{s.label}</span>
            </div>
            <ChevronLeft className="text-zinc-500" size={20} />
            <div
              className={clsx(
                "h-1/2 bg-error-500 absolute left-0 top-1/2 rounded-r-2xl -translate-y-1/2 transition-all",
                activeItem ? "w-0.75" : "w-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
