import { create } from 'zustand';
import { localOrderRepository, localStockRepository } from '../db/repositories';
import type { MealStock } from '../types';

interface StockState {
  stocks: MealStock[];
  remaining: Record<string, number>;
  loading: boolean;
  loadStocks: (flightId: string) => Promise<void>;
  updateStock: (stock: MealStock) => Promise<void>;
  saveAllStocks: (stocks: MealStock[]) => Promise<void>;
  refreshRemaining: (flightId: string) => Promise<void>;
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: [],
  remaining: {},
  loading: false,

  loadStocks: async (flightId) => {
    set({ loading: true });
    const stocks = await localStockRepository.getAll(flightId);
    const remaining: Record<string, number> = {};
    for (const stock of stocks) {
      remaining[stock.id] = await localStockRepository.getRemaining(flightId, stock.id);
    }
    set({ stocks, remaining, loading: false });
  },

  updateStock: async (stock) => {
    const { stocks } = get();
    const next = stocks.map((s) => (s.id === stock.id ? stock : s));
    await localStockRepository.saveAll(next);
    set({ stocks: next });
    await get().refreshRemaining(stock.flightId);
  },

  saveAllStocks: async (stocks) => {
    if (stocks.length === 0) return;
    await localStockRepository.saveAll(stocks);
    set({ stocks });
    await get().refreshRemaining(stocks[0].flightId);
  },

  refreshRemaining: async (flightId) => {
    const { stocks } = get();
    const orders = await localOrderRepository.getAll(flightId);
    const remaining: Record<string, number> = {};
    for (const stock of stocks) {
      const ordered = orders.filter((o) => o.mealId === stock.id).length;
      remaining[stock.id] = Math.max(0, stock.quantity - ordered);
    }
    set({ remaining });
  },
}));
