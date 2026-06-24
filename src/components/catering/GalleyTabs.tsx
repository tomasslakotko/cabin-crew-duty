import type { Galley } from '../../types/catering';
import { GALLEY_LABELS } from '../../data/cateringConfig';

interface GalleyTabsProps {
  active: Galley;
  onChange: (galley: Galley) => void;
}

export function GalleyTabs({ active, onChange }: GalleyTabsProps) {
  const galleys: Galley[] = ['fwd', 'aft'];
  return (
    <div className="flex gap-2 px-4 py-3">
      {galleys.map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          className={`min-h-[44px] flex-1 rounded-xl text-sm font-bold ${
            active === g
              ? 'bg-navy text-white'
              : 'border border-gray-200 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          {GALLEY_LABELS[g]}
        </button>
      ))}
    </div>
  );
}
