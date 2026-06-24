import type { FlightPhase, Galley, ListType, SealDirection } from '../types/catering';

export interface CartTemplate {
  galley: Galley;
  listType: ListType;
  label: string;
  sortOrder: number;
  defaultItems: { name: string; code?: string; delivered?: number }[];
  showBobNote?: boolean;
}

export interface SealTemplate {
  galley: Galley;
  listType: ListType;
  direction: SealDirection;
  sealType: 'catering' | 'custom';
  color: string;
}

export interface BobDuty {
  id: string;
  phase: 'after_takeoff' | 'before_landing';
  position: string;
  label: string;
  bandNote?: string;
}

export const CART_TEMPLATES: CartTemplate[] = [
  {
    galley: 'fwd',
    listType: 'catering',
    label: 'Crew meal cart / box',
    sortOrder: 0,
    defaultItems: [
      { name: 'Crew hot meals', delivered: 0 },
      { name: 'Crew cold meals', delivered: 0 },
    ],
  },
  {
    galley: 'fwd',
    listType: 'catering',
    label: 'BC meals & snacks',
    sortOrder: 1,
    defaultItems: [
      { name: 'Business class hot meals', delivered: 0 },
      { name: 'Sandwiches / snacks', delivered: 0 },
    ],
  },
  {
    galley: 'fwd',
    listType: 'abc',
    label: 'BC bar cart (bonded goods)',
    sortOrder: 2,
    defaultItems: [
      { name: 'Wine (mini bottles)', code: '6172201', delivered: 0 },
      { name: 'Spirits (mini bottles)', delivered: 0 },
      { name: 'Beer', delivered: 0 },
    ],
  },
  {
    galley: 'fwd',
    listType: 'abc',
    label: 'Dry store cart / box',
    sortOrder: 3,
    defaultItems: [
      { name: 'Cups / napkins', delivered: 0 },
      { name: 'Crew dry store items', delivered: 0 },
    ],
  },
  {
    galley: 'aft',
    listType: 'catering',
    label: 'Complimentary service cart',
    sortOrder: 0,
    defaultItems: [
      { name: 'Complimentary sandwiches', delivered: 0 },
      { name: 'Complimentary snacks', delivered: 0 },
    ],
  },
  {
    galley: 'aft',
    listType: 'abc',
    label: 'BoB cart',
    sortOrder: 1,
    showBobNote: true,
    defaultItems: [
      { name: 'Fresh BOB sandwiches', delivered: 0 },
      { name: 'Snacks / drinks', delivered: 0 },
    ],
  },
  {
    galley: 'aft',
    listType: 'abc',
    label: 'Complimentary water',
    sortOrder: 2,
    defaultItems: [{ name: 'Water bottles', delivered: 0 }],
  },
];

export const SEAL_TEMPLATES: SealTemplate[] = [
  { galley: 'fwd', listType: 'catering', direction: 'outbound', sealType: 'catering', color: 'Blue' },
  { galley: 'fwd', listType: 'catering', direction: 'inbound', sealType: 'catering', color: 'Blue' },
  { galley: 'fwd', listType: 'catering', direction: 'spare', sealType: 'custom', color: 'Red' },
  { galley: 'fwd', listType: 'abc', direction: 'outbound', sealType: 'custom', color: 'Red' },
  { galley: 'fwd', listType: 'abc', direction: 'inbound', sealType: 'custom', color: 'Red' },
  { galley: 'fwd', listType: 'abc', direction: 'spare', sealType: 'custom', color: 'Red' },
  { galley: 'aft', listType: 'catering', direction: 'outbound', sealType: 'catering', color: 'Blue' },
  { galley: 'aft', listType: 'catering', direction: 'inbound', sealType: 'catering', color: 'Blue' },
  { galley: 'aft', listType: 'abc', direction: 'outbound', sealType: 'custom', color: 'Red' },
  { galley: 'aft', listType: 'abc', direction: 'inbound', sealType: 'custom', color: 'Red' },
];

export const BOB_DUTIES: BobDuty[] = [
  {
    id: 'bob-at-1',
    phase: 'after_takeoff',
    position: 'L2',
    label: 'Count AFT BoB cart and sign ABC list',
    bandNote: 'Band 2 & 3',
  },
  {
    id: 'bob-at-2',
    phase: 'after_takeoff',
    position: 'R1',
    label: 'Assist L2 counting AFT BoB cart; sign ABC as witness',
    bandNote: 'Band 2 & 3',
  },
  {
    id: 'bob-at-3',
    phase: 'after_takeoff',
    position: 'R1',
    label: 'Count FWD BoB cart and sign ABC list',
    bandNote: 'Band 2 & 3',
  },
  {
    id: 'bob-at-4',
    phase: 'after_takeoff',
    position: 'L1',
    label: 'Assist R1 counting FWD BoB cart; sign ABC as witness',
    bandNote: 'Band 2 & 3',
  },
  {
    id: 'bob-bl-1',
    phase: 'before_landing',
    position: 'R1',
    label: 'Count FWD BoB cart and sign ABC list',
    bandNote: 'Band 3 only',
  },
  {
    id: 'bob-bl-2',
    phase: 'before_landing',
    position: 'L1',
    label: 'Assist R1 counting FWD BoB cart; sign ABC as witness',
    bandNote: 'Band 3 only',
  },
  {
    id: 'bob-bl-3',
    phase: 'before_landing',
    position: 'L2',
    label: 'Count AFT BoB cart and sign ABC list',
    bandNote: 'Band 3 only',
  },
  {
    id: 'bob-bl-4',
    phase: 'before_landing',
    position: 'R1',
    label: 'Assist L2 counting AFT BoB cart; sign ABC as witness',
    bandNote: 'Band 3 only',
  },
];

export const PHASE_LABELS: Record<FlightPhase, string> = {
  ground: 'On ground',
  after_takeoff: 'After take-off',
  descent: 'Top of descent',
};

export const PHASE_HINTS: Record<FlightPhase, string> = {
  ground:
    'On paper: verify outbound seals, circle numbers, enter delivered qty before sealing. Note OCR if mismatch.',
  after_takeoff:
    'Open BC bar & BoB seals now. Count physical qty → VARIO column. Complete BOB witness sign-off on ABC list.',
  descent:
    'Re-seal carts, enter closing counts and inbound seals. Sign off on delivery note / ABC. Destroy spare seals.',
};

export const LIST_TYPE_LABELS: Record<ListType, string> = {
  catering: 'Catering Checklist',
  abc: 'ABC List',
};

export const LIST_TYPE_COLORS: Record<ListType, string> = {
  catering: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  abc: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

export const GALLEY_LABELS: Record<Galley, string> = {
  fwd: 'FWD Galley',
  aft: 'AFT Galley',
};

export const SEAL_DIRECTION_LABELS: Record<SealDirection, string> = {
  outbound: 'Outbound',
  inbound: 'Inbound',
  spare: 'Spare',
};
