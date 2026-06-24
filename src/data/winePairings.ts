import { getDrinkInfo } from './drinkInfo';

export interface WineSuggestion {
  name: string;
  variant?: string;
  reason: string;
}

export interface MealWinePairing {
  mealName: string;
  primary: WineSuggestion;
  alternative?: WineSuggestion;
}

const PAIRINGS: MealWinePairing[] = [
  {
    mealName: 'Chicken Breast',
    primary: {
      name: 'Wine',
      variant: 'White',
      reason: 'Dry Tamjanika complements light poultry without overpowering.',
    },
    alternative: {
      name: 'Prosecco',
      reason: 'Extra dry sparkling — fresh pairing for white meat.',
    },
  },
  {
    mealName: 'Beef Tenderloin',
    primary: {
      name: 'Wine',
      variant: 'Red',
      reason: 'Frankovka red matches the richness of beef tenderloin.',
    },
    alternative: {
      name: 'Whiskey',
      reason: "Jack Daniel's — classic digestif after red meat.",
    },
  },
  {
    mealName: 'Vegetarian Pasta',
    primary: {
      name: 'Wine',
      variant: 'White',
      reason: 'Light white wine suits tomato or cream vegetarian pasta.',
    },
    alternative: {
      name: 'Prosecco',
      reason: 'Sparkling option for a lighter vegetarian service.',
    },
  },
];

export function getWinePairingForMeal(mealName: string | null | undefined): MealWinePairing | null {
  if (!mealName) return null;
  const exact = PAIRINGS.find((p) => p.mealName === mealName);
  if (exact) return exact;
  const lower = mealName.toLowerCase();
  if (lower.includes('beef') || lower.includes('tenderloin') || lower.includes('steak')) {
    return PAIRINGS.find((p) => p.mealName === 'Beef Tenderloin') ?? null;
  }
  if (lower.includes('chicken') || lower.includes('poultry')) {
    return PAIRINGS.find((p) => p.mealName === 'Chicken Breast') ?? null;
  }
  if (lower.includes('vegetarian') || lower.includes('pasta') || lower.includes('vegan')) {
    return PAIRINGS.find((p) => p.mealName === 'Vegetarian Pasta') ?? null;
  }
  return null;
}

export function formatWineLabel(suggestion: WineSuggestion): string {
  const info = getDrinkInfo(suggestion.name, suggestion.variant);
  if (info?.productName) return info.productName;
  return suggestion.variant ? `${suggestion.name} (${suggestion.variant})` : suggestion.name;
}
