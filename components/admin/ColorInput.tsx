"use client";

interface Props {
  label?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
}

/** Native color picker with a reset. `null` means "use the default color". */
function ColorInput({ label = "رنگ متن", value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2 h-10">
        <input
          type="color"
          aria-label={label}
          className="h-9 w-12 cursor-pointer rounded border border-gray-300 bg-transparent"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="text-xs text-gray-500 underline"
            onClick={() => onChange(null)}
          >
            پیش‌فرض
          </button>
        ) : (
          <span className="text-xs text-gray-400">پیش‌فرض</span>
        )}
      </div>
    </div>
  );
}

export default ColorInput;
