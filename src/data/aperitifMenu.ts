export interface AperitifItem {
  name: string;
  variant?: string;
  label: string;
}

/** BC aperitif offer — served before main course per menu discussion sequence */
export const APERITIF_MENU: AperitifItem[] = [
  { name: 'Prosecco', label: 'Prosecco' },
  { name: 'Wine', variant: 'White', label: 'White wine' },
  { name: 'Wine', variant: 'Red', label: 'Red wine' },
];

export function aperitifItemKey(item: Pick<AperitifItem, 'name' | 'variant'>): string {
  return `${item.name}::${item.variant ?? ''}`;
}
