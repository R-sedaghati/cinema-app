import { Datepicker } from "@dgshahr/ui-kit";
import { Dispatch, SetStateAction, useEffect, useState, type FC } from "react";
import Chip from "@/components/common/CustomChip";
import ObjectUtils from "@/lib/utils/objectUtils";
import jalalify from "@/lib/utils/convertGregorianTimeToShamsiTime";
import { CalendarDays } from "lucide-react";

type KeyValueObject = {
  [key: string]: any;
};
type RangeKeyStyle = "gte_lte" | "from_to";

const RANGE_SUFFIXES: Record<RangeKeyStyle, { start: string; end: string }> = {
  gte_lte: { start: "gte", end: "lte" },
  from_to: { start: "from", end: "to" },
};

interface ExtendedUiDatePickerProps {
  isLoading?: boolean;
  disabled?: boolean;
  dateParamName: string;
  label?: string;
  params: KeyValueObject;
  setParams: Dispatch<SetStateAction<KeyValueObject>>;
  applyOnChange?: boolean;
  rangeKeyStyle?: RangeKeyStyle;
}

const ExtendedUiDatePicker: FC<ExtendedUiDatePickerProps> = ({
  disabled,
  dateParamName,
  label = "تاریخ",
  params,
  setParams,
  applyOnChange = false,
  rangeKeyStyle = "gte_lte",
}) => {
  const [localDate, setLocalDate] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const { start: startSuffix, end: endSuffix } = RANGE_SUFFIXES[rangeKeyStyle];

  const startKey = `${dateParamName}__${startSuffix}` as const;
  const endKey = `${dateParamName}__${endSuffix}` as const;

  const setParamsFromLocal = () => {
    setParams((prev) => ({
      ...prev,
      [startKey]: localDate.start,
      [endKey]: localDate.end,
    }));
  };

  console.log(params[startKey]);

  useEffect(() => {
    if (applyOnChange) setParamsFromLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDate, applyOnChange, startKey, endKey]);

  const startDate = (params[startKey] as Date | null) ?? null;
  const endDate = (params[endKey] as Date | null) ?? null;
  const persianRange = [startDate, endDate]
    .filter(Boolean)
    .map((date) => date && jalalify(date, false, true))
    .join(" ~ ");

  const customInputFn = (isOpen: boolean) => (
    <Chip
      filled={!!persianRange || isOpen}
      rightIcon={<CalendarDays />}
      label={label + (persianRange ? `: ${persianRange}` : "")}
      disabled={disabled}
      isActive={isOpen || !!persianRange}
    />
  );

  if (!ObjectUtils.hasAllKeys(params, [startKey, endKey])) {
    return <p className="text-error-500">ویژگی وجود ندارد</p>;
  }

  return (
    <Datepicker
      acceptRange
      onChange={({ start, end }) => setLocalDate({ start, end })}
      customInput={customInputFn}
      value={{ start: localDate.start, end: localDate.end }}
      showTodayButton
      {...(applyOnChange
        ? { showSubmitButton: false }
        : { showSubmitButton: true, onSubmit: setParamsFromLocal })}
    />
  );
};

export default ExtendedUiDatePicker;
