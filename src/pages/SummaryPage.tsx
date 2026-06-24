import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { buildFlightSummary, formatSummaryText } from '../lib/flightSummary';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore } from '../stores/orderStore';
import { useStockStore } from '../stores/stockStore';

export function SummaryPage() {
  const flight = useFlightStore((s) => s.flight);
  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const stocks = useStockStore((s) => s.stocks);
  const loadStocks = useStockStore((s) => s.loadStocks);

  useEffect(() => {
    if (!flight) return;
    void loadOrders(flight.id);
    void loadStocks(flight.id);
  }, [flight, loadOrders, loadStocks]);

  const summary = useMemo(
    () => (flight ? buildFlightSummary(orders, stocks) : null),
    [orders, stocks, flight],
  );

  const exportText = useMemo(() => {
    if (!summary || !flight) return '';
    return formatSummaryText(summary, { aircraft: flight.aircraft, date: flight.date });
  }, [summary, flight]);

  async function copySummary() {
    if (!exportText) return;
    await navigator.clipboard.writeText(exportText);
  }

  if (!flight || !summary) return null;

  return (
    <>
      <PageHeader title="Flight Summary" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Orders" value={summary.totalOrders} />
            <Stat label="Done" value={summary.completed} color="text-emerald-600" />
            <Stat label="Serving" value={summary.serving} color="text-amber-600" />
            <Stat label="Pending" value={summary.pending} color="text-blue-600" />
          </section>

          <SummaryBlock title="Meals served">
            {summary.mealsServed.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No meals ordered</p>
            ) : (
              <ul className="space-y-2">
                {summary.mealsServed.map((m) => (
                  <li
                    key={m.name}
                    className="flex justify-between text-base font-medium text-gray-800 dark:text-gray-200"
                  >
                    <span>{m.name}</span>
                    <span className="font-bold text-navy dark:text-blue-300">{m.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </SummaryBlock>

          <SummaryBlock title="Drinks served">
            {summary.drinksServed.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No drinks ordered</p>
            ) : (
              <ul className="space-y-2">
                {summary.drinksServed.map((d) => (
                  <li
                    key={d.label}
                    className="flex justify-between gap-4 text-sm text-gray-800 dark:text-gray-200"
                  >
                    <span className="min-w-0 flex-1">{d.label}</span>
                    <span className="shrink-0 font-bold">{d.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </SummaryBlock>

          <SummaryBlock title="Seats without orders">
            {summary.emptySeats.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">All seats have orders</p>
            ) : (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {summary.emptySeats.join(' · ')}
              </p>
            )}
          </SummaryBlock>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void copySummary()}
              className="min-h-[48px] rounded-xl bg-navy px-5 text-sm font-semibold text-white"
            >
              Copy summary
            </button>
            <Link
              to="/orders"
              className="flex min-h-[48px] items-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              Back to orders
            </Link>
          </div>

          <pre className="overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {exportText}
          </pre>
        </div>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  color = 'text-gray-900 dark:text-gray-100',
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  );
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      {children}
    </section>
  );
}
