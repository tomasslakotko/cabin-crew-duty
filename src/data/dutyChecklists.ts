export type DutyChecklistSectionId =
  | 'pre_boarding'
  | 'pre_departure'
  | 'in_flight'
  | 'top_of_descent'
  | 'post_landing';

export interface DutyChecklistRow {
  id: string;
  group?: string;
  task: string;
  taskSubtext?: string;
  taskBullets?: string[];
  detail?: string;
  detailBullets?: string[];
  statusLabel: string;
  statusSubtext?: string;
  mandatory?: boolean;
}

export interface DutyChecklistSection {
  id: DutyChecklistSectionId;
  title: string;
  rows: DutyChecklistRow[];
}

export const DUTY_CHECKLIST_SECTIONS: DutyChecklistSection[] = [
  {
    id: 'pre_boarding',
    title: 'Pre-Boarding checklist',
    rows: [
      {
        id: 'fap-lighting',
        group: 'Flight attendant panel (FAP)',
        task: 'Cabin lighting',
        statusLabel: 'SET',
      },
      {
        id: 'fap-temperature',
        group: 'Flight attendant panel (FAP)',
        task: 'Cabin temperature',
        statusLabel: 'SET',
      },
      {
        id: 'fap-music',
        group: 'Flight attendant panel (FAP)',
        task: 'Boarding music',
        statusLabel: 'ON',
      },
      {
        id: 'bc-bar-seal',
        task: 'Business class Bar cart/outbound seal number',
        statusLabel: 'CHECK',
      },
      {
        id: 'cabin-appearance',
        task: 'Cabin appearance and cabin readiness check',
        detail: 'From crew',
        statusLabel: 'RECEIVED',
      },
      {
        id: 'catering-check',
        task: 'Catering check (all cabins) – F&B loading, service equipment, etc.',
        detail: 'From crew',
        statusLabel: 'RECEIVED',
      },
      {
        id: 'special-pax',
        task: 'Special category passenger information INAD/DEPA/DEPU/UM/WCHR, etc.',
        detail: 'From ground staff',
        statusLabel: 'RECEIVED',
      },
      {
        id: 'mcd',
        task: 'Position of movable class divider (MCD)',
        detail: 'From ground staff',
        statusLabel: 'RECEIVED',
      },
      {
        id: 'newspapers',
        task: 'Newspapers on large tray',
        mandatory: true,
        statusLabel: 'SET',
      },
      {
        id: 'headrests',
        task: 'JC Leather headrests cover according configuration',
        mandatory: true,
        statusLabel: 'SET',
      },
      {
        id: 'air-freshener',
        task: 'Entire cabin / lavatories sprayed with air freshener',
        mandatory: true,
        statusLabel: 'DONE',
      },
      {
        id: 'toiletries',
        task: 'Toiletries (on ground and after take-off)',
        detail: 'In lavatory',
        mandatory: true,
        statusLabel: 'PLACED',
      },
      {
        id: 'boarding-clearance',
        task: 'Boarding clearance in liaison with Captain and Ground staff',
        statusLabel: 'GIVEN',
      },
    ],
  },
  {
    id: 'pre_departure',
    title: 'Pre-Departure Checklist',
    rows: [
      {
        id: 'documentation',
        task: 'Documentation',
        taskBullets: [
          'PIL (from Ground staff)',
          'Special category passenger information (from Ground staff)',
          'Cargo (if any)',
          'Load sheet (from Ground staff if required)',
        ],
        statusLabel: 'RECEIVED',
      },
      {
        id: 'public-address',
        task: 'Public Address',
        statusLabel: 'COMPLETED',
      },
      {
        id: 'doors',
        task: 'Doors',
        statusLabel: 'CLOSED',
      },
      {
        id: 'cabin-lighting',
        task: 'Cabin Lighting',
        statusLabel: 'SET',
      },
    ],
  },
  {
    id: 'in_flight',
    title: 'In-flight Checklist',
    rows: [
      {
        id: 'cabin-lighting',
        task: 'Cabin lighting',
        statusLabel: 'SET',
      },
      {
        id: 'cabin-temperature',
        task: 'Cabin temperature',
        statusLabel: 'MONITOR',
      },
      {
        id: 'bob-witness',
        task: 'Assists R1 in counting FWD BOB cart (Band 2 and Band 3) and as witness signs ABC list',
        statusLabel: 'COMPLETED',
      },
      {
        id: 'service-commencement',
        task: 'Service commencement',
        statusLabel: 'AS PER STANDARD',
      },
      {
        id: 'service-delivery',
        task: 'Service delivery',
        statusLabel: 'COMPLETED',
        statusSubtext: 'All crew to perform the service',
      },
      {
        id: 'water-heater',
        task: 'Water heater',
        statusLabel: 'SWITCHED ON',
      },
      {
        id: 'cabin-ambience',
        task: 'Cabin ambience and Housekeeping',
        taskSubtext: 'Lighting, temperature, cleanliness',
        statusLabel: 'MONITOR',
        statusSubtext: 'And adjust/maintain as required',
      },
    ],
  },
  {
    id: 'top_of_descent',
    title: 'Top of Descent Checklist',
    rows: [
      {
        id: 'band3-bob',
        task: 'Band 3 – assists R1 in counting FWD BOB cart and as a witness signs ABC list A220',
        taskSubtext:
          'Band 3 – assists R2 in counting FWD BOB cart and as a witness signs ABC list',
        statusLabel: 'COMPLETED',
      },
      {
        id: 'catering-docs',
        task: 'Catering documentation handling (From AFT and FWD galley)',
        taskBullets: ['BOB ABC lists and catering checklists', 'ABC list for Business Class cart'],
        statusLabel: 'RECEIVED',
      },
      {
        id: 'water-heater',
        task: 'Water heater',
        statusLabel: 'SWITCHED OFF',
      },
      {
        id: 'documentation',
        task: 'Documentation',
        statusLabel: 'COMPLETED',
      },
      {
        id: 'cabin-lighting',
        task: 'Cabin Lighting',
        statusLabel: 'SET',
      },
      {
        id: 'pa',
        task: 'PA',
        statusLabel: 'COMPLETED',
      },
      {
        id: 'toiletries',
        task: 'Toiletries (10 min to arrival)',
        statusLabel: 'COLLECTED',
      },
      {
        id: 'cml',
        task: 'Cabin Maintenance Log (CML) Defects',
        statusLabel: 'ENTERED',
      },
    ],
  },
  {
    id: 'post_landing',
    title: 'Post Landing',
    rows: [
      {
        id: 'pa',
        task: 'PA',
        detail: 'As required by station',
        statusLabel: 'COMPLETED',
      },
      {
        id: 'aircraft-docs',
        task: 'Aircraft documents',
        detail: 'Ground Staff',
        statusLabel: 'HANDED OVER',
      },
      {
        id: 'special-pax',
        task: 'Special category passengers and documentation',
        taskSubtext: 'UM/DEPU/DEPA/INAD/WCHR',
        detail: 'Ground Staff',
        statusLabel: 'HANDED OVER',
      },
      {
        id: 'lost-found',
        task: 'Lost & Found',
        statusLabel: 'COMPLETED',
      },
      {
        id: 'galleys',
        task: 'Galleys',
        detail: 'Spot check all carts and boxes sealed',
        statusLabel: 'CHECKED',
      },
      {
        id: 'reusable',
        task: 'Reusable items',
        taskSubtext: 'menu cards and leather headrest cover',
        detail: 'To original stowage',
        statusLabel: 'RETURNED',
      },
    ],
  },
];

export const DUTY_CHECKLIST_SECTION_LABELS: Record<DutyChecklistSectionId, string> = {
  pre_boarding: 'Pre-boarding',
  pre_departure: 'Pre-departure',
  in_flight: 'In-flight',
  top_of_descent: 'Top of descent',
  post_landing: 'Post landing',
};

export function dutyChecklistKey(sectionId: DutyChecklistSectionId, rowId: string): string {
  return `duty:${sectionId}:${rowId}`;
}

export function countDutyChecklistItems(): number {
  return DUTY_CHECKLIST_SECTIONS.reduce((sum, section) => sum + section.rows.length, 0);
}

export function dutySectionProgress(
  sectionId: DutyChecklistSectionId,
  items: Record<string, boolean>,
): { done: number; total: number } {
  const section = DUTY_CHECKLIST_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return { done: 0, total: 0 };
  const total = section.rows.length;
  let done = 0;
  for (const row of section.rows) {
    if (items[dutyChecklistKey(sectionId, row.id)]) done++;
  }
  return { done, total };
}
