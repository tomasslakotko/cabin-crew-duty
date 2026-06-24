import { getDrinkInfo } from '../../data/drinkInfo';

interface DrinkPreviewModalProps {
  name: string;
  variant?: string;
  onClose: () => void;
}

export function DrinkPreviewModal({ name, variant, onClose }: DrinkPreviewModalProps) {
  const info = getDrinkInfo(name, variant);
  const posLabel = variant ? `${name} (${variant})` : name;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Drink preview"
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{posLabel}</p>
            {info?.productName && (
              <p className="mt-1 text-sm font-medium text-navy dark:text-blue-300">{info.productName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {info?.image && (
          <div className="mx-auto mt-6 flex max-h-72 items-center justify-center rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
            <img
              src={info.image}
              alt={info.productName ?? name}
              className="max-h-64 w-auto object-contain"
            />
          </div>
        )}

        {info?.description && (
          <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{info.description}</p>
        )}

        {!info?.image && (
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">No bottle photo for this item.</p>
        )}
      </div>
    </div>
  );
}
