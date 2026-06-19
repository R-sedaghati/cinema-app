import { type FC } from "react";

const SelectBeforeOption: FC<{
  onSelectAll: () => void;
  onSelectNone: () => void;
}> = ({ onSelectAll, onSelectNone }) => {
  return (
    <div className="flex justify-end gap-3 p-3">
      <button
        onClick={onSelectNone}
        className="text-[13px] font-semibold leading-4 text-right  text-error-500"
      >
        حذف انتخاب‌ها
      </button>
      <button
        onClick={onSelectAll}
        className="text-[13px] font-semibold leading-4 text-right  text-primary-500"
      >
        انتخاب همه
      </button>
    </div>
  );
};
export default SelectBeforeOption;
