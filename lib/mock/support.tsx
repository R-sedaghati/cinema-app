import { ButtonProps } from "@dgshahr/ui-kit/Button";
import { ChevronLeft, ChevronRight, Clock, Mail, Send } from "lucide-react";
import { ReactNode } from "react";

interface SupportCardVisual {
  image: string;
  footerIcon: ReactNode;
  buttonIcon: Pick<ButtonProps, "leftIcon" | "rightIcon">;
}

export const supportCardVisuals: SupportCardVisual[] = [
  {
    image: "./support-call.svg",
    footerIcon: <Clock className="text-zinc-500" size={20} />,
    buttonIcon: {
      rightIcon: <ChevronRight className="text-zinc-100" size={20} />,
    },
  },
  {
    image: "./support-mail.svg",
    footerIcon: <Mail className="text-zinc-500" size={20} />,
    buttonIcon: {
      leftIcon: <ChevronLeft className="text-zinc-100" size={20} />,
    },
  },
  {
    image: "./support-social.svg",
    footerIcon: <Send className="text-zinc-500" size={20} />,
    buttonIcon: {
      leftIcon: (
        <ChevronLeft className="text-zinc-100 self-center" size={20} />
      ),
    },
  },
];
