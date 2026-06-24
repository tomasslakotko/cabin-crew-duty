import type { OrderStatus } from '../../types';

const SEAT_COLORS: Record<string, string> = {
  empty: 'bg-gray-100 border-gray-300 text-gray-600',
  pending: 'bg-blue-100 border-blue-400 text-blue-800',
  in_progress: 'bg-amber-100 border-amber-400 text-amber-900',
  completed: 'bg-green-100 border-green-500 text-green-800',
  on_hold: 'bg-red-50 border-red-300 text-red-700',
  blocked: 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed',
};

interface SeatProps {
  id: string;
  blocked: boolean;
  status?: OrderStatus | null;
  selected?: boolean;
  onPress: () => void;
}

export function Seat({ id, blocked, status, selected, onPress }: SeatProps) {
  if (blocked) {
    return (
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xs font-bold ${SEAT_COLORS.blocked}`}
        aria-hidden
      >
        {id.slice(-1)}
      </div>
    );
  }

  const colorKey = status ?? 'empty';
  return (
    <button
      type="button"
      onClick={onPress}
      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-xs font-bold transition-transform active:scale-95 ${
        SEAT_COLORS[colorKey]
      } ${selected ? 'ring-2 ring-navy ring-offset-2' : ''}`}
    >
      {id}
    </button>
  );
}
