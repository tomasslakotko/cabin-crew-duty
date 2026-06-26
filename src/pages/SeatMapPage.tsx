import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MenuDiscussionGuide } from '../components/flight/MenuDiscussionGuide';
import { PageHeader } from '../components/layout/PageHeader';
import { SeatMap } from '../components/seat-map/SeatMap';
import { SeatSheet } from '../components/seat-map/SeatSheet';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore, createEmptyOrder } from '../stores/orderStore';
import { useStockStore } from '../stores/stockStore';
import type { Order } from '../types';

function SeatSheetSlot({
  seatId,
  order,
  layout,
  stocks,
  remaining,
  onSave,
  onClose,
}: {
  seatId: string;
  order: Order;
  layout: 'sheet' | 'panel';
  stocks: ReturnType<typeof useStockStore.getState>['stocks'];
  remaining: Record<string, number>;
  onSave: (order: Order) => void;
  onClose: () => void;
}) {
  return (
    <SeatSheet
      seatId={seatId}
      order={order}
      stocks={stocks}
      remaining={remaining}
      layout={layout}
      onSave={onSave}
      onClose={onClose}
    />
  );
}

export function SeatMapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const flight = useFlightStore((s) => s.flight);
  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const saveOrder = useOrderStore((s) => s.saveOrder);
  const getBySeat = useOrderStore((s) => s.getBySeat);
  const { stocks, remaining, loadStocks, refreshRemaining } = useStockStore();
  const [activeSeatId, setActiveSeatId] = useState<string | null>(null);
  const [draftOrder, setDraftOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (flight) {
      void loadOrders(flight.id);
      void loadStocks(flight.id);
    }
  }, [flight, loadOrders, loadStocks]);

  const openSeat = useCallback(
    (seatId: string) => {
      if (!flight) return;
      const existing = getBySeat(seatId);
      setActiveSeatId(seatId);
      setDraftOrder(existing ?? createEmptyOrder(flight.id, seatId));
    },
    [flight, getBySeat],
  );

  useEffect(() => {
    const seat = searchParams.get('seat');
    if (seat && flight) {
      openSeat(seat);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, flight, openSeat, setSearchParams]);

  async function handleSave(order: Order) {
    if (!flight) return;
    await saveOrder({ ...order, flightId: flight.id, updatedAt: Date.now() });
    await refreshRemaining(flight.id);
    setActiveSeatId(null);
    setDraftOrder(null);
  }

  function closeSheet() {
    setActiveSeatId(null);
    setDraftOrder(null);
  }

  const sheetProps =
    activeSeatId && draftOrder
      ? {
          seatId: activeSeatId,
          order: draftOrder,
          stocks,
          remaining,
          onSave: handleSave,
          onClose: closeSheet,
        }
      : null;

  return (
    <>
      <PageHeader title="Seat Map">
        <span className="rounded-full bg-navy/10 px-4 py-1.5 text-sm font-semibold text-navy">
          A220-300 · Business
        </span>
      </PageHeader>

      <div className="flex min-h-0 flex-1 flex-col landscape:flex-row">
        <div className="min-h-0 flex-1 overflow-y-auto p-6 landscape:min-w-0">
          {flight?.origin && flight?.destination && flight.flightBand && (
            <div className="mb-6">
              <MenuDiscussionGuide
                origin={flight.origin}
                destination={flight.destination}
                band={flight.flightBand}
              />
            </div>
          )}
          <SeatMap
            orders={orders}
            selectedSeatId={activeSeatId}
            onSeatPress={openSeat}
          />
        </div>

        {sheetProps && (
          <aside className="hidden min-h-0 w-[min(420px,42vw)] shrink-0 flex-col border-l border-gray-200 bg-white landscape:flex dark:border-gray-700 dark:bg-gray-900">
            <SeatSheetSlot {...sheetProps} layout="panel" />
          </aside>
        )}
      </div>

      {sheetProps && (
        <div className="landscape:hidden">
          <SeatSheetSlot {...sheetProps} layout="sheet" />
        </div>
      )}
    </>
  );
}
