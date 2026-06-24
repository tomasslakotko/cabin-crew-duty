import { useState } from 'react';
import { DRINK_MENU, getDrinkModifiers } from '../../data/drinkMenu';
import { getDrinkInfo } from '../../data/drinkInfo';
import type { DrinkLine, DrinkModifiers } from '../../types';
import { drinkLineKey } from '../../lib/drinkFormat';
import { DrinkCart } from './DrinkCart';
import { DrinkModifierPicker } from './DrinkModifierPicker';
import { DrinkPreviewModal } from './DrinkPreviewModal';
import { DrinkThumbnail } from './DrinkThumbnail';

interface DrinkPOSProps {
  initialDrinks: DrinkLine[];
  onAdd: (drinks: DrinkLine[]) => void;
  onClose: () => void;
}

type PickerStep =
  | { type: 'menu' }
  | { type: 'variant'; name: string; variants: string[] }
  | { type: 'modifiers'; name: string; variant?: string; available: ReturnType<typeof getDrinkModifiers> };

type PreviewTarget = { name: string; variant?: string } | null;

function mergeDrinks(
  existing: DrinkLine[],
  name: string,
  variant?: string,
  modifiers?: DrinkModifiers,
) {
  const line: DrinkLine = { name, variant, qty: 1, modifiers };
  const key = drinkLineKey(line);
  const idx = existing.findIndex((d) => drinkLineKey(d) === key);
  if (idx >= 0) {
    const updated = [...existing];
    updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
    return updated;
  }
  return [...existing, line];
}

export function DrinkPOS({ initialDrinks, onAdd, onClose }: DrinkPOSProps) {
  const [categoryId, setCategoryId] = useState(DRINK_MENU[0].id);
  const [step, setStep] = useState<PickerStep>({ type: 'menu' });
  const [cart, setCart] = useState<DrinkLine[]>(initialDrinks);
  const [preview, setPreview] = useState<PreviewTarget>(null);

  const category = DRINK_MENU.find((c) => c.id === categoryId) ?? DRINK_MENU[0];

  function proceedToModifiers(name: string, variant?: string) {
    const available = getDrinkModifiers(name);
    if (available.length > 0) {
      setStep({ type: 'modifiers', name, variant, available });
    } else {
      setCart((prev) => mergeDrinks(prev, name, variant));
      setStep({ type: 'menu' });
    }
  }

  const handleItemTap = (name: string, variants?: string[]) => {
    if (variants && variants.length > 0) {
      setStep({ type: 'variant', name, variants });
    } else {
      proceedToModifiers(name);
    }
  };

  const handleUpdateQty = (index: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCart((prev) => prev.map((d, i) => (i === index ? { ...d, qty } : d)));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 safe-area-top dark:border-gray-700">
        <h1 className="text-2xl font-bold tracking-wide text-navy dark:text-blue-300">Beverages</h1>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="flex w-44 shrink-0 flex-col gap-1 overflow-y-auto border-r border-gray-200 bg-gray-50 p-3 sm:w-52 dark:border-gray-700 dark:bg-gray-800">
          {DRINK_MENU.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategoryId(cat.id);
                setStep({ type: 'menu' });
              }}
              className={`min-h-12 rounded-xl px-3 py-2 text-left text-xs font-bold leading-tight tracking-wide sm:text-sm ${
                categoryId === cat.id
                  ? 'bg-navy text-white'
                  : 'text-navy hover:bg-white dark:text-blue-300 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {step.type === 'modifiers' ? (
              <DrinkModifierPicker
                drinkName={step.name}
                variant={step.variant}
                available={step.available}
                onConfirm={(modifiers) => {
                  setCart((prev) => mergeDrinks(prev, step.name, step.variant, modifiers));
                  setStep({ type: 'menu' });
                }}
                onBack={() => {
                  if (step.variant) {
                    const item = category.items.find((i) => i.name === step.name);
                    if (item?.variants) {
                      setStep({ type: 'variant', name: step.name, variants: item.variants });
                      return;
                    }
                  }
                  setStep({ type: 'menu' });
                }}
              />
            ) : step.type === 'variant' ? (
              <div>
                <p className="mb-4 text-center text-lg font-semibold text-navy dark:text-blue-300">{step.name}</p>
                <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-2">
                  {step.variants.map((v) => {
                    const info = getDrinkInfo(step.name, v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => proceedToModifiers(step.name, v)}
                        className="relative flex min-h-28 flex-col items-center rounded-2xl border-2 border-navy/20 bg-white px-4 py-4 active:bg-navy/5 dark:border-blue-400/30 dark:bg-gray-800"
                      >
                        {info?.image && (
                          <div
                            className="absolute right-2 top-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DrinkThumbnail
                              name={step.name}
                              variant={v}
                              size="sm"
                              interactive
                              onPreview={() => setPreview({ name: step.name, variant: v })}
                            />
                          </div>
                        )}
                        <DrinkThumbnail name={step.name} variant={v} size="lg" className="mb-2" />
                        <span className="text-lg font-semibold text-navy dark:text-blue-300">{v}</span>
                        {info?.productName && (
                          <span className="mt-1 line-clamp-2 text-center text-xs text-gray-500 dark:text-gray-400">
                            {info.productName}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setStep({ type: 'menu' })}
                  className="mx-auto mt-6 block text-sm text-gray-500 underline"
                >
                  Back to items
                </button>
              </div>
            ) : (
              <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => {
                  const info = getDrinkInfo(item.name);
                  const subtitle = info?.productName ?? item.productName;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemTap(item.name, item.variants)}
                      className="relative flex min-h-28 flex-col items-center rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center shadow-sm active:border-navy active:bg-navy/5 dark:border-gray-600 dark:bg-gray-800"
                    >
                      {(info?.image || item.variants) && (
                        <div
                          className="absolute right-2 top-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DrinkThumbnail
                            name={item.name}
                            variant={item.variants?.length === 1 ? item.variants[0] : undefined}
                            size="sm"
                            interactive={Boolean(info?.image)}
                            onPreview={() => setPreview({ name: item.name })}
                          />
                        </div>
                      )}
                      <DrinkThumbnail
                        name={item.name}
                        size="lg"
                        className="mb-2"
                      />
                      <span className="text-base font-semibold text-navy dark:text-blue-300">{item.name}</span>
                      {subtitle && (
                        <span className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                          {subtitle}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DrinkCart
            drinks={cart}
            onUpdateQty={handleUpdateQty}
            onRemove={(i) => handleUpdateQty(i, 0)}
          />

          <div className="border-t border-gray-200 p-4 safe-area-bottom dark:border-gray-700">
            <button
              type="button"
              onClick={() => onAdd(cart)}
              className="w-full min-h-14 rounded-2xl bg-navy text-lg font-semibold text-white"
            >
              Add to order
            </button>
          </div>
        </div>
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
