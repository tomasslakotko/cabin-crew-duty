import { SEAT_LAYOUT, SEAT_ROWS } from '../../data/seatLayout';
import type { Order } from '../../types';
import { Seat } from './Seat';

interface SeatMapProps {
  orders: Order[];
  selectedSeatId: string | null;
  onSeatPress: (seatId: string) => void;
}

export function SeatMap({ orders, selectedSeatId, onSeatPress }: SeatMapProps) {
  const rows = SEAT_ROWS;

  function getOrderForSeat(seatId: string) {
    return orders.find((o) => o.seatId === seatId);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4 rounded-2xl bg-navy/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-navy">
        Galley
      </div>

      <div className="rounded-[3rem] border-4 border-gray-200 bg-white px-8 py-10 shadow-inner">
        {rows.map((row) => {
          const rowSeats = SEAT_LAYOUT.filter((s) => s.row === row);
          const left = rowSeats.filter((s) => s.side === 'left');
          const right = rowSeats.filter((s) => s.side === 'right');

          return (
            <div key={row} className="mb-4 flex items-center justify-center gap-4 last:mb-0">
              <div className="flex gap-3">
                {left.map((seat) => {
                  const order = getOrderForSeat(seat.id);
                  return (
                    <Seat
                      key={seat.id}
                      id={seat.id}
                      blocked={seat.blocked}
                      status={order?.status}
                      selected={selectedSeatId === seat.id}
                      onPress={() => onSeatPress(seat.id)}
                    />
                  );
                })}
              </div>

              <div className="flex w-10 flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-400">{row}</span>
                <div className="h-12 w-2 rounded-full bg-gray-200" />
              </div>

              <div className="flex gap-3">
                {right.map((seat) => {
                  const order = getOrderForSeat(seat.id);
                  return (
                    <Seat
                      key={seat.id}
                      id={seat.id}
                      blocked={seat.blocked}
                      status={order?.status}
                      selected={selectedSeatId === seat.id}
                      onPress={() => !seat.blocked && onSeatPress(seat.id)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-gray-100 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
        Lavatory
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
        <Legend color="bg-gray-100 border-gray-300" label="Empty" />
        <Legend color="bg-blue-100 border-blue-400" label="Pending" />
        <Legend color="bg-amber-100 border-amber-400" label="Serving" />
        <Legend color="bg-green-100 border-green-500" label="Completed" />
        <Legend color="bg-gray-200 border-gray-300" label="Blocked (E)" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded border-2 ${color}`} />
      {label}
    </span>
  );
}
