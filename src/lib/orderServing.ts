import type { Order } from '../types';
import { formatDrinkLine } from './drinkFormat';

export type ServeItemKind = 'aperitif' | 'meal' | 'drink';

export interface ServeItem {
  key: string;
  kind: ServeItemKind;
  label: string;
  index?: number;
}

export function listServeItems(order: Order): ServeItem[] {
  const items: ServeItem[] = [];

  order.aperitifDrinks?.forEach((drink, index) => {
    items.push({
      key: `aperitif:${index}`,
      kind: 'aperitif',
      label: formatDrinkLine(drink),
      index,
    });
  });

  if (order.mealName) {
    items.push({
      key: 'meal',
      kind: 'meal',
      label: order.mealName,
    });
  }

  order.drinks.forEach((drink, index) => {
    items.push({
      key: `drink:${index}`,
      kind: 'drink',
      label: formatDrinkLine(drink),
      index,
    });
  });

  return items;
}

export function normalizeServedKeys(order: Order): string[] {
  const valid = new Set(listServeItems(order).map((i) => i.key));
  return (order.servedItemKeys ?? []).filter((k) => valid.has(k));
}

export function isItemServed(order: Order, key: string): boolean {
  return normalizeServedKeys(order).includes(key);
}

export function countServed(order: Order): { served: number; total: number } {
  const items = listServeItems(order);
  const served = normalizeServedKeys(order).length;
  return { served, total: items.length };
}

export function allItemsServed(order: Order): boolean {
  const { served, total } = countServed(order);
  return total > 0 && served === total;
}

export function remainingServeKeys(order: Order): string[] {
  const served = new Set(normalizeServedKeys(order));
  return listServeItems(order)
    .map((i) => i.key)
    .filter((k) => !served.has(k));
}

/** Start a new drink round on a completed order — keeps meal, clears everything else. */
export function beginDrinkRound(order: Order): Order {
  return {
    ...order,
    drinks: [],
    aperitifDrinks: [],
    notes: '',
    status: 'pending',
    servedItemKeys: order.mealName ? ['meal'] : [],
    servingStartedAt: null,
    updatedAt: Date.now(),
  };
}
