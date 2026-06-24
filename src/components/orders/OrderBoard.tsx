import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderStatus } from '../../types';
import { groupOrdersByRow, sortOrdersBySeat } from '../../data/seatLayout';
import { OrderCard } from './OrderCard';
import { StatusPills } from './StatusPills';
import { OrderServePanel } from './OrderServePanel';
import { STATUS_LABELS, displayPassengerName, formatSeatDisplay } from '../../lib/utils';

type Tab = 'all' | OrderStatus;
type ViewMode = 'by_row' | 'flat';

const VIEW_KEY = 'crew-duty-orders-view';

interface OrderBoardProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onServeItem: (id: string, key: string) => void;
  onServeAll: (id: string) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'Serving' },
  { id: 'completed', label: 'Completed' },
  { id: 'on_hold', label: 'On Hold' },
];

function getInitialView(): ViewMode {
  const stored = localStorage.getItem(VIEW_KEY);
  return stored === 'flat' ? 'flat' : 'by_row';
}

export function OrderBoard({ orders, onStatusChange, onServeItem, onServeAll }: OrderBoardProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialView);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return tab === 'all' ? orders : orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  const rows = useMemo(() => groupOrdersByRow(filtered), [filtered]);
  const flatOrders = useMemo(() => sortOrdersBySeat(filtered), [filtered]);

  const counts = useMemo(
    () => ({
      completed: orders.filter((o) => o.status === 'completed').length,
      in_progress: orders.filter((o) => o.status === 'in_progress').length,
      on_hold: orders.filter((o) => o.status === 'on_hold').length,
    }),
    [orders],
  );

  const selected = orders.find((o) => o.id === selectedId);

  function setView(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(VIEW_KEY, mode);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Tickets</h1>
          <StatusPills
            completed={counts.completed}
            inProgress={counts.in_progress}
            onHold={counts.on_hold}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                  tab === t.id
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            <ViewToggle label="By row" active={viewMode === 'by_row'} onClick={() => setView('by_row')} />
            <ViewToggle label="All" active={viewMode === 'flat'} onClick={() => setView('flat')} />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col landscape:flex-row">
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500">No orders in this category</p>
          ) : viewMode === 'flat' ? (
            <div className="flex flex-wrap gap-4">
              {flatOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  selected={selectedId === order.id}
                  onSelect={() => setSelectedId(order.id)}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {rows.map(({ row, left, right }) => (
                <section key={row}>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Row {row}
                  </p>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-wrap gap-4">
                      {left.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          selected={selectedId === order.id}
                          onSelect={() => setSelectedId(order.id)}
                          onStatusChange={onStatusChange}
                        />
                      ))}
                    </div>
                    <div className="mx-1 flex w-8 shrink-0 flex-col items-center self-stretch py-4">
                      <span className="text-xs font-bold text-gray-300 dark:text-gray-600">{row}</span>
                      <div className="mt-2 w-0.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {right.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          selected={selectedId === order.id}
                          onSelect={() => setSelectedId(order.id)}
                          onStatusChange={onStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <aside className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900 landscape:w-80 landscape:shrink-0 landscape:border-l landscape:border-t-0 landscape:overflow-y-auto lg:w-80 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Selected</p>
            <p className="mt-1 text-4xl font-extrabold text-navy dark:text-blue-300">
              {formatSeatDisplay(selected.seatId)}
            </p>
            <p className="mt-1 text-base font-medium text-gray-700 dark:text-gray-300">
              {displayPassengerName(selected.passengerName, selected.seatId)}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {STATUS_LABELS[selected.status]}
            </p>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Serve separately
              </p>
              <OrderServePanel
                order={selected}
                onServeItem={(key) => onServeItem(selected.id, key)}
                onServeAll={() => onServeAll(selected.id)}
              />
            </div>

            {selected.notes && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-xs font-medium text-gray-500">Notes</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{selected.notes}</p>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {selected.status !== 'in_progress' && selected.status !== 'completed' && (
                <ActionButton
                  label="Serving"
                  color="bg-navy text-white"
                  onClick={() => onStatusChange(selected.id, 'in_progress')}
                />
              )}
              {selected.status !== 'completed' && (
                <ActionButton
                  label="Done"
                  color="bg-emerald-500 text-white"
                  onClick={() => onStatusChange(selected.id, 'completed')}
                />
              )}
              {selected.status !== 'on_hold' && selected.status !== 'completed' && (
                <ActionButton
                  label="Hold"
                  color="bg-red-500 text-white"
                  onClick={() => onStatusChange(selected.id, 'on_hold')}
                />
              )}
              {selected.status === 'on_hold' && (
                <ActionButton
                  label="Resume"
                  color="bg-blue-500 text-white"
                  onClick={() => onStatusChange(selected.id, 'pending')}
                />
              )}
              <ActionButton
                label={selected.status === 'completed' ? 'Add drinks' : 'Edit'}
                color="bg-navy text-white"
                onClick={() => navigate(`/?seat=${selected.seatId}`)}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function ViewToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[40px] rounded-lg px-4 text-sm font-semibold transition-colors ${
        active
          ? 'bg-white text-navy shadow-sm dark:bg-gray-700 dark:text-blue-300'
          : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      {label}
    </button>
  );
}

function ActionButton({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-xl px-4 text-sm font-semibold ${color}`}
    >
      {label}
    </button>
  );
}
