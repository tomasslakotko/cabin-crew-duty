import { db } from '../schema';
import type { StockRepository } from './types';
import { localOrderRepository } from './localOrderRepository';

export const localStockRepository: StockRepository = {
  async getAll(flightId) {
    const stocks = await db.mealStocks.where('flightId').equals(flightId).toArray();
    return stocks.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async saveAll(stocks) {
    await db.mealStocks.bulkPut(stocks);
  },

  async getRemaining(flightId, mealId) {
    const stock = await db.mealStocks.get(mealId);
    if (!stock) return 0;

    const orders = await localOrderRepository.getAll(flightId);
    const ordered = orders.filter((o) => o.mealId === mealId).length;
    return Math.max(0, stock.quantity - ordered);
  },
};
