export function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={`
        text-sm cursor-pointer transition-colors
        ${active ? "text-white" : "text-neutral-500 hover:text-amber-400 transition"}
      `}
    >
      {label}
    </span>
  );
}


export function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={`
        px-3 py-1 rounded-lg cursor-pointer transition-all
        ${active
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:text-amber-400 transition"}
      `}
    >
      {label}
    </span>
  );
}
export function LevelGroup({
  values,
  active,
  onSelect,
}: {
  values: number[];
  active: number | null;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="flex gap-3 ml-4">
      {values.map((v, vindx) => (
        <span
          key={vindx}
          onClick={() => onSelect(vindx + 1)} 
          className={`
            text-sm cursor-pointer transition-colors
            ${active === vindx + 1 ? "text-white" : "text-neutral-500 hover:text-amber-400 transition"}
          `}
        >
          {v}
        </span>
      ))}
    </div>
  );
}
