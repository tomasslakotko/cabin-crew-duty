import { useState, useEffect } from 'react';
import { lockPin } from '../lib/pinAuth';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BAND_LABELS, getDestination } from '../data/flightBands';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore } from '../stores/orderStore';
import { useStockStore } from '../stores/stockStore';
import { useThemeStore } from '../stores/themeStore';

export function SettingsPage() {
  const flight = useFlightStore((s) => s.flight);
  const resetFlight = useFlightStore((s) => s.resetFlight);
  const clearDestination = useFlightStore((s) => s.clearDestination);
  const flights = useFlightStore((s) => s.flights);
  const createFlight = useFlightStore((s) => s.createFlight);
  const switchFlight = useFlightStore((s) => s.switchFlight);
  const completeFlight = useFlightStore((s) => s.completeFlight);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const loadStocks = useStockStore((s) => s.loadStocks);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!flight) return;
    setResetting(true);
    try {
      await resetFlight();
      await loadOrders(flight.id);
      await loadStocks(flight.id);
      setConfirmReset(false);
    } finally {
      setResetting(false);
    }
  };

  if (!flight) return null;

  const dest = flight.destination ? getDestination(flight.destination) : undefined;

  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Security</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            PIN is required when you open the app. Lock now to require it again.
          </p>
          <button
            type="button"
            onClick={() => {
              lockPin();
              window.location.reload();
            }}
            className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            Lock app
          </button>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Appearance</h2>
          <label className="mt-4 flex min-h-12 cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-4 dark:bg-gray-900">
            <div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Dark mode</span>
              <p className="text-xs text-gray-500">Easier on eyes during night flights</p>
            </div>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="h-6 w-6 rounded"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Flight info</h2>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Flight number
          </label>
          <FlightNumberField />
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Aircraft</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">{flight.aircraft}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Date</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">{flight.date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Destination</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                {flight.destination
                  ? `${dest?.city ?? flight.destination} (${flight.destination})`
                  : 'Not set'}
              </dd>
            </div>
            {flight.flightBand && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Flight band</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  Band {flight.flightBand} — {BAND_LABELS[flight.flightBand].replace(/^Band \d — /, '')}
                </dd>
              </div>
            )}
          </dl>
          {flight.destination && (
            <button
              type="button"
              onClick={() => void clearDestination()}
              className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              Change destination
            </button>
          )}
          <Link
            to="/summary"
            className="mt-4 flex min-h-12 items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            End-of-flight summary
          </Link>
          <Link
            to="/catering"
            className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-navy text-sm font-semibold text-white"
          >
            Delivery notes guide
          </Link>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Flights today</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Switch legs or start a new flight. Each leg keeps its own orders and checklist.
          </p>
          <ul className="mt-4 space-y-2">
            {flights.map((f, i) => {
              const leg = f.flightNumber || `Leg ${flights.length - i}`;
              const active = f.id === flight.id;
              return (
                <li
                  key={f.id}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                    active ? 'bg-navy/10 dark:bg-navy/20' : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{leg}</p>
                    <p className="text-xs text-gray-500">
                      {f.destination ?? 'No destination'}
                      {f.status === 'completed' ? ' · Completed' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!active && (
                      <button
                        type="button"
                        onClick={() => void switchFlight(f.id)}
                        className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Open
                      </button>
                    )}
                    {active && f.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => void completeFlight(f.id)}
                        className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:text-emerald-400"
                      >
                        End leg
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => void createFlight()}
            className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-dashed border-navy/30 text-sm font-semibold text-navy dark:text-blue-300"
          >
            + New flight leg
          </button>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Cloud sync</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Multi-iPad sync via Supabase is coming soon.
          </p>
          <label className="mt-4 flex min-h-12 cursor-not-allowed items-center justify-between rounded-xl bg-gray-50 px-4 opacity-60 dark:bg-gray-900">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable cloud sync</span>
            <input
              type="checkbox"
              checked={syncEnabled}
              onChange={(e) => setSyncEnabled(e.target.checked)}
              disabled
              className="h-5 w-5 rounded"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900 dark:bg-gray-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-red-600">Reset flight</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Clears all seat orders and destination. Meal names and quantities are kept.
          </p>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="mt-4 min-h-12 rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400"
            >
              Reset flight orders
            </button>
          ) : (
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={resetting}
                className="min-h-12 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white disabled:opacity-50"
              >
                {resetting ? 'Resetting…' : 'Confirm reset'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-12 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 dark:border-gray-600 dark:text-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function FlightNumberField() {
  const flight = useFlightStore((s) => s.flight);
  const setFlightNumber = useFlightStore((s) => s.setFlightNumber);
  const [value, setValue] = useState(flight?.flightNumber ?? '');

  useEffect(() => {
    setValue(flight?.flightNumber ?? '');
  }, [flight?.flightNumber, flight?.id]);

  if (!flight) return null;

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => void setFlightNumber(value)}
      placeholder="e.g. JU 501"
      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-navy dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    />
  );
}
