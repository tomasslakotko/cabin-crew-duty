import type { Order } from '../../types';
import {
  countServed,
  isItemServed,
  listServeItems,
  remainingServeKeys,
  type ServeItem,
} from '../../lib/orderServing';
import { DrinkLineRow } from '../drinks/DrinkLineRow';
import { AperitifServiceGuide } from '../flight/AperitifServiceGuide';
import { useFlightStore } from '../../stores/flightStore';
import { showAperitifServiceGuide } from '../../data/aperitifServiceGuide';
import { WinePairingHint } from '../meals/WinePairingHint';

interface OrderServePanelProps {
  order: Order;
  onServeItem: (key: string) => void;
  onServeAll: () => void;
}

const KIND_LABELS = {
  aperitif: 'Aperitif',
  meal: 'Meal',
  drink: 'Drink',
} as const;

export function OrderServePanel({ order, onServeItem, onServeAll }: OrderServePanelProps) {
  const band = useFlightStore((s) => s.flight?.flightBand);
  const items = listServeItems(order);
  const hasAperitif = items.some((i) => i.kind === 'aperitif');
  const { served, total } = countServed(order);
  const remaining = remainingServeKeys(order);

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500">No items to serve on this order.</p>
    );
  }

  return (
    <div>
      {hasAperitif && band && showAperitifServiceGuide(band) && (
        <div className="mb-4">
          <AperitifServiceGuide band={band} compact />
        </div>
      )}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {served}/{total} served
        </p>
        {remaining.length > 0 && order.status !== 'completed' && (
          <button
            type="button"
            onClick={onServeAll}
            className="min-h-10 rounded-lg bg-navy px-3 text-xs font-semibold text-white"
          >
            Serve all
          </button>
        )}
      </div>

      {order.mealName && (
        <div className="mb-4">
          <WinePairingHint mealName={order.mealName} compact />
        </div>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <ServeItemRow
            key={item.key}
            order={order}
            item={item}
            onServe={() => onServeItem(item.key)}
          />
        ))}
      </ul>
    </div>
  );
}

function ServeItemRow({
  order,
  item,
  onServe,
}: {
  order: Order;
  item: ServeItem;
  onServe: () => void;
}) {
  const served = isItemServed(order, item.key);
  const drink =
    item.kind === 'aperitif' && item.index !== undefined
      ? order.aperitifDrinks[item.index]
      : item.kind === 'drink' && item.index !== undefined
        ? order.drinks[item.index]
        : null;

  return (
    <li
      className={`rounded-xl border px-3 py-3 ${
        served
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
          : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-semibold uppercase tracking-wide ${
              item.kind === 'aperitif' ? 'text-amber-600' : 'text-gray-400'
            }`}
          >
            {KIND_LABELS[item.kind]}
          </p>
          {drink ? (
            <DrinkLineRow drink={drink} textClassName="text-sm font-medium text-gray-800 dark:text-gray-200" />
          ) : (
            <p
              className={`text-sm font-semibold ${
                served
                  ? 'text-emerald-800 line-through dark:text-emerald-300'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {item.label}
            </p>
          )}
        </div>
        {served ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            ✓
          </span>
        ) : (
          <button
            type="button"
            onClick={onServe}
            disabled={order.status === 'completed'}
            className="min-h-10 shrink-0 rounded-xl bg-navy px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            Serve
          </button>
        )}
      </div>
    </li>
  );
}

export function serveProgressLabel(order: Order): string | null {
  const { served, total } = countServed(order);
  if (total === 0) return null;
  return `${served}/${total}`;
}
