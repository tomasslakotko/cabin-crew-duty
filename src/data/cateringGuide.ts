import type { FlightPhase, Galley, ListType, SealDirection } from '../types/catering';
import {
  BOB_DUTIES,
  CART_TEMPLATES,
  GALLEY_LABELS,
  LIST_TYPE_COLORS,
  LIST_TYPE_LABELS,
  PHASE_HINTS,
  PHASE_LABELS,
  SEAL_DIRECTION_LABELS,
  SEAL_TEMPLATES,
} from './cateringConfig';

export interface InventoryColumnGuide {
  column: string;
  meaning: string;
  whenToFill: string;
  whereOnForm: string;
}

export interface SealBlockGuide {
  listType: ListType;
  direction: SealDirection;
  sealType: string;
  color: string;
  whereOnForm: string;
  whatToWrite: string[];
}

export interface CartFormGuide {
  label: string;
  listType: ListType;
  whereOnForm: string;
  exampleItems: string[];
  phaseFields: Partial<Record<FlightPhase, string[]>>;
  note?: string;
}

export interface GalleyFormGuide {
  galley: Galley;
  cateringSections: CartFormGuide[];
  abcSections: CartFormGuide[];
  sealBlocks: SealBlockGuide[];
}

export const INVENTORY_COLUMNS: InventoryColumnGuide[] = [
  {
    column: 'Delivered',
    meaning: 'Qty loaded by catering at departure',
    whenToFill: 'On ground — before sealing',
    whereOnForm: 'Left qty column on each cart row (delivery note / ABC list)',
  },
  {
    column: 'VARIO',
    meaning: 'Actual physical qty in cart after take-off',
    whenToFill: 'After take-off — stock check',
    whereOnForm: 'VARIO / actual qty column; use Comment if moved FWD ↔ AFT',
  },
  {
    column: 'Closing',
    meaning: 'Qty remaining at top of descent',
    whenToFill: 'Top of descent — before re-sealing',
    whereOnForm: 'Closing / end-of-flight column on each line',
  },
  {
    column: 'Returned',
    meaning: 'Qty returned to catering',
    whenToFill: 'Top of descent',
    whereOnForm: 'Return column (if shown on your station form)',
  },
  {
    column: 'Diff',
    meaning: 'Closing minus delivered (or manual override)',
    whenToFill: 'Top of descent',
    whereOnForm: 'Difference column — explain in Comment/Napomena if not zero',
  },
  {
    column: 'Comment',
    meaning: 'Napomena — damage, OCR, discrepancies',
    whenToFill: 'Any phase',
    whereOnForm: 'Comment column on the line, or remarks box at bottom of cart section',
  },
];

export const SEAL_RULES = [
  'Seals must pass through both locks on cart/box lids.',
  'BC bar cart and BoB cart seals are removed only after take-off.',
  'Outstation: alcoholic carts need custom/spare seals (often red).',
  'Wrong seal number: flag OCR needed — keep seals until stock check is complete.',
  'Circle each verified seal number and sign initials (digital equivalent: tick on paper).',
  'Inbound seals are filled mainly at top of descent; outbound on ground.',
  'Destroy unused spare seals before landing (FWD emphasis).',
];

export const PHASE_PAPER_TASKS: Record<FlightPhase, { steps: string[]; forms: string[] }> = {
  ground: {
    forms: ['Catering Checklist (blue)', 'ABC List (red)', 'FWD/AFT delivery notes'],
    steps: [
      'Locate outbound seal blocks at the top of each list section.',
      'Check seal color and type match the list (Catering vs Custom).',
      'Write seal number range (from – to) and each individual number.',
      'Verify seals intact through both locks — circle and sign each number.',
      'Enter delivered qty per cart line before carts are sealed.',
      'If numbers do not match paperwork, note OCR in comments — do not break seals yet.',
    ],
  },
  after_takeoff: {
    forms: ['ABC List — VARIO columns', 'BOB procedure (manual 5.12)'],
    steps: [
      'Open BC bar and BoB seals only after take-off.',
      'Count actual physical qty in each cart — enter in VARIO column.',
      'If items moved between FWD and AFT, write physical BoB qty — not AirPOS sales.',
      'Add Comment/Napomena for damage, shortages, or transfers.',
      'Complete BOB counts with witness signatures on ABC list.',
      'Band 2 & 3: L2/R1 AFT BoB, R1/L1 FWD BoB — sign and witness.',
    ],
  },
  descent: {
    forms: ['ABC List — closing & inbound seals', 'Catering Checklist inbound section'],
    steps: [
      'Re-seal all carts and boxes; record new inbound seal numbers.',
      'Enter closing counts and returned qty where applicable.',
      'Calculate or write difference; explain non-zero diff in Comment.',
      'Destroy spare seals; stow paperwork per procedure.',
      'Band 3 only: repeat BoB counts before landing with witness sign-off.',
      'ABC copies: 1 for Cabin Senior envelope, remainder in dry ice compartment.',
    ],
  },
};

export const SIGNOFF_GUIDE = {
  title: 'Where to sign on paper',
  fields: [
    { label: 'Bar operator', where: 'ABC list — bar operator signature block (after counts)' },
    { label: 'Witness', where: 'ABC list — witness line next to BoB / bar counts' },
    { label: 'Crew 1 / Crew 2', where: 'Delivery note footer or catering checklist sign-off' },
    { label: 'Comments', where: 'Remarks box at bottom of FWD/AFT delivery note or ABC reverse' },
  ],
};

function sealBlocksForGalley(galley: Galley): SealBlockGuide[] {
  return SEAL_TEMPLATES.filter((t) => t.galley === galley).map((t) => ({
    listType: t.listType,
    direction: t.direction,
    sealType: t.sealType === 'catering' ? 'Catering seal' : 'Custom seal',
    color: t.color,
    whereOnForm: `${LIST_TYPE_LABELS[t.listType]} — ${SEAL_DIRECTION_LABELS[t.direction]} block (top of ${GALLEY_LABELS[galley]} section)`,
    whatToWrite: [
      'Seal type & color',
      'Number range (from – to)',
      'Each individual seal number',
      'Circle + initials when verified',
    ],
  }));
}

function cartsForGalley(galley: Galley, listType: ListType): CartFormGuide[] {
  return CART_TEMPLATES.filter((c) => c.galley === galley && c.listType === listType).map((c) => ({
    label: c.label,
    listType: c.listType,
    whereOnForm: `${LIST_TYPE_LABELS[listType]} → cart table row group "${c.label}"`,
    exampleItems: c.defaultItems.map((i) => i.name),
    phaseFields: {
      ground: ['Delivered qty', 'Outbound seal numbers (section header)'],
      after_takeoff: ['VARIO (actual qty)', 'Comment if discrepancy'],
      descent: ['Closing qty', 'Returned', 'Diff', 'Inbound seal numbers', 'Comment'],
    },
    note: c.showBobNote
      ? 'Enter actual physical qty in the BoB cart — not AirPOS sales if items moved FWD ↔ AFT.'
      : undefined,
  }));
}

export function getGalleyGuide(galley: Galley): GalleyFormGuide {
  return {
    galley,
    cateringSections: cartsForGalley(galley, 'catering'),
    abcSections: cartsForGalley(galley, 'abc'),
    sealBlocks: sealBlocksForGalley(galley),
  };
}

export function bobDutiesForPhase(phase: FlightPhase) {
  if (phase === 'ground') return [];
  const bobPhase = phase === 'after_takeoff' ? 'after_takeoff' : 'before_landing';
  return BOB_DUTIES.filter((d) => d.phase === bobPhase);
}

export interface BarCartDrawer {
  id: string;
  label: string;
  contents: string;
  image: string;
}

export const BC_BAR_CART_RULES = [
  'Business class half-size cart is in the FWD galley.',
  'Cabin Senior checks seal numbers and maintains the ABC list for this cart.',
  'Alcohol consumption is measured in quarters on the ABC list (e.g. 1–2 drinks served → write 3/4 left).',
  'Open soft drinks, juices, water and beer are not returned to the cart.',
  'Empty wine, sparkling, rakija and large spirit bottles must be returned to the cart.',
  'ABC list includes outbound, inbound and spare seals for BC cart, BOB cart and dry store.',
  'Seals must not be removed before take-off.',
  'BC bar is independent of BOB — not recorded on AirPOS; use paper ABC and this app for seat orders.',
];

export const BC_BAR_CART_DRAWERS: BarCartDrawer[] = [
  {
    id: '1',
    label: 'Drawer 1',
    contents: 'Juice cartons, beer cans (e.g. Heineken)',
    image: '/catering/drawer-1-juice-beer.webp',
  },
  {
    id: '2',
    label: 'Drawer 2',
    contents: 'Milk/creamer packs, napkins, mini spirits',
    image: '/catering/drawer-2-miniatures.webp',
  },
  {
    id: '3',
    label: 'Drawer 3',
    contents: 'Coca-Cola bottles, white wine / sparkling',
    image: '/catering/drawer-3-soft-wine.webp',
  },
  {
    id: '4',
    label: 'Drawer 4',
    contents: 'Large water bottles, Schweppes / mixers',
    image: '/catering/drawer-4-water-mixers.webp',
  },
  {
    id: '5',
    label: 'Drawer 5',
    contents: 'Small water, vodka, red wine bottles',
    image: '/catering/drawer-5-water-wine-spirits.webp',
  },
];

export const BC_BAR_CART_GUIDE_IMAGE = '/catering/bc-bar-cart-guide.webp';

export {
  BOB_DUTIES,
  GALLEY_LABELS,
  LIST_TYPE_COLORS,
  LIST_TYPE_LABELS,
  PHASE_HINTS,
  PHASE_LABELS,
  SEAL_DIRECTION_LABELS,
};
