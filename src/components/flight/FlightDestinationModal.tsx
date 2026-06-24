import { useMemo, useState } from 'react';
import {
  ALL_DESTINATIONS,
  BAND_LABELS,
  type Destination,
  type FlightBand,
  searchDestinations,
} from '../../data/flightBands';

interface FlightDestinationModalProps {
  onSelect: (code: string) => void;
}

export function FlightDestinationModal({ onSelect }: FlightDestinationModalProps) {
  const [query, setQuery] = useState('');
  const [bandFilter, setBandFilter] = useState<FlightBand | 'all'>('all');

  const destinations = useMemo(() => {
    let list = searchDestinations(query);
    if (bandFilter !== 'all') list = list.filter((d) => d.band === bandFilter);
    return list;
  }, [query, bandFilter]);

  const grouped = useMemo(() => {
    const groups: Record<FlightBand, Destination[]> = { 1: [], 2: [], 3: [] };
    for (const d of destinations) groups[d.band].push(d);
    return groups;
  }, [destinations]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="destination-title"
      >
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <h2 id="destination-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Where are we flying today?
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select destination to set flight band and menu discussion sequence.
          </p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or airport code…"
            className="mt-4 w-full min-h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            autoFocus
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {(['all', 1, 2, 3] as const).map((b) => (
              <button
                key={String(b)}
                type="button"
                onClick={() => setBandFilter(b)}
                className={`min-h-9 rounded-lg px-3 text-xs font-semibold ${
                  bandFilter === b
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {b === 'all' ? 'All' : `Band ${b}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {bandFilter === 'all' ? (
            ([1, 2, 3] as FlightBand[]).map((band) =>
              grouped[band].length > 0 ? (
                <DestinationGroup
                  key={band}
                  band={band}
                  destinations={grouped[band]}
                  onSelect={onSelect}
                />
              ) : null,
            )
          ) : (
            <ul className="space-y-1">
              {destinations.map((d) => (
                <DestinationButton key={d.code} destination={d} onSelect={onSelect} />
              ))}
            </ul>
          )}
          {destinations.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">No destinations match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DestinationGroup({
  band,
  destinations,
  onSelect,
}: {
  band: FlightBand;
  destinations: Destination[];
  onSelect: (code: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {BAND_LABELS[band]}
      </p>
      <ul className="space-y-1">
        {destinations.map((d) => (
          <DestinationButton key={d.code} destination={d} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  );
}

function DestinationButton({
  destination,
  onSelect,
}: {
  destination: Destination;
  onSelect: (code: string) => void;
}) {
  const bandColors: Record<FlightBand, string> = {
    1: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
    2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    3: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  };

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(destination.code)}
        className="flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-left active:bg-gray-100 dark:active:bg-gray-700"
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">{destination.city}</span>
        <span className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${bandColors[destination.band]}`}>
            B{destination.band}
          </span>
          <span className="font-mono text-sm font-bold text-navy dark:text-blue-300">{destination.code}</span>
        </span>
      </button>
    </li>
  );
}

// re-export for band filter count sanity
export { ALL_DESTINATIONS };
