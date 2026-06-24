import { useState } from 'react';
import type { DrinkLine } from '../../types';
import { drinkLineKey, formatDrinkLine } from '../../lib/drinkFormat';
import { DrinkPreviewModal } from './DrinkPreviewModal';
import { DrinkThumbnail } from './DrinkThumbnail';

interface DrinkCartProps {
  drinks: DrinkLine[];
  onUpdateQty: (index: number, qty: number) => void;
  onRemove: (index: number) => void;
}

export function DrinkCart({ drinks, onUpdateQty, onRemove }: DrinkCartProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (drinks.length === 0) {
    return (
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-center text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-800">
        Tap items to add drinks
      </div>
    );
  }

  const previewDrink = previewIndex !== null ? drinks[previewIndex] : null;

  return (
    <>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {drinks.map((drink, index) => (
            <div
              key={drinkLineKey(drink)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-900"
            >
              <DrinkThumbnail
                name={drink.name}
                variant={drink.variant}
                size="sm"
                interactive
                onPreview={() => setPreviewIndex(index)}
              />
              <span className="max-w-[180px] truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatDrinkLine(drink)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateQty(index, drink.qty - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-lg font-medium dark:bg-gray-700"
                >
                  −
                </button>
                <span className="min-w-5 text-center text-sm font-bold">{drink.qty}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQty(index, drink.qty + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-lg font-medium dark:bg-gray-700"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-1 text-gray-400 hover:text-red-500"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {previewDrink && (
        <DrinkPreviewModal
          name={previewDrink.name}
          variant={previewDrink.variant}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </>
  );
}
