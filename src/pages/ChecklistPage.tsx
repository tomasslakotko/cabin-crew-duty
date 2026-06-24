import { useEffect, useMemo, useState } from 'react';
import { DutyChecklistStepper } from '../components/checklist/DutyChecklistStepper';
import { DutyChecklistTable } from '../components/checklist/DutyChecklistTable';
import { PageHeader } from '../components/layout/PageHeader';
import {
  countDutyChecklistItems,
  DUTY_CHECKLIST_SECTIONS,
  dutyChecklistKey,
  dutySectionProgress,
  type DutyChecklistSectionId,
} from '../data/dutyChecklists';
import { useChecklistStore } from '../stores/checklistStore';
import { useFlightStore } from '../stores/flightStore';

export function ChecklistPage() {
  const flight = useFlightStore((s) => s.flight);
  const loadChecklist = useChecklistStore((s) => s.loadChecklist);
  const items = useChecklistStore((s) => s.items);
  const [section, setSection] = useState<DutyChecklistSectionId>('pre_boarding');

  useEffect(() => {
    if (flight) void loadChecklist(flight.id);
  }, [flight, loadChecklist]);

  const activeSection = DUTY_CHECKLIST_SECTIONS.find((s) => s.id === section)!;

  const overall = useMemo(() => {
    const total = countDutyChecklistItems();
    let done = 0;
    for (const s of DUTY_CHECKLIST_SECTIONS) {
      for (const row of s.rows) {
        if (items[dutyChecklistKey(s.id, row.id)]) done++;
      }
    }
    return { done, total };
  }, [items]);

  if (!flight) return null;

  return (
    <>
      <PageHeader title="Checklist" />
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tap each row when complete. Status turns green and progress is saved for this flight.
          </p>
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-bold tabular-nums ${
              overall.done === overall.total && overall.total > 0
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {overall.done}/{overall.total} done
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {DUTY_CHECKLIST_SECTIONS.map((s) => {
            const { done, total } = dutySectionProgress(s.id, items);
            const complete = done === total && total > 0;
            return (
              <span
                key={s.id}
                className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                  complete
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {s.title} {done}/{total}
              </span>
            );
          })}
        </div>
      </div>

      <DutyChecklistStepper active={section} onChange={setSection} />

      <div className="flex-1 overflow-y-auto p-4 pb-12">
        <DutyChecklistTable section={activeSection} />
      </div>
    </>
  );
}
