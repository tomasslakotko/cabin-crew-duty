import { useFlightStore } from '../../stores/flightStore';
import { checklistKeyForPhaseStep, useChecklistStore } from '../../stores/checklistStore';
import type { FlightPhase } from '../../types/catering';
import { GuideCard } from './GuideCard';

interface InteractiveChecklistProps {
  phase: FlightPhase;
  steps: string[];
  forms: string[];
}

export function InteractiveChecklist({ phase, steps, forms }: InteractiveChecklistProps) {
  const flight = useFlightStore((s) => s.flight);
  const isDone = useChecklistStore((s) => s.isDone);
  const toggleItem = useChecklistStore((s) => s.toggleItem);
  const progress = useChecklistStore((s) => s.phaseProgress)(phase, steps.length);

  if (!flight) return null;

  const allDone = progress.done === progress.total && progress.total > 0;

  return (
    <GuideCard title="Interactive checklist">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {forms.map((form) => (
            <span
              key={form}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            >
              {form}
            </span>
          ))}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tabular-nums ${
            allDone
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {progress.done}/{progress.total}
        </span>
      </div>

      <ul className="space-y-2">
        {steps.map((step, index) => {
          const key = checklistKeyForPhaseStep(phase, index);
          const done = isDone(key);
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => void toggleItem(flight.id, key)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  done
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                    : 'border-gray-200 bg-white active:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:active:bg-gray-800'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold ${
                    done
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-gray-300 text-transparent dark:border-gray-500'
                  }`}
                >
                  ✓
                </span>
                <span
                  className={`text-sm ${
                    done
                      ? 'text-emerald-800 line-through dark:text-emerald-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {step}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </GuideCard>
  );
}
