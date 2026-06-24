import { useEffect, useState, type ReactNode } from 'react';
import type { MealStock, Order } from '../../types';
import { beginDrinkRound } from '../../lib/orderServing';
import { AperitifServiceGuide } from '../flight/AperitifServiceGuide';
import { showAperitifServiceGuide } from '../../data/aperitifServiceGuide';
import { useFlightStore } from '../../stores/flightStore';
import { aperitifGuidance } from '../../data/flightBands';
import { AperitifPicker } from '../drinks/AperitifPicker';
import { DrinkLineRow } from '../drinks/DrinkLineRow';
import { DrinkPOS } from '../drinks/DrinkPOS';
import { WinePairingHint } from '../meals/WinePairingHint';

interface SeatSheetProps {
  seatId: string;
  order: Order;
  stocks: MealStock[];
  remaining: Record<string, number>;
  onSave: (order: Order) => void;
  onClose: () => void;
  layout?: 'sheet' | 'panel';
}

type DrinkPanel = 'none' | 'aperitif' | 'drinks';
type SheetMode = 'normal' | 'completed_prompt' | 'drink_round';

function initialMode(order: Order): SheetMode {
  return order.status === 'completed' ? 'completed_prompt' : 'normal';
}

export function SeatSheet({
  seatId,
  order: initialOrder,
  stocks,
  remaining,
  onSave,
  onClose,
  layout = 'sheet',
}: SeatSheetProps) {
  const flight = useFlightStore((s) => s.flight);
  const [order, setOrder] = useState(initialOrder);
  const [mode, setMode] = useState<SheetMode>(() => initialMode(initialOrder));
  const [drinkPanel, setDrinkPanel] = useState<DrinkPanel>('none');

  useEffect(() => {
    setOrder(initialOrder);
    setMode(initialMode(initialOrder));
    setDrinkPanel('none');
  }, [initialOrder]);

  const band = flight?.flightBand;
  const showAperitif = band === 2 || band === 3;
  const aperitifHint = band ? aperitifGuidance(band) : undefined;

  function selectMeal(stock: MealStock) {
    const base = remaining[stock.id] ?? 0;
    const avail = base + (order.mealId === stock.id ? 1 : 0);
    const isCurrentMeal = order.mealId === stock.id;
    if (!isCurrentMeal && avail <= 0) return;

    setOrder((prev) => ({
      ...prev,
      mealId: stock.id,
      mealName: stock.name,
    }));
  }

  function handleSave() {
    const hasContent =
      order.mealId ||
      order.drinks.length > 0 ||
      order.aperitifDrinks.length > 0 ||
      order.passengerName.trim();
    if (!hasContent) {
      onClose();
      return;
    }
    onSave({ ...order, updatedAt: Date.now() });
  }

  function startNewDrinkRound() {
    const next = beginDrinkRound(order);
    setOrder(next);
    setMode('drink_round');
    setDrinkPanel('drinks');
  }

  if (drinkPanel === 'aperitif') {
    return (
      <AperitifPicker
        initialDrinks={order.aperitifDrinks}
        onConfirm={(aperitifDrinks) => {
          setOrder((prev) => ({ ...prev, aperitifDrinks }));
          setDrinkPanel('none');
        }}
        onClose={() => setDrinkPanel('none')}
      />
    );
  }

  if (drinkPanel === 'drinks') {
    return (
      <DrinkPOS
        initialDrinks={order.drinks}
        onAdd={(drinks) => {
          setOrder((prev) => ({ ...prev, drinks }));
          setDrinkPanel('none');
        }}
        onClose={() => setDrinkPanel('none')}
      />
    );
  }

  if (mode === 'completed_prompt') {
    return (
      <SheetChrome seatId={seatId} onClose={onClose} layout={layout}>
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Order complete</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Add more drinks?</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Previous drinks are cleared. The meal stays on this order.
          </p>
        </div>

        {order.mealName && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Meal served
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <span className="mr-2 text-emerald-500">✓</span>
              {order.mealName}
            </p>
          </div>
        )}

        {order.passengerName.trim() && (
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            {order.passengerName.trim()}
          </p>
        )}

        <button
          type="button"
          onClick={startNewDrinkRound}
          className="mb-3 w-full min-h-[52px] rounded-2xl bg-navy text-base font-semibold text-white active:bg-navy-light"
        >
          Select new drinks
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[48px] rounded-2xl border border-gray-200 text-base font-semibold text-gray-600 dark:border-gray-600 dark:text-gray-300"
        >
          Close
        </button>
      </SheetChrome>
    );
  }

  if (mode === 'drink_round') {
    return (
      <SheetChrome seatId={seatId} onClose={onClose} layout={layout}>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy dark:text-blue-300">
            New drink round
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Seat {seatId}</h2>
        </div>

        {order.mealName && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-600 dark:bg-gray-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Meal (served)</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 line-through opacity-70 dark:text-gray-100">
              <span className="mr-2 text-emerald-500 no-underline">✓</span>
              {order.mealName}
            </p>
          </div>
        )}

        <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          New drinks
        </label>
        <button
          type="button"
          onClick={() => setDrinkPanel('drinks')}
          className="mb-3 w-full min-h-[52px] rounded-2xl border-2 border-dashed border-navy/30 bg-navy/5 text-base font-semibold text-navy active:bg-navy/10 dark:text-blue-300"
        >
          {order.drinks.length > 0 ? 'Edit drinks' : 'Select drinks'}
        </button>
        {order.drinks.length > 0 && (
          <ul className="mb-6 space-y-2 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
            {order.drinks.map((d, i) => (
              <DrinkLineRow key={i} drink={d} textClassName="text-sm text-gray-700 dark:text-gray-300" />
            ))}
          </ul>
        )}

        <button
          type="button"
          disabled={order.drinks.length === 0}
          onClick={handleSave}
          className="w-full min-h-[52px] rounded-2xl bg-navy text-base font-semibold text-white active:bg-navy-light disabled:opacity-40"
        >
          Save drink order
        </button>
      </SheetChrome>
    );
  }

  return (
    <SheetChrome seatId={seatId} onClose={onClose} layout={layout}>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        Passenger name
      </label>
      <input
        type="text"
        value={order.passengerName}
        onChange={(e) => setOrder((prev) => ({ ...prev, passengerName: e.target.value }))}
        placeholder="e.g. Brown, Leatham"
        className="mb-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />

      {showAperitif && (
        <>
          {band && showAperitifServiceGuide(band) && <AperitifServiceGuide band={band} compact />}
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Aperitif
            </label>
            {aperitifHint && <span className="text-xs text-gray-400">{aperitifHint}</span>}
          </div>
          <button
            type="button"
            onClick={() => setDrinkPanel('aperitif')}
            className="mb-3 w-full min-h-[52px] rounded-2xl border-2 border-dashed border-amber-400/50 bg-amber-50 text-base font-semibold text-amber-900 active:bg-amber-100 dark:border-amber-600/50 dark:bg-amber-900/20 dark:text-amber-200"
          >
            {order.aperitifDrinks.length > 0 ? 'Edit aperitif' : 'Select aperitif'}
          </button>
          {order.aperitifDrinks.length > 0 && (
            <ul className="mb-6 space-y-2 rounded-xl bg-amber-50/80 px-4 py-3 dark:bg-amber-900/10">
              {order.aperitifDrinks.map((d, i) => (
                <DrinkLineRow key={i} drink={d} textClassName="text-sm text-gray-700 dark:text-gray-300" />
              ))}
            </ul>
          )}
        </>
      )}

      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        Hot meal
      </label>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stocks.map((stock) => {
          const base = remaining[stock.id] ?? 0;
          const avail = base + (order.mealId === stock.id ? 1 : 0);
          const isSelected = order.mealId === stock.id;
          const disabled = !isSelected && avail <= 0;
          return (
            <button
              key={stock.id}
              type="button"
              disabled={disabled}
              onClick={() => selectMeal(stock)}
              className={`rounded-2xl border-2 px-4 py-4 text-left transition-colors ${
                isSelected
                  ? 'border-navy bg-navy/5'
                  : disabled
                    ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50'
                    : 'border-gray-200 bg-white active:bg-gray-50 dark:border-gray-600 dark:bg-gray-800'
              }`}
            >
              <div className="font-semibold text-navy dark:text-blue-300">{stock.name}</div>
              <div className="mt-1 text-sm text-gray-500">({avail} left)</div>
            </button>
          );
        })}
      </div>

      {order.mealName && (
        <div className="mb-6">
          <WinePairingHint mealName={order.mealName} />
        </div>
      )}

      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        Drinks with meal
      </label>
      <button
        type="button"
        onClick={() => setDrinkPanel('drinks')}
        className="mb-3 w-full min-h-[52px] rounded-2xl border-2 border-dashed border-navy/30 bg-navy/5 text-base font-semibold text-navy active:bg-navy/10 dark:text-blue-300"
      >
        {order.drinks.length > 0 ? 'Edit drinks' : 'Select drinks'}
      </button>
      {order.drinks.length > 0 && (
        <ul className="mb-6 space-y-2 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
          {order.drinks.map((d, i) => (
            <DrinkLineRow key={i} drink={d} textClassName="text-sm text-gray-700 dark:text-gray-300" />
          ))}
        </ul>
      )}

      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        Notes
      </label>
      <textarea
        value={order.notes}
        onChange={(e) => setOrder((prev) => ({ ...prev, notes: e.target.value }))}
        placeholder="Allergies, preferences..."
        rows={2}
        className="mb-6 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />

      <button
        type="button"
        onClick={handleSave}
        className="w-full min-h-[52px] rounded-2xl bg-navy text-base font-semibold text-white active:bg-navy-light"
      >
        Save order
      </button>
    </SheetChrome>
  );
}

function SheetChrome({
  seatId,
  onClose,
  layout,
  children,
}: {
  seatId: string;
  onClose: () => void;
  layout: 'sheet' | 'panel';
  children: ReactNode;
}) {
  const isPanel = layout === 'panel';

  return (
    <>
      {!isPanel && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden />}
      <div
        className={
          isPanel
            ? 'flex h-full min-h-0 flex-col overflow-y-auto bg-white dark:bg-gray-900'
            : 'fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl safe-area-bottom dark:bg-gray-900'
        }
      >
        {!isPanel && <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gray-300" />}
        <div className={`p-6 ${isPanel ? 'flex-1' : ''}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Seat {seatId}</h2>
              <p className="text-sm text-gray-500">A220-300 Business Class</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
