import { create } from 'zustand';
import { localOrderRepository } from '../db/repositories';
import type { Order, OrderStatus } from '../types';
import { hapticLight, hapticSuccess } from '../lib/haptics';
import { allItemsServed, listServeItems, normalizeServedKeys } from '../lib/orderServing';
import { generateId } from '../lib/utils';

export interface UndoEntry {
  order: Order;
  label: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  lastUndo: UndoEntry | null;
  loadOrders: (flightId: string) => Promise<void>;
  saveOrder: (order: Order) => Promise<void>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  markItemsServed: (id: string, keys: string[]) => Promise<void>;
  undoLastAction: () => Promise<void>;
  dismissUndo: () => void;
  getBySeat: (seatId: string) => Order | undefined;
  getStatusCounts: () => { completed: number; in_progress: number; on_hold: number };
}

export function createEmptyOrder(flightId: string, seatId: string): Order {
  const now = Date.now();
  return {
    id: generateId(),
    flightId,
    seatId,
    passengerName: '',
    mealId: null,
    mealName: null,
    aperitifDrinks: [],
    drinks: [],
    notes: '',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    servingStartedAt: null,
  };
}

function normalizeOrder(order: Order): Order {
  const servedItemKeys = normalizeServedKeys(order);
  let status = order.status;
  if (allItemsServed({ ...order, servedItemKeys }) && status === 'in_progress') {
    status = 'completed';
  }
  return {
    ...order,
    aperitifDrinks: order.aperitifDrinks ?? [],
    drinks: order.drinks ?? [],
    servedItemKeys,
    status,
    servingStartedAt:
      status === 'in_progress'
        ? (order.servingStartedAt ?? order.updatedAt)
        : null,
  };
}

function undoLabel(prev: OrderStatus, next: OrderStatus, seatId: string): string {
  return `Seat ${seatId}: ${prev} → ${next}`;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  lastUndo: null,

  loadOrders: async (flightId) => {
    set({ loading: true });
    const orders = (await localOrderRepository.getAll(flightId)).map(normalizeOrder);
    set({ orders, loading: false });
  },

  saveOrder: async (order) => {
    const now = Date.now();
    const updated = normalizeOrder({
      ...order,
      updatedAt: now,
      servingStartedAt:
        order.status === 'in_progress' ? (order.servingStartedAt ?? now) : null,
    });
    await localOrderRepository.save(updated);
    const orders = get().orders.filter((o) => o.id !== updated.id);
    set({ orders: [...orders, updated].sort((a, b) => b.createdAt - a.createdAt) });
  },

  updateStatus: async (id, status) => {
    const order = get().orders.find((o) => o.id === id);
    if (!order || order.status === status) return;

    const now = Date.now();
    const servedItemKeys =
      status === 'completed'
        ? listServeItems(order).map((i) => i.key)
        : normalizeServedKeys(order);

    const updated = normalizeOrder({
      ...order,
      status,
      servedItemKeys,
      updatedAt: now,
      servingStartedAt: status === 'in_progress' ? now : null,
    });

    set({
      lastUndo: {
        order: { ...order },
        label: undoLabel(order.status, status, order.seatId),
      },
    });

    await localOrderRepository.save(updated);
    set({
      orders: get()
        .orders.map((o) => (o.id === id ? updated : o))
        .sort((a, b) => b.createdAt - a.createdAt),
    });

    if (status === 'completed') hapticSuccess();
    else hapticLight();
  },

  markItemsServed: async (id, keys) => {
    const order = get().orders.find((o) => o.id === id);
    if (!order || keys.length === 0) return;

    const now = Date.now();
    const merged = new Set([...normalizeServedKeys(order), ...keys]);
    const servedItemKeys = [...merged];
    const hasNewServe = keys.some((k) => !normalizeServedKeys(order).includes(k));
    if (!hasNewServe) return;

    let status = order.status;
    if (status === 'pending' || status === 'on_hold') status = 'in_progress';
    if (allItemsServed({ ...order, servedItemKeys })) status = 'completed';

    const updated = normalizeOrder({
      ...order,
      servedItemKeys,
      status,
      updatedAt: now,
      servingStartedAt:
        status === 'in_progress' ? (order.servingStartedAt ?? now) : order.servingStartedAt,
    });

    set({
      lastUndo: {
        order: { ...order },
        label: `Seat ${order.seatId}: served ${keys.length} item(s)`,
      },
    });

    await localOrderRepository.save(updated);
    set({
      orders: get()
        .orders.map((o) => (o.id === id ? updated : o))
        .sort((a, b) => b.createdAt - a.createdAt),
    });

    if (updated.status === 'completed') hapticSuccess();
    else hapticLight();
  },

  undoLastAction: async () => {
    const { lastUndo } = get();
    if (!lastUndo) return;

    const restored = normalizeOrder({ ...lastUndo.order });
    await localOrderRepository.save(restored);
    set({
      orders: get()
        .orders.map((o) => (o.id === restored.id ? restored : o))
        .sort((a, b) => b.createdAt - a.createdAt),
      lastUndo: null,
    });
    hapticLight();
  },

  dismissUndo: () => set({ lastUndo: null }),

  getBySeat: (seatId) => get().orders.find((o) => o.seatId === seatId),

  getStatusCounts: () => {
    const orders = get().orders;
    return {
      completed: orders.filter((o) => o.status === 'completed').length,
      in_progress: orders.filter((o) => o.status === 'in_progress').length,
      on_hold: orders.filter((o) => o.status === 'on_hold').length,
    };
  },
}));
