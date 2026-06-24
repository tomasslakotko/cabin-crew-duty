import { db } from '../schema';
import type { OrderRepository } from './types';

export const localOrderRepository: OrderRepository = {
  async getAll(flightId) {
    return db.orders.where('flightId').equals(flightId).sortBy('createdAt');
  },

  async getBySeat(flightId, seatId) {
    return db.orders.where({ flightId, seatId }).first();
  },

  async save(order) {
    await db.orders.put(order);
  },

  async delete(id) {
    await db.orders.delete(id);
  },

  async deleteAllForFlight(flightId) {
    await db.orders.where('flightId').equals(flightId).delete();
  },
};
