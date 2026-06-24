import { useState } from 'react';
import type { DrinkModifier, DrinkModifiers } from '../../types';
import { MODIFIER_LABELS } from '../../data/drinkMenu';
import { getDrinkInfo } from '../../data/drinkInfo';
import { DrinkThumbnail } from './DrinkThumbnail';

interface DrinkModifierPickerProps {
  drinkName: string;
  variant?: string;
  available: DrinkModifier[];
  onConfirm: (modifiers: DrinkModifiers) => void;
  onBack: () => void;
}

export function DrinkModifierPicker({
  drinkName,
  variant,
  available,
  onConfirm,
  onBack,
}: DrinkModifierPickerProps) {
  const [modifiers, setModifiers] = useState<DrinkModifiers>({});

  function toggle(modifier: DrinkModifier, value: boolean) {
    setModifiers((prev) => ({ ...prev, [modifier]: value }));
  }

  const title = variant ? `${drinkName} (${variant})` : drinkName;
  const info = getDrinkInfo(drinkName, variant);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-medium text-gray-500"
      >
        ← Back
      </button>

      {info?.image && (
        <div className="mx-auto mb-4 flex justify-center">
          <DrinkThumbnail name={drinkName} variant={variant} size="lg" />
        </div>
      )}

      <p className="mb-2 text-center text-lg font-bold text-navy dark:text-blue-300">{title}</p>
      {info?.productName && (
        <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">{info.productName}</p>
      )}
      <p className="mb-6 text-center text-sm text-gray-500">Add extras if needed</p>

      <div className="mx-auto max-w-md space-y-4">
        {available.map((modifier) => (
          <div
            key={modifier}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
          >
            <p className="mb-3 text-sm font-semibold text-navy">{MODIFIER_LABELS[modifier]}</p>
            <div className="grid grid-cols-2 gap-2">
              <OptionButton
                label="No"
                selected={modifiers[modifier] !== true}
                onClick={() => toggle(modifier, false)}
              />
              <OptionButton
                label="Yes"
                selected={modifiers[modifier] === true}
                onClick={() => toggle(modifier, true)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          const active: DrinkModifiers = {};
          for (const m of available) {
            if (modifiers[m]) active[m] = true;
          }
          onConfirm(active);
        }}
        className="mx-auto mt-8 flex min-h-[52px] w-full max-w-md items-center justify-center rounded-2xl bg-navy text-base font-semibold text-white active:bg-navy-light"
      >
        Add to cart
      </button>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[48px] rounded-xl text-sm font-semibold transition-colors ${
        selected
          ? 'bg-navy text-white'
          : 'bg-gray-100 text-gray-600 active:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}
