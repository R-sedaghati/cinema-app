"use client";

import { useState } from "react";
import { Button, Drawer } from "@dgshahr/ui-kit";
import { CalendarDays } from "lucide-react";
import Input from "@/components/common/Input";
import WheelDatePicker from "@/components/common/WheelDatePicker";
import jalalify from "@/lib/utils/convertGregorianTimeToShamsiTime";
import getDrawerPosition from "@/lib/utils/getDrawerPosition";
import getDrawerWidth from "@/lib/utils/getDrawerWidth";
import { fromJalali, Jalali, toJalali } from "@/lib/utils/jalali";
import { FieldProps } from "./types";

const DateField: React.FC<FieldProps> = ({ field, value, onChange }) => {
  const date = value ? new Date(value as string) : null;
  const today = toJalali(new Date());
  const [draft, setDraft] = useState<Jalali | null>(null);

  const confirm = () => {
    const picked = draft && fromJalali(draft.jy, draft.jm, draft.jd);
    if (picked) onChange(picked.toISOString());
    setDraft(null);
  };

  return (
    <>
      <div className="w-full" onClick={() => setDraft(date ? toJalali(date) : today)}>
        <Input
          labelContent={field.label}
          placeholder={field.placeholder ?? field.label}
          required={field.required}
          wrapperClassName="w-full pointer-events-none"
          rightIcon={<CalendarDays />}
          readOnly
          value={date ? jalalify(date, false) : ""}
        />
      </div>
      <Drawer
        open={!!draft}
        onClose={() => setDraft(null)}
        position={getDrawerPosition()}
        width={getDrawerWidth(435)}
        maskClassName="!z-[99999999]"
        header={{ title: field.label, haveCloseIcon: true }}
        footer={{ element: <Button className="w-full" onClick={confirm}>تایید</Button> }}
      >
        {draft && (
          <WheelDatePicker
            value={draft}
            onChange={setDraft}
            minYear={today.jy - 100}
            maxYear={today.jy + 10}
          />
        )}
      </Drawer>
    </>
  );
};

export default DateField;
