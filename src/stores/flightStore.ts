import { create } from 'zustand';
import { db } from '../db/schema';
import { localOrderRepository, localStockRepository } from '../db/repositories';
import type { FlightSession, MealStock } from '../types';
import { getBandForDestination } from '../data/flightBands';
import { generateId } from '../lib/utils';

const ACTIVE_FLIGHT_KEY = 'crew-duty-active-flight-id';

const DEFAULT_MEALS = [
  { name: 'Chicken Breast', quantity: 12 },
  { name: 'Beef Tenderloin', quantity: 10 },
  { name: 'Vegetarian Pasta', quantity: 8 },
];

interface FlightState {
  flights: FlightSession[];
  flight: FlightSession | null;
  initialized: boolean;
  initFlight: () => Promise<void>;
  switchFlight: (id: string) => Promise<void>;
  createFlight: (flightNumber?: string) => Promise<FlightSession>;
  completeFlight: (id: string) => Promise<void>;
  setFlightNumber: (flightNumber: string) => Promise<void>;
  setDestination: (destination: string) => Promise<void>;
  clearDestination: () => Promise<void>;
  resetFlight: () => Promise<void>;
}

function normalizeFlight(raw: FlightSession): FlightSession {
  return {
    ...raw,
    status: raw.status ?? 'active',
  };
}

async function createFlightWithStocks(flightNumber?: string): Promise<FlightSession> {
  const now = Date.now();
  const flight: FlightSession = {
    id: generateId(),
    date: new Date().toISOString().slice(0, 10),
    aircraft: 'A220-300',
    flightNumber: flightNumber?.trim() || undefined,
    status: 'active',
    createdAt: now,
  };
  await db.flights.add(flight);

  const stocks: MealStock[] = DEFAULT_MEALS.map((meal, index) => ({
    id: generateId(),
    flightId: flight.id,
    name: meal.name,
    quantity: meal.quantity,
    sortOrder: index as 0 | 1 | 2,
  }));
  await localStockRepository.saveAll(stocks);

  return flight;
}

function persistActiveFlightId(id: string) {
  localStorage.setItem(ACTIVE_FLIGHT_KEY, id);
}

function readActiveFlightId(): string | null {
  return localStorage.getItem(ACTIVE_FLIGHT_KEY);
}

async function pickActiveFlight(flights: FlightSession[]): Promise<FlightSession | null> {
  if (flights.length === 0) return null;

  const storedId = readActiveFlightId();
  const stored = storedId ? flights.find((f) => f.id === storedId) : undefined;
  if (stored) return stored;

  const active = flights.find((f) => f.status === 'active');
  if (active) return active;

  return flights[0];
}

export const useFlightStore = create<FlightState>((set, get) => ({
  flights: [],
  flight: null,
  initialized: false,

  initFlight: async () => {
    let flights = (await db.flights.orderBy('createdAt').reverse().toArray()).map(normalizeFlight);

    if (flights.length === 0) {
      const created = await createFlightWithStocks();
      flights = [created];
    }

    const active = await pickActiveFlight(flights);
    if (active) persistActiveFlightId(active.id);

    set({ flights, flight: active, initialized: true });
  },

  switchFlight: async (id) => {
    const flight = get().flights.find((f) => f.id === id);
    if (!flight) return;
    persistActiveFlightId(id);
    set({ flight });
  },

  createFlight: async (flightNumber) => {
    const flight = await createFlightWithStocks(flightNumber);
    persistActiveFlightId(flight.id);
    const flights = [flight, ...get().flights];
    set({ flights, flight });
    return flight;
  },

  completeFlight: async (id) => {
    const flights = get().flights.map((f) =>
      f.id === id
        ? { ...f, status: 'completed' as const, completedAt: Date.now() }
        : f,
    );
    const updated = flights.find((f) => f.id === id);
    if (updated) await db.flights.put(updated);

    const current = get().flight;
    if (current?.id === id) {
      const next = flights.find((f) => f.status === 'active' && f.id !== id) ?? flights[0];
      if (next) persistActiveFlightId(next.id);
      set({ flights, flight: next ?? null });
    } else {
      set({ flights });
    }
  },

  setFlightNumber: async (flightNumber) => {
    const flight = get().flight;
    if (!flight) return;
    const updated: FlightSession = {
      ...flight,
      flightNumber: flightNumber.trim() || undefined,
    };
    await db.flights.put(updated);
    set({
      flight: updated,
      flights: get().flights.map((f) => (f.id === updated.id ? updated : f)),
    });
  },

  setDestination: async (destination) => {
    const flight = get().flight;
    if (!flight) return;
    const code = destination.toUpperCase();
    const band = getBandForDestination(code);
    if (!band) return;

    const updated: FlightSession = { ...flight, destination: code, flightBand: band };
    await db.flights.put(updated);
    set({
      flight: updated,
      flights: get().flights.map((f) => (f.id === updated.id ? updated : f)),
    });
  },

  clearDestination: async () => {
    const flight = get().flight;
    if (!flight) return;
    const updated: FlightSession = { ...flight, destination: undefined, flightBand: undefined };
    await db.flights.put(updated);
    set({
      flight: updated,
      flights: get().flights.map((f) => (f.id === updated.id ? updated : f)),
    });
  },

  resetFlight: async () => {
    const flight = get().flight;
    if (!flight) return;
    await localOrderRepository.deleteAllForFlight(flight.id);
    const updated: FlightSession = {
      ...flight,
      destination: undefined,
      flightBand: undefined,
    };
    await db.flights.put(updated);
    set({
      flight: updated,
      flights: get().flights.map((f) => (f.id === updated.id ? updated : f)),
    });
  },
}));
