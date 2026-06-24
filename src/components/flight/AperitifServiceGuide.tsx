import type { FlightBand } from '../../data/flightBands';
import { APERITIF_SERVICE_RULES, aperitifBandNote } from '../../data/aperitifServiceGuide';
import { GuideCard } from '../catering/GuideCard';

interface AperitifServiceGuideProps {
  band: FlightBand;
  compact?: boolean;
}

export function AperitifServiceGuide({ band, compact = false }: AperitifServiceGuideProps) {
  const bandNote = aperitifBandNote(band);
  if (!bandNote) return null;

  if (compact) {
    return (
      <details className="mb-3 rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-900/10">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-amber-900 marker:content-none dark:text-amber-200">
          Aperitif service rules (Band {band})
        </summary>
        <div className="border-t border-amber-200 px-4 py-3 dark:border-amber-800">
          <p className="mb-2 text-xs text-amber-800 dark:text-amber-300">{bandNote}</p>
          <ul className="list-inside list-disc space-y-1 text-xs text-gray-700 dark:text-gray-300">
            {APERITIF_SERVICE_RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </details>
    );
  }

  return (
    <GuideCard
      title="Aperitif service"
      badge={
        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
          Band {band}
        </span>
      }
    >
      <p className="mb-4 text-sm font-medium text-amber-900 dark:text-amber-200">{bandNote}</p>
      <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {APERITIF_SERVICE_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </GuideCard>
  );
}
