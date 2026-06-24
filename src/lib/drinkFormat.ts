import type { DrinkLine, DrinkModifier, DrinkModifiers } from '../types';
import { MODIFIER_LABELS } from '../data/drinkMenu';

export function drinkLineKey(drink: Pick<DrinkLine, 'name' | 'variant' | 'modifiers'>): string {
  const mods = drink.modifiers ?? {};
  const modPart = ['ice', 'lemon', 'sugar', 'milk']
    .map((m) => `${m}:${mods[m as DrinkModifier] ? 1 : 0}`)
    .join('|');
  return `${drink.name}::${drink.variant ?? ''}::${modPart}`;
}

export function formatModifierList(modifiers?: DrinkModifiers): string {
  if (!modifiers) return '';
  const parts: DrinkModifier[] = [];
  if (modifiers.ice) parts.push('ice');
  if (modifiers.lemon) parts.push('lemon');
  if (modifiers.sugar) parts.push('sugar');
  if (modifiers.milk) parts.push('milk');
  return parts.map((m) => MODIFIER_LABELS[m].toLowerCase()).join(', ');
}

export function formatDrinkLine(drink: DrinkLine): string {
  const label = drink.variant ? `${drink.name} (${drink.variant})` : drink.name;
  const mods = formatModifierList(drink.modifiers);
  const withMods = mods ? `${label} — ${mods}` : label;
  return drink.qty > 1 ? `${drink.qty}× ${withMods}` : withMods;
}
