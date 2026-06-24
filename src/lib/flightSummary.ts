import type { MealStock, Order } from '../types';
import { USABLE_SEATS } from '../data/seatLayout';
import { formatDrinkLine } from './drinkFormat';
import { formatSeatDisplay, STATUS_LABELS } from './utils';

export interface DrinkUsageSummary {
  total: number;
  byLine: { label: string; count: number }[];
  byName: { name: string; count: number }[];
}

export function aggregateDrinkUsage(orders: Order[]): DrinkUsageSummary {
  const lineCounts = new Map<string, number>();
  const nameCounts = new Map<string, number>();
  let total = 0;

  for (const order of orders) {
    for (const drink of [...(order.aperitifDrinks ?? []), ...order.drinks]) {
      const label = formatDrinkLine({ ...drink, qty: 1 });
      lineCounts.set(label, (lineCounts.get(label) ?? 0) + drink.qty);
      const name = drink.variant ? `${drink.name} (${drink.variant})` : drink.name;
      nameCounts.set(name, (nameCounts.get(name) ?? 0) + drink.qty);
      total += drink.qty;
    }
  }

  const sortByCount = <T extends { count: number }>(a: T, b: T) => b.count - a.count;

  return {
    total,
    byLine: [...lineCounts.entries()].map(([label, count]) => ({ label, count })).sort(sortByCount),
    byName: [...nameCounts.entries()].map(([name, count]) => ({ name, count })).sort(sortByCount),
  };
}

export interface FlightSummary {
  totalOrders: number;
  completed: number;
  serving: number;
  pending: number;
  onHold: number;
  mealsServed: { name: string; count: number }[];
  drinksServed: { label: string; count: number }[];
  emptySeats: string[];
  ordersBySeat: { seatId: string; summary: string; status: string }[];
}

export function buildFlightSummary(orders: Order[], stocks: MealStock[]): FlightSummary {
  const orderedSeats = new Set(orders.map((o) => o.seatId));
  const emptySeats = USABLE_SEATS.filter((s) => !orderedSeats.has(s.id)).map((s) =>
    formatSeatDisplay(s.id),
  );

  const mealCounts = new Map<string, number>();
  const drinkUsage = aggregateDrinkUsage(orders);

  for (const order of orders) {
    if (order.mealName) {
      mealCounts.set(order.mealName, (mealCounts.get(order.mealName) ?? 0) + 1);
    }
  }

  const mealsServed = stocks
    .map((s) => ({ name: s.name, count: mealCounts.get(s.name) ?? 0 }))
    .filter((m) => m.count > 0);

  for (const [name, count] of mealCounts) {
    if (!mealsServed.some((m) => m.name === name)) {
      mealsServed.push({ name, count });
    }
  }

  const drinksServed = drinkUsage.byLine;

  return {
    totalOrders: orders.length,
    completed: orders.filter((o) => o.status === 'completed').length,
    serving: orders.filter((o) => o.status === 'in_progress').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    onHold: orders.filter((o) => o.status === 'on_hold').length,
    mealsServed,
    drinksServed,
    emptySeats,
    ordersBySeat: orders.map((o) => ({
      seatId: formatSeatDisplay(o.seatId),
      summary: [
        o.mealName,
        ...(o.aperitifDrinks ?? []).map((d) => `Aperitif: ${formatDrinkLine(d)}`),
        ...o.drinks.map((d) => formatDrinkLine(d)),
      ]
        .filter(Boolean)
        .join(', ') || '—',
      status: STATUS_LABELS[o.status],
    })),
  };
}

export function formatSummaryText(
  summary: FlightSummary,
  flightInfo: { aircraft: string; date: string },
): string {
  const lines = [
    'FLIGHT SUMMARY',
    `Aircraft: ${flightInfo.aircraft}`,
    `Date: ${flightInfo.date}`,
    '',
    `Orders: ${summary.totalOrders}`,
    `Done: ${summary.completed} | Serving: ${summary.serving} | Pending: ${summary.pending} | On hold: ${summary.onHold}`,
    '',
    'MEALS SERVED',
    ...(summary.mealsServed.length
      ? summary.mealsServed.map((m) => `  ${m.name}: ${m.count}`)
      : ['  —']),
    '',
    'DRINKS SERVED',
    ...(summary.drinksServed.length
      ? summary.drinksServed.map((d) => `  ${d.label}: ${d.count}`)
      : ['  —']),
    '',
    'SEATS WITHOUT ORDERS',
    ...(summary.emptySeats.length ? summary.emptySeats.map((s) => `  ${s}`) : ['  —']),
    '',
    'ALL ORDERS',
    ...summary.ordersBySeat.map((o) => `  ${o.seatId} [${o.status}]: ${o.summary}`),
  ];
  return lines.join('\n');
}
