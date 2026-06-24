import type { Order, OrderStatus } from '../../types';
import { drinkLineKey } from '../../lib/drinkFormat';
import { isItemServed } from '../../lib/orderServing';
import { DrinkLineRow } from '../drinks/DrinkLineRow';
import { serveProgressLabel } from './OrderServePanel';
import { useElapsedTimer } from '../../hooks/useElapsedTimer';
import { useSwipe } from '../../hooks/useSwipe';
import {
  displayPassengerName,
  formatOrderTime,
  formatSeatDisplay,
  STATUS_LABELS,
} from '../../lib/utils';

interface OrderCardProps {
  order: Order;
  selected: boolean;
  onSelect: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const HEADER_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  in_progress: 'bg-amber-400 text-white dark:bg-amber-500',
  completed: 'bg-emerald-500 text-white dark:bg-emerald-600',
  on_hold: 'bg-red-400 text-white dark:bg-red-500',
};

export function OrderCard({ order, selected, onSelect, onStatusChange }: OrderCardProps) {
  const showServing = order.status === 'pending' || order.status === 'on_hold';
  const showDone = order.status === 'in_progress';
  const hasMeal = Boolean(order.mealName);
  const hasAperitif = (order.aperitifDrinks?.length ?? 0) > 0;
  const hasDrinks = order.drinks.length > 0;
  const elapsed = useElapsedTimer(
    order.status === 'in_progress' ? order.servingStartedAt : null,
  );

  const progress = serveProgressLabel(order);

  const canSwipeRight = showServing;
  const canSwipeLeft = showDone;

  const { offsetX, swipeHandlers } = useSwipe({
    enabled: canSwipeRight || canSwipeLeft,
    onSwipeRight: () => {
      if (canSwipeRight) onStatusChange(order.id, 'in_progress');
    },
    onSwipeLeft: () => {
      if (canSwipeLeft) onStatusChange(order.id, 'completed');
    },
  });

  const swipeHint =
    offsetX > 30 ? 'Serving →' : offsetX < -30 ? '← Done' : null;

  return (
    <article
      {...swipeHandlers}
      style={{ transform: offsetX ? `translateX(${offsetX}px)` : undefined }}
      className={`relative flex w-80 shrink-0 touch-pan-y flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all dark:bg-gray-800 ${
        selected
          ? 'border-navy shadow-lg ring-4 ring-navy/25 scale-[1.02] dark:border-blue-400 dark:ring-blue-400/25'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {swipeHint && (
        <div
          className={`pointer-events-none absolute inset-y-0 flex w-16 items-center justify-center text-xs font-bold ${
            offsetX > 0 ? 'left-0 text-navy' : 'right-0 text-emerald-600'
          }`}
        >
          {swipeHint}
        </div>
      )}

      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center justify-between px-4 py-4 text-left ${HEADER_COLOR[order.status]}`}
      >
        <div>
          <p className="text-4xl font-extrabold leading-none tracking-tight">
            {formatSeatDisplay(order.seatId)}
          </p>
          <p className="mt-1.5 text-sm opacity-80">
            {displayPassengerName(order.passengerName, order.seatId)}
          </p>
        </div>
        <div className="text-right">
          {elapsed && (
            <p className="mb-1 font-mono text-lg font-bold tabular-nums">{elapsed}</p>
          )}
          <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
            {STATUS_LABELS[order.status]}
          </span>
          {progress && (
            <p className="mt-1 text-xs font-bold tabular-nums opacity-90">{progress} served</p>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={onSelect}
        className="flex-1 p-4 text-left"
      >
        <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
          {formatOrderTime(order.createdAt)}
        </p>

        <div className="space-y-3">
          {hasAperitif && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                Aperitif
              </p>
              <ul className="space-y-2">
                {order.aperitifDrinks!.map((drink, i) => (
                  <li key={`ap-${drinkLineKey(drink)}`} className={itemServedClass(order, `aperitif:${i}`)}>
                    <DrinkLineRow drink={drink} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasMeal && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Meal
              </p>
              <p className={`text-lg font-semibold ${itemServedClass(order, 'meal', true)}`}>
                {isItemServed(order, 'meal') && <span className="mr-1 text-emerald-500">✓</span>}
                {order.mealName}
              </p>
            </div>
          )}
          {hasDrinks && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Drinks
              </p>
              <ul className="space-y-2">
                {order.drinks.map((drink, i) => (
                  <li key={drinkLineKey(drink)} className={itemServedClass(order, `drink:${i}`)}>
                    <DrinkLineRow drink={drink} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!hasMeal && !hasAperitif && !hasDrinks && (
            <p className="text-base text-gray-400 dark:text-gray-500">Nothing selected yet</p>
          )}
        </div>
      </button>

      {(showServing || showDone) && (
        <div className="flex flex-col gap-2 border-t border-gray-100 p-3 dark:border-gray-700">
          <p className="text-center text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Swipe → Serving · ← Done
          </p>
          {showServing && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(order.id, 'in_progress');
              }}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-white active:bg-navy-light"
            >
              <ServingIcon />
              Serving
            </button>
          )}
          {showDone && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(order.id, 'completed');
              }}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white active:bg-emerald-600"
            >
              <CheckIcon />
              Done
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function ServingIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h16M4 14h10" />
      <path d="M18 8v8l3-4-3-4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

function itemServedClass(order: Order, key: string, textOnly = false): string {
  if (!isItemServed(order, key)) return textOnly ? 'text-gray-900 dark:text-gray-100' : '';
  return textOnly
    ? 'text-emerald-700 line-through dark:text-emerald-300'
    : 'rounded-lg bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20';
}
