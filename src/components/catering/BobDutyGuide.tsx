import { useFlightStore } from '../../stores/flightStore';
import { checklistKeyForBob, useChecklistStore } from '../../stores/checklistStore';
import type { BobDuty } from '../../data/cateringConfig';
import { GuideCard } from './GuideCard';

interface BobDutyGuideProps {
  duties: BobDuty[];
  phaseLabel: string;
}

export function BobDutyGuide({ duties, phaseLabel }: BobDutyGuideProps) {
  const flight = useFlightStore((s) => s.flight);
  const items = useChecklistStore((s) => s.items);
  const toggleItem = useChecklistStore((s) => s.toggleItem);

  if (duties.length === 0 || !flight) return null;

  const doneCount = duties.filter((d) => items[checklistKeyForBob(d.id)]).length;

  return (
    <GuideCard title={`BOB procedure — ${phaseLabel}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manual 5.12 — tap each duty when complete on paper.
        </p>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold tabular-nums dark:bg-gray-800">
          {doneCount}/{duties.length}
        </span>
      </div>
      <ul className="space-y-2">
        {duties.map((duty) => {
          const key = checklistKeyForBob(duty.id);
          const done = Boolean(items[key]);
          return (
            <li key={duty.id}>
              <button
                type="button"
                onClick={() => void toggleItem(flight.id, key)}
                className={`flex w-full gap-3 rounded-xl border p-4 text-left ${
                  done
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                    : 'border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    done ? 'bg-emerald-500 text-white' : 'bg-navy text-white'
                  }`}
                >
                  {done ? '✓' : duty.position}
                </span>
                <div className="min-w-0">
                  <p
                    className={`font-medium ${
                      done
                        ? 'text-emerald-800 line-through dark:text-emerald-300'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {duty.label}
                  </p>
                  {duty.bandNote && (
                    <p className="mt-1 text-xs text-gray-500">{duty.bandNote}</p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </GuideCard>
  );
}
