interface StatusPillsProps {
  completed: number;
  inProgress: number;
  onHold: number;
}

export function StatusPills({ completed, inProgress, onHold }: StatusPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Pill color="bg-emerald-100 text-emerald-800" label="Completed" count={completed} />
      <Pill color="bg-amber-100 text-amber-800" label="In Progress" count={inProgress} />
      <Pill color="bg-red-100 text-red-800" label="On Hold" count={onHold} />
    </div>
  );
}

function Pill({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${color}`}>
      <span className="font-bold">{count}</span>
      {label}
    </span>
  );
}
