import type { DrinkLine, OrderStatus } from '../types';
import { formatDrinkLine } from './drinkFormat';

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatOrderTime(timestamp: number): string {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${month} ${day} – ${time}`;
}

export { formatDrinkLine, drinkLineKey, formatModifierList } from './drinkFormat';

export function formatOrderSummary(
  mealName: string | null,
  drinks: DrinkLine[],
): string {
  const parts: string[] = [];
  if (mealName) parts.push(mealName);
  if (drinks.length > 0) {
    parts.push(drinks.map(formatDrinkLine).join(', '));
  }
  return parts.join(', ') || 'No items selected';
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  in_progress: 'Serving',
  completed: 'Done',
  on_hold: 'On Hold',
};

export function formatSeatDisplay(seatId: string): string {
  const match = seatId.match(/^(\d+)([A-Z])$/);
  if (!match) return seatId;
  return `${match[1].padStart(2, '0')}${match[2]}`;
}

export function getOrderItems(mealName: string | null, drinks: DrinkLine[]): string[] {
  const items: string[] = [];
  if (mealName) items.push(mealName);
  for (const drink of drinks) {
    items.push(formatDrinkLine(drink));
  }
  return items.length > 0 ? items : ['No items'];
}

export function displayPassengerName(name: string, seatId: string): string {
  return name.trim() || `Seat ${seatId}`;
}
