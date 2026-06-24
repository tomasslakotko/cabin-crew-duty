export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export type DrinkModifier = 'ice' | 'lemon' | 'sugar' | 'milk';

export interface DrinkModifiers {
  ice?: boolean;
  lemon?: boolean;
  sugar?: boolean;
  milk?: boolean;
}

export interface DrinkLine {
  name: string;
  variant?: string;
  qty: number;
  modifiers?: DrinkModifiers;
}

export interface FlightSession {
  id: string;
  date: string;
  aircraft: 'A220-300';
  /** e.g. JU 501 — shown in flight switcher */
  flightNumber?: string;
  status: 'active' | 'completed';
  destination?: string;
  flightBand?: 1 | 2 | 3;
  createdAt: number;
  completedAt?: number;
}

export interface MealStock {
  id: string;
  flightId: string;
  name: string;
  quantity: number;
  sortOrder: 0 | 1 | 2;
}

export interface Order {
  id: string;
  flightId: string;
  seatId: string;
  passengerName: string;
  mealId: string | null;
  mealName: string | null;
  aperitifDrinks: DrinkLine[];
  drinks: DrinkLine[];
  notes: string;
  status: OrderStatus;
  /** Keys of individually served lines — meal, aperitif:0, drink:1, etc. */
  servedItemKeys?: string[];
  createdAt: number;
  updatedAt: number;
  servingStartedAt?: number | null;
}

export interface SeatDefinition {
  id: string;
  row: number;
  letter: string;
  blocked: boolean;
  side: 'left' | 'right';
}

export interface DrinkItem {
  id: string;
  name: string;
  productName?: string;
  description?: string;
  image?: string;
  variants?: string[];
  modifiers?: DrinkModifier[];
}

export interface DrinkCategory {
  id: string;
  label: string;
  items: DrinkItem[];
}
