import { useMemo, useState } from 'react';
import {
  ALL_DESTINATIONS,
  BAND_LABELS,
  formatRoute,
  formatRouteCodes,
  HUB_CODE,
  HUB_DESTINATION,
  isValidRoute,
  type Destination,
  type FlightBand,
  searchAirports,
} from '../../data/flightBands';

type PickerField = 'origin' | 'destination';

interface FlightRouteModalProps {
  onConfirm: (origin: string, destination: string) => void;
  initialOrigin?: string;
  initialDestination?: string;
  onDismiss?: () => void;
}

export function FlightRouteModal({
  onConfirm,
  initialOrigin = HUB_CODE,
  initialDestination,
  onDismiss,
}: FlightRouteModalProps) {
  const [origin, setOrigin] = useState(initialOrigin.toUpperCase());
  const [destination, setDestination] = useState(initialDestination?.toUpperCase() ?? '');
  const [activeField, setActiveField] = useState<PickerField>(
    initialDestination ? 'origin' : 'destination',
  );
  const [query, setQuery] = useState('');
  const [bandFilter, setBandFilter] = useState<FlightBand | 'all'>('all');

  const routeValid = isValidRoute(origin, destination);

  const airports = useMemo(() => {
    let list = searchAirports(query, true);
    if (activeField === 'origin' && destination) {
      list = list.filter((a) => a.code !== destination);
    }
    if (activeField === 'destination' && origin) {
      list = list.filter((a) => a.code !== origin);
    }
    if (bandFilter !== 'all') {
      list = list.filter((a) => a.band === bandFilter || a.code === HUB_CODE);
    }
    return list;
  }, [query, bandFilter, activeField, origin, destination]);

  const grouped = useMemo(() => {
    const groups: Record<FlightBand, Destination[]> = { 1: [], 2: [], 3: [] };
    const hubShown = airports.some((a) => a.code === HUB_CODE);
    for (const a of airports) {
      if (a.code === HUB_CODE || !a.band) continue;
      groups[a.band].push({ code: a.code, city: a.city, band: a.band });
    }
    return { hubShown, groups };
  }, [airports]);

  function selectAirport(code: string) {
    if (activeField === 'origin') {
      setOrigin(code);
      if (code === destination) setDestination('');
      setActiveField('destination');
    } else {
      setDestination(code);
      if (code === origin) setOrigin('');
    }
    setQuery('');
  }

  function swapRoute() {
    setOrigin(destination);
    setDestination(origin);
  }

  function handleConfirm() {
    if (!routeValid) return;
    onConfirm(origin, destination);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="route-title"
      >
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="route-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Set your route
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Pick origin and destination to set flight band and menu sequence.
              </p>
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <RouteFieldButton
              label="From"
              code={origin}
              active={activeField === 'origin'}
              onClick={() => setActiveField('origin')}
            />
            <button
              type="button"
              onClick={swapRoute}
              disabled={!origin && !destination}
              title="Swap origin and destination"
              className="flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-gray-200 text-lg text-gray-600 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
            >
              ⇄
            </button>
            <RouteFieldButton
              label="To"
              code={destination}
              active={activeField === 'destination'}
              onClick={() => setActiveField('destination')}
            />
          </div>

          {origin && destination && (
            <p
              className={`mt-3 text-sm ${routeValid ? 'text-gray-600 dark:text-gray-400' : 'text-amber-600 dark:text-amber-400'}`}
            >
              {routeValid
                ? `${formatRoute(origin, destination)} (${formatRouteCodes(origin, destination)})`
                : 'One end of the route must be Belgrade (BEG).'}
            </p>
          )}

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${activeField === 'origin' ? 'origin' : 'destination'}…`}
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
          {grouped.hubShown && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Hub</p>
              <ul className="space-y-1">
                <AirportButton
                  code={HUB_DESTINATION.code}
                  city={HUB_DESTINATION.city}
                  selected={activeField === 'origin' ? origin === HUB_CODE : destination === HUB_CODE}
                  onSelect={selectAirport}
                />
              </ul>
            </div>
          )}

          {bandFilter === 'all' ? (
            ([1, 2, 3] as FlightBand[]).map((band) =>
              grouped.groups[band].length > 0 ? (
                <DestinationGroup
                  key={band}
                  band={band}
                  destinations={grouped.groups[band]}
                  selectedCode={activeField === 'origin' ? origin : destination}
                  onSelect={selectAirport}
                />
              ) : null,
            )
          ) : (
            <ul className="space-y-1">
              {airports
                .filter((a) => a.code !== HUB_CODE)
                .map((a) => (
                  <AirportButton
                    key={a.code}
                    code={a.code}
                    city={a.city}
                    band={a.band}
                    selected={activeField === 'origin' ? origin === a.code : destination === a.code}
                    onSelect={selectAirport}
                  />
                ))}
            </ul>
          )}
          {airports.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">No airports match your search.</p>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!routeValid}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-navy text-sm font-semibold text-white disabled:opacity-40"
          >
            Confirm route
          </button>
        </div>
      </div>
    </div>
  );
}

function RouteFieldButton({
  label,
  code,
  active,
  onClick,
}: {
  label: string;
  code: string;
  active: boolean;
  onClick: () => void;
}) {
  const airport = code ? searchAirports(code, true).find((a) => a.code === code) : undefined;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-xl border px-3 py-2 text-left ${
        active
          ? 'border-navy bg-navy/5 dark:border-blue-400 dark:bg-navy/20'
          : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
        {airport ? airport.city : 'Select…'}
      </p>
      {code && (
        <p className="font-mono text-xs font-bold text-navy dark:text-blue-300">{code}</p>
      )}
    </button>
  );
}

function DestinationGroup({
  band,
  destinations,
  selectedCode,
  onSelect,
}: {
  band: FlightBand;
  destinations: Destination[];
  selectedCode: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {BAND_LABELS[band]}
      </p>
      <ul className="space-y-1">
        {destinations.map((d) => (
          <AirportButton
            key={d.code}
            code={d.code}
            city={d.city}
            band={d.band}
            selected={selectedCode === d.code}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}

function AirportButton({
  code,
  city,
  band,
  selected,
  onSelect,
}: {
  code: string;
  city: string;
  band?: FlightBand;
  selected: boolean;
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
        onClick={() => onSelect(code)}
        className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-left ${
          selected
            ? 'bg-navy/10 ring-2 ring-navy dark:bg-navy/30 dark:ring-blue-400'
            : 'active:bg-gray-100 dark:active:bg-gray-700'
        }`}
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">{city}</span>
        <span className="flex items-center gap-2">
          {band && (
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${bandColors[band]}`}>
              B{band}
            </span>
          )}
          <span className="font-mono text-sm font-bold text-navy dark:text-blue-300">{code}</span>
        </span>
      </button>
    </li>
  );
}

export { ALL_DESTINATIONS };
