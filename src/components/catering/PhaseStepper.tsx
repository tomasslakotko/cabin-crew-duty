import type { FlightPhase } from '../../types/catering';
import { PHASE_HINTS, PHASE_LABELS } from '../../data/cateringConfig';

const PHASES: FlightPhase[] = ['ground', 'after_takeoff', 'descent'];

interface PhaseStepperProps {
  active: FlightPhase;
  onChange: (phase: FlightPhase) => void;
}

export function PhaseStepper({ active, onChange }: PhaseStepperProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap gap-2">
        {PHASES.map((phase) => (
          <button
            key={phase}
            type="button"
            onClick={() => onChange(phase)}
            className={`min-h-[44px] rounded-xl px-4 text-sm font-semibold ${
              active === phase
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {PHASE_LABELS[phase]}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{PHASE_HINTS[active]}</p>
    </div>
  );
}
