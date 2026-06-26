import { useState } from 'react';
import { FlightRouteLabel, hasCompleteRoute } from './FlightRouteLabel';
import { useFlightStore } from '../../stores/flightStore';

export function FlightSwitcher() {
  const flights = useFlightStore((s) => s.flights);
  const flight = useFlightStore((s) => s.flight);
  const switchFlight = useFlightStore((s) => s.switchFlight);
  const createFlight = useFlightStore((s) => s.createFlight);
  const completeFlight = useFlightStore((s) => s.completeFlight);
  const [open, setOpen] = useState(false);
  const [newNumber, setNewNumber] = useState('');

  if (!flight || flights.length === 0) return null;

  const label =
    flight.flightNumber ||
    `Leg ${flights.length - flights.findIndex((f) => f.id === flight.id)}`;

  async function handleCreate() {
    await createFlight(newNumber || undefined);
    setNewNumber('');
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-left dark:border-gray-600 dark:bg-gray-800"
      >
        <span className="text-sm font-bold text-navy dark:text-blue-300">{label}</span>
        {hasCompleteRoute(flight) && (
          <span className="hidden text-xs text-gray-500 sm:inline">
            <FlightRouteLabel
              origin={flight.origin}
              destination={flight.destination}
              codes
            />
          </span>
        )}
        {flight.status === 'completed' && (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
            Done
          </span>
        )}
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-full z-40 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-600 dark:bg-gray-900">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Flights today
            </p>
            <ul className="max-h-48 space-y-1 overflow-y-auto">
              {flights.map((f, i) => {
                const fLabel = f.flightNumber || `Leg ${flights.length - i}`;
                const active = f.id === flight.id;
                return (
                  <li key={f.id} className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        void switchFlight(f.id);
                        setOpen(false);
                      }}
                      className={`min-h-10 flex-1 rounded-xl px-3 py-2 text-left text-sm ${
                        active
                          ? 'bg-navy font-semibold text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{fLabel}</span>
                      {hasCompleteRoute(f) && (
                        <span className={`ml-1 text-xs ${active ? 'text-white/80' : 'text-gray-400'}`}>
                          <FlightRouteLabel origin={f.origin} destination={f.destination} codes />
                        </span>
                      )}
                      {f.status === 'completed' && !active && (
                        <span className="ml-1 text-xs text-emerald-600">✓</span>
                      )}
                    </button>
                    {f.status === 'active' && f.id === flight.id && (
                      <button
                        type="button"
                        title="Mark leg complete"
                        onClick={() => void completeFlight(f.id)}
                        className="shrink-0 rounded-xl border border-emerald-200 px-2 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                      >
                        End
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
              <p className="mb-2 px-1 text-xs font-semibold text-gray-500">New leg</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="Flight no. (optional)"
                  className="min-h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  className="shrink-0 rounded-xl bg-navy px-3 text-sm font-semibold text-white"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
