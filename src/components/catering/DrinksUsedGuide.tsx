import { Link } from 'react-router-dom';
import type { DrinkUsageSummary } from '../../lib/flightSummary';
import type { FlightPhase } from '../../types/catering';
import { GuideCard } from './GuideCard';

const PHASE_HINTS: Record<FlightPhase, string> = {
  ground: 'Preliminary count — log drinks from Seat Map as passengers order.',
  after_takeoff:
    'Cross-check with VARIO on ABC bar / BoB lines. App count = orders taken, not AirPOS.',
  descent: 'Compare with closing count on delivery note. Explain any diff in Comment/Napomena.',
};

interface DrinksUsedGuideProps {
  usage: DrinkUsageSummary;
  phase: FlightPhase;
}

export function DrinksUsedGuide({ usage, phase }: DrinksUsedGuideProps) {
  return (
    <GuideCard title="Drinks used (from app)">
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{PHASE_HINTS[phase]}</p>

      <div className="mb-5 flex items-center gap-4 rounded-xl bg-navy/5 px-4 py-3 dark:bg-navy/20">
        <p className="text-4xl font-bold text-navy dark:text-blue-300">{usage.total}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          total drinks logged across all seat orders
        </p>
      </div>

      {usage.total === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No drinks logged yet.</p>
          <Link
            to="/"
            className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-navy px-4 text-sm font-semibold text-white"
          >
            Add drinks from Seat Map
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              By beverage (for ABC / bar cart)
            </h3>
            <ul className="space-y-2">
              {usage.byName.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-900"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                  <span className="text-lg font-bold text-navy dark:text-blue-300">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <details className="group rounded-xl border border-gray-100 dark:border-gray-700">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-700 marker:content-none dark:text-gray-300">
              <span className="group-open:hidden">Show detail with modifiers</span>
              <span className="hidden group-open:inline">Hide modifier detail</span>
            </summary>
            <ul className="space-y-2 border-t border-gray-100 px-4 py-3 dark:border-gray-700">
              {usage.byLine.map((item) => (
                <li
                  key={item.label}
                  className="flex justify-between gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="min-w-0 flex-1">{item.label}</span>
                  <span className="shrink-0 font-bold">{item.count}</span>
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
    </GuideCard>
  );
}
