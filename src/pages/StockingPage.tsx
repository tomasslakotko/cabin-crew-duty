import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { MealStockForm } from '../components/stocking/MealStockForm';
import { getBandMenuLabels, getStockableMeals, hasBandMenus } from '../data/bandMenus';
import { BAND_LABELS } from '../data/flightBands';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore } from '../stores/orderStore';
import { useStockStore } from '../stores/stockStore';

export function StockingPage() {
  const flight = useFlightStore((s) => s.flight);
  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const { stocks, remaining, loadStocks, updateStock, saveAllStocks } = useStockStore();
  const [menuFilter, setMenuFilter] = useState<string>('all');

  useEffect(() => {
    if (!flight) return;
    void loadOrders(flight.id);
    void loadStocks(flight.id);
  }, [flight, loadOrders, loadStocks]);

  const band = flight?.flightBand;
  const allMealOptions = useMemo(
    () => (band ? getStockableMeals(band) : []),
    [band],
  );
  const menuLabels = useMemo(() => (band ? getBandMenuLabels(band) : []), [band]);

  const mealOptions = useMemo(() => {
    if (menuFilter === 'all') return allMealOptions;
    return allMealOptions.filter((o) => o.menuLabel === menuFilter);
  }, [allMealOptions, menuFilter]);

  const hasLowStock = stocks.some((s) => (remaining[s.id] ?? 0) <= 2);
  const showMenuPicker = Boolean(band && hasBandMenus(band));

  async function selectMenuFilter(label: string) {
    setMenuFilter(label);
    if (label === 'all' || !flight || stocks.length === 0) return;

    const courses = allMealOptions.filter((o) => o.menuLabel === label);
    if (courses.length === 0) return;

    const sorted = [...stocks].sort((a, b) => a.sortOrder - b.sortOrder);
    const next = sorted.map((stock, index) => ({
      ...stock,
      name: courses[index]?.name ?? '',
    }));
    await saveAllStocks(next);
  }

  if (!flight) return null;

  return (
    <>
      <PageHeader title="Hot Meal Stocking" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {showMenuPicker
            ? 'Tap a service below to load its main courses into all 3 meal slots, then set quantities.'
            : 'Set today\'s three hot meal options and starting quantities. Set destination first to pick from the JC menu.'}
        </p>

        {showMenuPicker && band && (
          <div className="mb-6 rounded-2xl border border-navy/20 bg-navy/5 px-4 py-3 dark:border-blue-400/30 dark:bg-navy/20">
            <p className="text-sm font-semibold text-navy dark:text-blue-300">
              Band {band} — {BAND_LABELS[band].replace(/^Band \d — /, '')}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {allMealOptions.length} main courses in manual · tap a service to auto-fill meals
            </p>
          </div>
        )}

        {showMenuPicker && menuLabels.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <FilterChip
              label="All menus"
              active={menuFilter === 'all'}
              onClick={() => void selectMenuFilter('all')}
            />
            {menuLabels.map((label) => (
              <FilterChip
                key={label}
                label={label}
                active={menuFilter === label}
                onClick={() => void selectMenuFilter(label)}
              />
            ))}
          </div>
        )}

        {hasLowStock && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <p className="font-semibold">Low stock warning</p>
            <p className="mt-1 text-sm">One or more meals have 2 or fewer portions remaining.</p>
          </div>
        )}

        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          {stocks.map((stock) => {
            const ordered = orders.filter((o) => o.mealId === stock.id).length;
            return (
              <MealStockForm
                key={stock.id}
                stock={stock}
                ordered={ordered}
                remaining={remaining[stock.id] ?? stock.quantity}
                mealOptions={mealOptions}
                onChange={(updated) => void updateStock(updated)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function FilterChip({
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
      className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold ${
        active
          ? 'bg-navy text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}
