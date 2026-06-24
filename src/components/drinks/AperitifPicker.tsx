import { useState } from 'react';
import type { DrinkLine } from '../../types';
import { APERITIF_MENU, aperitifItemKey } from '../../data/aperitifMenu';
import { aperitifBandNote } from '../../data/aperitifServiceGuide';
import { useFlightStore } from '../../stores/flightStore';
import { drinkLineKey } from '../../lib/drinkFormat';
import { DrinkPreviewModal } from './DrinkPreviewModal';
import { DrinkThumbnail } from './DrinkThumbnail';

interface AperitifPickerProps {
  initialDrinks: DrinkLine[];
  onConfirm: (drinks: DrinkLine[]) => void;
  onClose: () => void;
}

export function AperitifPicker({ initialDrinks, onConfirm, onClose }: AperitifPickerProps) {
  const band = useFlightStore((s) => s.flight?.flightBand);
  const [selected, setSelected] = useState<DrinkLine[]>(initialDrinks);
  const [preview, setPreview] = useState<{ name: string; variant?: string } | null>(null);

  function addItem(name: string, variant?: string) {
    const line: DrinkLine = { name, variant, qty: 1 };
    const key = drinkLineKey(line);
    const idx = selected.findIndex((d) => drinkLineKey(d) === key);
    if (idx >= 0) {
      setSelected((prev) =>
        prev.map((d, i) => (i === idx ? { ...d, qty: d.qty + 1 } : d)),
      );
    } else {
      setSelected((prev) => [...prev, line]);
    }
  }

  function removeAt(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 safe-area-top dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-blue-300">Aperitif</h1>
          <p className="text-sm text-gray-500">Tap to add — served before main course</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800"
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {band && aperitifBandNote(band) && (
          <p className="mx-auto mb-4 max-w-lg rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            {aperitifBandNote(band)} Pour in galley except wine.
          </p>
        )}
        <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-3">
          {APERITIF_MENU.map((item) => (
            <button
              key={aperitifItemKey(item)}
              type="button"
              onClick={() => addItem(item.name, item.variant)}
              className="relative flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-3 py-4 active:bg-navy/5 dark:border-gray-600 dark:bg-gray-800"
            >
              <div
                className="absolute right-2 top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <DrinkThumbnail
                  name={item.name}
                  variant={item.variant}
                  size="sm"
                  interactive
                  onPreview={() => setPreview({ name: item.name, variant: item.variant })}
                />
              </div>
              <DrinkThumbnail name={item.name} variant={item.variant} size="lg" className="mb-2" />
              <span className="text-center text-sm font-semibold text-navy dark:text-blue-300">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <ul className="mx-auto mt-6 max-w-lg space-y-2">
            {selected.map((drink, i) => (
              <li
                key={drinkLineKey(drink)}
                className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800"
              >
                <DrinkThumbnail name={drink.name} variant={drink.variant} size="sm" />
                <span className="min-w-0 flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {drink.variant ? `${drink.name} (${drink.variant})` : drink.name}
                  {drink.qty > 1 ? ` ×${drink.qty}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="shrink-0 text-sm text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 safe-area-bottom dark:border-gray-700">
        <button
          type="button"
          onClick={() => onConfirm(selected)}
          className="w-full min-h-14 rounded-2xl bg-navy text-lg font-semibold text-white"
        >
          Done
        </button>
      </div>

      {preview && (
        <DrinkPreviewModal
          name={preview.name}
          variant={preview.variant}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
