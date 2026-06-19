import { ReactNode } from "react";

interface BenefitItem {
  title: string;
  image: string;
  desc: ReactNode;
}

export const benefitItems: BenefitItem[] = [
  {
    title: "ماموریت ما",
    image: "./reasons-profile.svg",
    desc: (
      <div className="text-right">
        <p>ایجاد یک بستر مطمئن، کاربردی و حرفه‌ای برای هنرمندان تا بتوانند:</p>

        <ul className="list-disc list-inside space-y-2">
          <li>استعدادهای خود را به نمایش بگذارند،</li>
          <li>با تهیه‌کنندگان و کارفرمایان ارتباط برقرار کنند،</li>
          <li>و فرصت‌های واقعی و مناسب شغلی پیدا کنند.</li>
        </ul>

        <p>ما می‌خواهیم پل ارتباطی میان هنر و صنعت باشیم.</p>
      </div>
    ),
  },
  {
    title: "چشم‌انداز ما",
    image: "./reasons-search.svg",
    desc: (
      <div className="text-right">
        <p>
          آرشیو هنر در آینده به عنوان بزرگ‌ترین و شناخته‌شده‌ترین پلتفرم هنری
          ایران شناخته شود، جایی که:
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            هر هنرمند، از تازه‌کار تا حرفه‌ای، جایگاه مناسب خود را پیدا می‌کند،
          </li>
          <li>
            و مسیر رشد و توسعهٔ حرفه‌ای خود را با اعتماد و پشتیبانی ادامه
            می‌دهد.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "مسئولیت ما",
    image: "./reasons-relation.svg",
    desc: (
      <div className="text-right">
        <p>
          ما باور داریم که هنر زبان مشترک انسان‌هاست. در آرشیو هنر، یک جامعه‌ی
          پویا شکل گرفته که شامل:
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>هنرمندان،</li>
          <li>تهیه‌کنندگان،</li>
          <li>کارگردانان،</li>
          <li>و علاقه‌مندان به هنر</li>
        </ul>

        <p>
          که با همکاری و تعامل سازنده الهام می‌گیرند و آثار ماندگار خلق می‌کنند.
        </p>
      </div>
    ),
  },
];
