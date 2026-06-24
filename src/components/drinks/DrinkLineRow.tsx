import { useState } from 'react';
import type { DrinkLine } from '../../types';
import { formatDrinkLine } from '../../lib/drinkFormat';
import { DrinkPreviewModal } from './DrinkPreviewModal';
import { DrinkThumbnail } from './DrinkThumbnail';

interface DrinkLineRowProps {
  drink: DrinkLine;
  textClassName?: string;
}

export function DrinkLineRow({ drink, textClassName = 'text-lg font-medium text-gray-800 dark:text-gray-200' }: DrinkLineRowProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <li className="flex items-center gap-3">
        <DrinkThumbnail
          name={drink.name}
          variant={drink.variant}
          size="md"
          interactive
          onPreview={() => setPreviewOpen(true)}
        />
        <span className={`min-w-0 flex-1 ${textClassName}`}>{formatDrinkLine(drink)}</span>
      </li>
      {previewOpen && (
        <DrinkPreviewModal
          name={drink.name}
          variant={drink.variant}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
