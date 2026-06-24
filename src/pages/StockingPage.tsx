import { useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { MealStockForm } from '../components/stocking/MealStockForm';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore } from '../stores/orderStore';
import { useStockStore } from '../stores/stockStore';

export function StockingPage() {
  const flight = useFlightStore((s) => s.flight);
  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const { stocks, remaining, loadStocks, updateStock } = useStockStore();

  useEffect(() => {
    if (!flight) return;
    void loadOrders(flight.id);
    void loadStocks(flight.id);
  }, [flight, loadOrders, loadStocks]);

  const hasLowStock = stocks.some((s) => (remaining[s.id] ?? 0) <= 2);

  if (!flight) return null;

  return (
    <>
      <PageHeader title="Hot Meal Stocking" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-6 text-sm text-gray-600">
          Set today&apos;s three hot meal options and starting quantities. Stock is deducted when orders are placed.
        </p>

        {hasLowStock && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
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
                onChange={(updated) => void updateStock(updated)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
