import { ButtonProps } from "@dgshahr/ui-kit/Button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { ReactNode } from "react";

interface ReasonsCardFooterItem {
  icon: ReactNode;
  des: string;
}

export interface ISupportItem {
  id: number;
  image: string;
  title: string;
  detail: string;
  footerList: ReasonsCardFooterItem[];
  button: ButtonProps;
}

export const supportItems: ISupportItem[] = [
  {
    id: 1,
    image: "./support-call.svg",
    title: "پشتیبانی تلفنی",
    detail:
      "برای مشکلات فوری و نیاز به راهنمایی سریع، با شماره زیر تماس بگیرید",
    footerList: [
      {
        icon: <Phone className="text-zinc-500" size={20} />,
        des: "۹ صبح تا ۱۸ عصر - شنبه تا چهارشنبه",
      },
    ],
    button: {
      value: "۰۹۱۹۸۶۱۲۲۶۱",
      rightIcon: <ChevronRight className="text-zinc-100" size={20} />,
    },
  },
  {
    id: 2,
    image: "./support-mail.svg",
    title: "پشتیبانی ایمیلی",
    detail: "برای سوالات تخصصی و درخواست‌های پیچیده، ایمیل ارسال کنید",
    footerList: [
      {
        icon: <Clock className="text-zinc-500" size={20} />,
        des: "پاسخ در کمتر از ۲۴ ساعت",
      },
      {
        icon: <Mail className="text-zinc-500" size={20} />,
        des: "support@archiivehonar.ir",
      },
    ],
    button: {
      value: "ارسال ایمیل",
      leftIcon: <ChevronLeft className="text-zinc-100" size={20} />,
    },
  },
  {
    id: 3,
    image: "./support-social.svg",
    title: "پشتیبانی تلگرام",
    detail: "برای دریافت پشتیبانی سریع و آنی از طریق پیام‌رسان تلگرام",
    footerList: [
      {
        icon: <Clock className="text-zinc-500" size={20} />,
        des: "پاسخ آنی در ساعات کاری",
      },
      {
        icon: <Send className="text-zinc-500" size={20} />,
        des: "@archivehonarSupport",
      },
    ],
    button: {
      value: "شروع گفتگو",
      leftIcon: <ChevronLeft className="text-zinc-100 self-center" size={20} />,
    },
  },
];
