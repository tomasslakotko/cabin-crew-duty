export type Galley = 'fwd' | 'aft';
export type ListType = 'catering' | 'abc';
export type SealDirection = 'outbound' | 'inbound' | 'spare';
export type SealType = 'catering' | 'custom';
export type FlightPhase = 'ground' | 'after_takeoff' | 'descent';

export interface SealGroup {
  id: string;
  flightId: string;
  galley: Galley;
  listType: ListType;
  direction: SealDirection;
  sealType: SealType;
  color: string;
  rangeFrom: string;
  rangeTo: string;
  numbers: string[];
  verified: Record<string, boolean>;
  ocrFlagged: boolean;
}

export interface CateringCart {
  id: string;
  flightId: string;
  galley: Galley;
  listType: ListType;
  label: string;
  sortOrder: number;
}

export interface CateringLineItem {
  id: string;
  cartId: string;
  name: string;
  code?: string;
  delivered?: number;
  vario?: number;
  closing?: number;
  returned?: number;
  difference?: number;
  comment?: string;
}

export interface CateringSignoff {
  flightId: string;
  comments: string;
  barOperatorName: string;
  witnessName: string;
  crew1Name: string;
  crew2Name: string;
  signedAt?: number;
}

export interface BobDutyCheck {
  flightId: string;
  dutyId: string;
  completed: boolean;
  completedAt?: number;
}

export interface CateringPhaseState {
  flightId: string;
  phase: FlightPhase;
  completedAt?: number;
}

export interface ChecklistItemState {
  flightId: string;
  itemKey: string;
  completed: boolean;
  completedAt?: number;
}
