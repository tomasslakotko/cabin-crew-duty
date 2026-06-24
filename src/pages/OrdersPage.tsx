import { useEffect } from 'react';
import { OrderBoard } from '../components/orders/OrderBoard';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore } from '../stores/orderStore';
import { remainingServeKeys } from '../lib/orderServing';

export function OrdersPage() {
  const flight = useFlightStore((s) => s.flight);
  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const markItemsServed = useOrderStore((s) => s.markItemsServed);

  useEffect(() => {
    if (flight) void loadOrders(flight.id);
  }, [flight, loadOrders]);

  if (!flight) return null;

  return (
    <OrderBoard
      orders={orders}
      onStatusChange={updateStatus}
      onServeItem={(id, key) => void markItemsServed(id, [key])}
      onServeAll={(id) => {
        const order = orders.find((o) => o.id === id);
        if (!order) return;
        void markItemsServed(id, remainingServeKeys(order));
      }}
    />
  );
}
