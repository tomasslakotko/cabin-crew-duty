import Dexie, { type Table } from 'dexie';
import type {
  BobDutyCheck,
  CateringCart,
  CateringLineItem,
  CateringPhaseState,
  CateringSignoff,
  ChecklistItemState,
  SealGroup,
} from '../types/catering';
import type { FlightSession, MealStock, Order } from '../types';

export class CabinCrewDB extends Dexie {
  flights!: Table<FlightSession, string>;
  mealStocks!: Table<MealStock, string>;
  orders!: Table<Order, string>;
  sealGroups!: Table<SealGroup, string>;
  cateringCarts!: Table<CateringCart, string>;
  cateringLineItems!: Table<CateringLineItem, string>;
  cateringSignoffs!: Table<CateringSignoff, string>;
  bobDutyChecks!: Table<BobDutyCheck, string>;
  cateringPhases!: Table<CateringPhaseState, string>;
  checklistItems!: Table<ChecklistItemState, [string, string]>;

  constructor() {
    super('CabinCrewDuty');
    this.version(1).stores({
      flights: 'id, date, createdAt',
      mealStocks: 'id, flightId, sortOrder',
      orders: 'id, flightId, seatId, status, mealId, createdAt',
    });
    this.version(2).stores({
      flights: 'id, date, createdAt',
      mealStocks: 'id, flightId, sortOrder',
      orders: 'id, flightId, seatId, status, mealId, createdAt',
      sealGroups: 'id, flightId, galley, listType, direction',
      cateringCarts: 'id, flightId, galley, listType, sortOrder',
      cateringLineItems: 'id, cartId',
      cateringSignoffs: 'flightId',
      bobDutyChecks: 'flightId, dutyId',
      cateringPhases: 'flightId, phase',
    });
    this.version(3).stores({
      flights: 'id, date, status, createdAt',
      mealStocks: 'id, flightId, sortOrder',
      orders: 'id, flightId, seatId, status, mealId, createdAt',
      sealGroups: 'id, flightId, galley, listType, direction',
      cateringCarts: 'id, flightId, galley, listType, sortOrder',
      cateringLineItems: 'id, cartId',
      cateringSignoffs: 'flightId',
      bobDutyChecks: 'flightId, dutyId',
      cateringPhases: 'flightId, phase',
      checklistItems: '[flightId+itemKey], flightId',
    }).upgrade((tx) =>
      tx
        .table('flights')
        .toCollection()
        .modify((f: FlightSession & { status?: string }) => {
          if (!f.status) f.status = 'active';
        }),
    );
    this.version(4).stores({
      flights: 'id, date, status, createdAt',
      mealStocks: 'id, flightId, sortOrder',
      orders: 'id, flightId, seatId, status, mealId, createdAt',
      sealGroups: 'id, flightId, galley, listType, direction',
      cateringCarts: 'id, flightId, galley, listType, sortOrder',
      cateringLineItems: 'id, cartId',
      cateringSignoffs: 'flightId',
      bobDutyChecks: 'flightId, dutyId',
      cateringPhases: 'flightId, phase',
      checklistItems: '[flightId+itemKey], flightId',
    }).upgrade((tx) =>
      tx
        .table('flights')
        .toCollection()
        .modify((f: FlightSession) => {
          if (f.destination && !f.origin) f.origin = 'BEG';
        }),
    );
  }
}

export const db = new CabinCrewDB();
