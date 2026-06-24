import type { MealStock, Order } from '../../types';

export interface OrderRepository {
  getAll(flightId: string): Promise<Order[]>;
  getBySeat(flightId: string, seatId: string): Promise<Order | undefined>;
  save(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
  deleteAllForFlight(flightId: string): Promise<void>;
}

export interface StockRepository {
  getAll(flightId: string): Promise<MealStock[]>;
  saveAll(stocks: MealStock[]): Promise<void>;
  getRemaining(flightId: string, mealId: string): Promise<number>;
}
