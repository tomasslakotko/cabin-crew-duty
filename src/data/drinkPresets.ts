import type { DrinkLine } from '../types';

export interface DrinkPreset {
  id: string;
  label: string;
  description: string;
  /** Drinks added immediately when the preset is tapped */
  drinks: Omit<DrinkLine, 'qty'>[];
  /**
   * Optional follow-up picker (e.g. tea variety) after the base drinks are added.
   * Shown as a variant step in the POS.
   */
  followUp?: {
    name: string;
    variants: string[];
  };
}

export const DRINK_PRESETS: DrinkPreset[] = [
  {
    id: 'water-coffee',
    label: 'Water + Coffee',
    description: 'Still water · Instant coffee',
    drinks: [{ name: 'Still water' }, { name: 'Instant coffee' }],
  },
  {
    id: 'sparkling-coffee',
    label: 'Sparkling + Coffee',
    description: 'Sparkling water · Instant coffee',
    drinks: [{ name: 'Sparkling water' }, { name: 'Instant coffee' }],
  },
  {
    id: 'water-tea',
    label: 'Water + Tea',
    description: 'Still water · then pick tea',
    drinks: [{ name: 'Still water' }],
    followUp: {
      name: 'Tea',
      variants: ['Mint', 'Green', 'Black', 'Apple cinnamon'],
    },
  },
  {
    id: 'red-wine',
    label: 'Red Wine',
    description: 'Wine · Red',
    drinks: [{ name: 'Wine', variant: 'Red' }],
  },
  {
    id: 'white-wine',
    label: 'White Wine',
    description: 'Wine · White',
    drinks: [{ name: 'Wine', variant: 'White' }],
  },
  {
    id: 'coke-ice',
    label: 'Coke + Ice',
    description: 'Coca Cola with ice',
    drinks: [{ name: 'Coca Cola', modifiers: { ice: true } }],
  },
  {
    id: 'still-water',
    label: 'Still Water',
    description: 'Plain still water',
    drinks: [{ name: 'Still water' }],
  },
  {
    id: 'still-water-ice',
    label: 'Water + Ice',
    description: 'Still water with ice',
    drinks: [{ name: 'Still water', modifiers: { ice: true } }],
  },
  {
    id: 'still-water-lemon',
    label: 'Water + Lemon',
    description: 'Still water with lemon',
    drinks: [{ name: 'Still water', modifiers: { lemon: true } }],
  },
  {
    id: 'still-water-ice-lemon',
    label: 'Water + Ice + Lemon',
    description: 'Still water with ice & lemon',
    drinks: [{ name: 'Still water', modifiers: { ice: true, lemon: true } }],
  },
  {
    id: 'sparkling-water',
    label: 'Sparkling Water',
    description: 'Plain sparkling water',
    drinks: [{ name: 'Sparkling water' }],
  },
  {
    id: 'sparkling-water-ice',
    label: 'Sparkling + Ice',
    description: 'Sparkling water with ice',
    drinks: [{ name: 'Sparkling water', modifiers: { ice: true } }],
  },
  {
    id: 'sparkling-water-lemon',
    label: 'Sparkling + Lemon',
    description: 'Sparkling water with lemon',
    drinks: [{ name: 'Sparkling water', modifiers: { lemon: true } }],
  },
  {
    id: 'sparkling-water-ice-lemon',
    label: 'Sparkling + Ice + Lemon',
    description: 'Sparkling water with ice & lemon',
    drinks: [{ name: 'Sparkling water', modifiers: { ice: true, lemon: true } }],
  },
  {
    id: 'coffee',
    label: 'Coffee',
    description: 'Instant coffee only',
    drinks: [{ name: 'Instant coffee' }],
  },
];
