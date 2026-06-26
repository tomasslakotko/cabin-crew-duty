import type { DrinkCategory, DrinkModifier } from '../types';

export const DRINK_MENU: DrinkCategory[] = [
  {
    id: 'wines',
    label: 'WINES',
    items: [
      {
        id: 'wine',
        name: 'Wine',
        productName: 'Tamjanika / FLEUR D\'ORANGER',
        variants: ['White', 'Red'],
        modifiers: ['lemon'],
      },
    ],
  },
  {
    id: 'spirits',
    label: 'SPIRITS',
    items: [
      {
        id: 'whiskey',
        name: 'Whiskey',
        productName: "Jack Daniel's Tennessee Whiskey",
        modifiers: ['ice', 'lemon'],
      },
      {
        id: 'vodka',
        name: 'Vodka',
        productName: 'Finlandia Vodka',
        modifiers: ['ice', 'lemon'],
      },
      {
        id: 'gin',
        name: 'Gin',
        productName: 'Gin Twin Tigers',
        modifiers: ['ice', 'lemon'],
      },
      {
        id: 'brandy',
        name: 'Brandy',
        productName: 'Rakia Bar',
        variants: ['Plum', 'Quince', 'Pear'],
        modifiers: ['ice', 'lemon'],
      },
    ],
  },
  {
    id: 'beer',
    label: 'BEER',
    items: [
      { id: 'zajecarsko', name: 'Zaječarsko', modifiers: ['ice'] },
      { id: 'heineken', name: 'Heineken', modifiers: ['ice'] },
    ],
  },
  {
    id: 'juices',
    label: 'JUICES AND SOFT DRINKS',
    items: [
      { id: 'coca-cola', name: 'Coca Cola', modifiers: ['ice', 'lemon'] },
      { id: 'coca-cola-zero', name: 'Coca Cola Zero', modifiers: ['ice', 'lemon'] },
      { id: 'sprite', name: 'Sprite', modifiers: ['ice', 'lemon'] },
      { id: 'schweppes', name: 'Schweppes Tonic Water', modifiers: ['ice', 'lemon'] },
      { id: 'orange-juice', name: 'Orange juice', modifiers: ['ice', 'lemon'] },
      { id: 'apple-juice', name: 'Apple juice', modifiers: ['ice', 'lemon'] },
    ],
  },
  {
    id: 'water',
    label: 'WATER',
    items: [
      { id: 'still-water', name: 'Still water', modifiers: ['ice', 'lemon'] },
      { id: 'sparkling-water', name: 'Sparkling water', modifiers: ['ice', 'lemon'] },
    ],
  },
  {
    id: 'hot',
    label: 'HOT BEVERAGES',
    items: [
      { id: 'coffee', name: 'Instant coffee', modifiers: ['sugar', 'milk'] },
      { id: 'tea', name: 'Tea', variants: ['Mint', 'Green', 'Black', 'Apple cinnamon'], modifiers: ['lemon', 'sugar', 'milk'] },
    ],
  },
];

export function getDrinkModifiers(name: string): DrinkModifier[] {
  for (const category of DRINK_MENU) {
    const item = category.items.find((i) => i.name === name);
    if (item) return item.modifiers ?? [];
  }
  return [];
}

export const MODIFIER_LABELS: Record<DrinkModifier, string> = {
  ice: 'Ice',
  lemon: 'Lemon',
  sugar: 'Sugar',
  milk: 'Milk',
};
