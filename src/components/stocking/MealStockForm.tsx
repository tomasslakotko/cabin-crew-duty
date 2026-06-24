import type { MealStock } from '../../types';

interface MealStockFormProps {
  stock: MealStock;
  ordered: number;
  remaining: number;
  onChange: (stock: MealStock) => void;
}

export function MealStockForm({ stock, ordered, remaining, onChange }: MealStockFormProps) {
  const lowStock = remaining <= 2;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        lowStock ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Meal {stock.sortOrder + 1}
          </label>
          <input
            type="text"
            value={stock.name}
            onChange={(e) => onChange({ ...stock, name: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-medium text-navy outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
            placeholder="Meal name"
          />
        </div>
        {lowStock && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Low stock
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...stock, quantity: Math.max(0, stock.quantity - 1) })}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl font-medium text-navy active:bg-gray-100"
          >
            −
          </button>
          <span className="min-w-[3rem] text-center text-2xl font-bold text-navy">{stock.quantity}</span>
          <button
            type="button"
            onClick={() => onChange({ ...stock, quantity: stock.quantity + 1 })}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl font-medium text-navy active:bg-gray-100"
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
    default: 'bg-gray-50 text-gray-900',
    ordered: 'bg-blue-50 text-blue-800',
    remaining: 'bg-green-50 text-green-800',
    warning: 'bg-amber-50 text-amber-800',
  };

  return (
    <div className={`rounded-xl px-3 py-3 text-center ${colors[variant]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</div>
    </div>
  );
}
