import type { Order } from '../../types';
import type { OrderRepository } from './types';

/** Stub for future Supabase Realtime sync */
export const remoteOrderRepository: OrderRepository = {
  async getAll() {
    throw new Error('Cloud sync not configured');
  },
  async getBySeat() {
    throw new Error('Cloud sync not configured');
  },
  async save(_order: Order) {
    throw new Error('Cloud sync not configured');
  },
  async delete() {
    throw new Error('Cloud sync not configured');
  },
  async deleteAllForFlight() {
    throw new Error('Cloud sync not configured');
  },
};
