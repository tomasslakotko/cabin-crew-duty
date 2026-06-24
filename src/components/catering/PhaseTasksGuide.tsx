import { InteractiveChecklist } from './InteractiveChecklist';
import { PHASE_PAPER_TASKS, SEAL_RULES, SIGNOFF_GUIDE } from '../../data/cateringGuide';
import type { FlightPhase } from '../../types/catering';
import { GuideCard } from './GuideCard';

interface PhaseTasksGuideProps {
  phase: FlightPhase;
  showSignoff?: boolean;
}

export function PhaseTasksGuide({ phase, showSignoff }: PhaseTasksGuideProps) {
  const { steps, forms } = PHASE_PAPER_TASKS[phase];

  return (
    <>
      <InteractiveChecklist phase={phase} steps={steps} forms={forms} />

      {(phase === 'ground' || phase === 'descent') && (
        <GuideCard title="Seal rules (quick reference)">
          <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {SEAL_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </GuideCard>
      )}

      {showSignoff && (
        <GuideCard title={SIGNOFF_GUIDE.title}>
          <ul className="space-y-3">
            {SIGNOFF_GUIDE.fields.map((field) => (
              <li key={field.label} className="text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{field.label}</span>
                <span className="text-gray-600 dark:text-gray-400"> — {field.where}</span>
              </li>
            ))}
          </ul>
        </GuideCard>
      )}
    </>
  );
}
