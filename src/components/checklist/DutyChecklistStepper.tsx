import {
  DUTY_CHECKLIST_SECTION_LABELS,
  DUTY_CHECKLIST_SECTIONS,
  dutySectionProgress,
  type DutyChecklistSectionId,
} from '../../data/dutyChecklists';
import { useChecklistStore } from '../../stores/checklistStore';

interface DutyChecklistStepperProps {
  active: DutyChecklistSectionId;
  onChange: (section: DutyChecklistSectionId) => void;
}

export function DutyChecklistStepper({ active, onChange }: DutyChecklistStepperProps) {
  const items = useChecklistStore((s) => s.items);

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DUTY_CHECKLIST_SECTIONS.map((section) => {
          const { done, total } = dutySectionProgress(section.id, items);
          const complete = done === total && total > 0;
          const isActive = section.id === active;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              className={`flex min-h-[44px] shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2 text-center transition-colors ${
                isActive
                  ? 'bg-navy text-white shadow-md'
                  : complete
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <span className="text-xs font-semibold leading-tight">
                {DUTY_CHECKLIST_SECTION_LABELS[section.id]}
              </span>
              <span
                className={`mt-0.5 text-[10px] font-bold tabular-nums ${
                  isActive ? 'text-white/80' : ''
                }`}
              >
                {done}/{total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
