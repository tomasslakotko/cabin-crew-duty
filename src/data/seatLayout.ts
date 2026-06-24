import type { SeatDefinition } from '../types';

export const SEAT_ROWS = Array.from({ length: 10 }, (_, i) => i + 1);
const LEFT_SEATS = ['A', 'C'];
const RIGHT_SEATS = ['D', 'E', 'F'];

export const SEAT_LAYOUT: SeatDefinition[] = SEAT_ROWS.flatMap((row) => [
  ...LEFT_SEATS.map((letter) => ({
    id: `${row}${letter}`,
    row,
    letter,
    blocked: false,
    side: 'left' as const,
  })),
  ...RIGHT_SEATS.map((letter) => ({
    id: `${row}${letter}`,
    row,
    letter,
    blocked: letter === 'E',
    side: 'right' as const,
  })),
]);

export const USABLE_SEATS = SEAT_LAYOUT.filter((s) => !s.blocked);

export function getSeatById(seatId: string): SeatDefinition | undefined {
  return SEAT_LAYOUT.find((s) => s.id === seatId);
}

const SEAT_SORT_INDEX = new Map(USABLE_SEATS.map((seat, index) => [seat.id, index]));

export function compareSeatIds(a: string, b: string): number {
  return (SEAT_SORT_INDEX.get(a) ?? 9999) - (SEAT_SORT_INDEX.get(b) ?? 9999);
}

export function parseSeatId(seatId: string): { row: number; letter: string } | null {
  const match = seatId.match(/^(\d+)([A-Z])$/);
  if (!match) return null;
  return { row: Number(match[1]), letter: match[2] };
}

export function sortOrdersBySeat<T extends { seatId: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => compareSeatIds(a.seatId, b.seatId));
}

export function groupOrdersByRow<T extends { seatId: string }>(
  items: T[],
): { row: number; left: T[]; right: T[] }[] {
  const byRow = new Map<number, T[]>();

  for (const item of items) {
    const parsed = parseSeatId(item.seatId);
    const row = getSeatById(item.seatId)?.row ?? parsed?.row ?? 0;
    if (!byRow.has(row)) byRow.set(row, []);
    byRow.get(row)!.push(item);
  }

  return SEAT_ROWS.filter((row) => byRow.has(row)).map((row) => {
    const rowOrders = sortOrdersBySeat(byRow.get(row)!);
    return {
      row,
      left: rowOrders.filter((o) => {
        const letter = parseSeatId(o.seatId)?.letter;
        return letter === 'A' || letter === 'C';
      }),
      right: rowOrders.filter((o) => {
        const letter = parseSeatId(o.seatId)?.letter;
        return letter === 'D' || letter === 'F';
      }),
    };
  });
}
