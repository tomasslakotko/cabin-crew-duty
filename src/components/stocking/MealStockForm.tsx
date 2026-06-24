import type { MealStock } from '../../types';
import type { StockableMealOption } from '../../data/bandMenus';

interface MealStockFormProps {
  stock: MealStock;
  ordered: number;
  remaining: number;
  mealOptions: StockableMealOption[];
  onChange: (stock: MealStock) => void;
}

export function MealStockForm({
  stock,
  ordered,
  remaining,
  mealOptions,
  onChange,
}: MealStockFormProps) {
  const lowStock = remaining <= 2;
  const usePicker = mealOptions.length > 0;
  const selectedKey =
    mealOptions.find((o) => o.name === stock.name)?.key ??
    (stock.name ? '__custom__' : '');

  function pickMeal(key: string) {
    if (key === '__custom__' || key === '') {
      onChange({ ...stock, name: '' });
      return;
    }
    const option = mealOptions.find((o) => o.key === key);
    if (option) onChange({ ...stock, name: option.name });
  }

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-gray-800 ${
        lowStock
          ? 'border-amber-300 ring-1 ring-amber-200 dark:border-amber-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Meal {stock.sortOrder + 1}
          </label>
          {usePicker ? (
            <select
              value={selectedKey}
              onChange={(e) => pickMeal(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base font-medium text-navy outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-gray-600 dark:bg-gray-900 dark:text-blue-300"
            >
              <option value="">— Select from menu —</option>
              {groupOptions(mealOptions).map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.items.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.name}
                      {opt.vegetarian ? ' (V)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
              {stock.name && !mealOptions.some((o) => o.name === stock.name) && (
                <option value="__custom__">{stock.name} (current)</option>
              )}
            </select>
          ) : (
            <input
              type="text"
              value={stock.name}
              onChange={(e) => onChange({ ...stock, name: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-medium text-navy outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-gray-600 dark:bg-gray-900 dark:text-blue-300"
              placeholder="Meal name"
            />
          )}
          {usePicker && stock.name && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {mealOptions.find((o) => o.name === stock.name)?.menuLabel ?? 'From menu'}
            </p>
          )}
        </div>
        {lowStock && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Low stock
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...stock, quantity: Math.max(0, stock.quantity - 1) })}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl font-medium text-navy active:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-blue-300"
          >
            −
          </button>
          <span className="min-w-12 text-center text-2xl font-bold text-navy dark:text-blue-300">
            {stock.quantity}
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...stock, quantity: stock.quantity + 1 })}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl font-medium text-navy active:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-blue-300"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StockCounter label="Stocked" value={stock.quantity} />
        <StockCounter label="Ordered" value={ordered} variant="ordered" />
        <StockCounter label="Remaining" value={remaining} variant={lowStock ? 'warning' : 'remaining'} />
      </div>
    </div>
  );
}

function groupOptions(options: StockableMealOption[]) {
  const map = new Map<string, StockableMealOption[]>();
  for (const opt of options) {
    const list = map.get(opt.menuLabel) ?? [];
    list.push(opt);
    map.set(opt.menuLabel, list);
  }
  return [...map.entries()].map(([label, items]) => ({ label, items }));
}

function StockCounter({
  label,
  value,
  variant = 'default',
}: {
  label: string;
  value: number;
  variant?: 'default' | 'ordered' | 'remaining' | 'warning';
}) {
  const colors = {
    default: 'bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100',
    ordered: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    remaining: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    <div className={`rounded-xl px-3 py-3 text-center ${colors[variant]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</div>
    </div>
  );
}
