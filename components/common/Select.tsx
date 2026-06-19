interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}
export default function Select({
  label,
  value,
  onChange,
  options,
  className,
}: Readonly<Props>) {
  return (
    <label className="flex flex-1 flex-col gap-2 text-xs text-zinc-400">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 text-sm text-zinc-100 outline-none ring-0 focus:border-error-700"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-zinc-950">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
