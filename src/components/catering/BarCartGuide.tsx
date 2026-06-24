import { useState } from 'react';
import {
  BC_BAR_CART_DRAWERS,
  BC_BAR_CART_RULES,
} from '../../data/cateringGuide';
import { GuideCard } from './GuideCard';

export function BarCartGuide() {
  const [expandedDrawer, setExpandedDrawer] = useState<string | null>(null);

  return (
    <GuideCard title="BC bar cart — where to find drinks (7.6)">
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        FWD galley half-size Business Class cart. Use drawer photos to locate bottles when serving or
        counting for the ABC list.
      </p>

      <ul className="mb-5 list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {BC_BAR_CART_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <div className="mb-5 overflow-x-auto">
        <div className="flex gap-3 pb-2 sm:grid sm:grid-cols-5 sm:pb-0">
          {BC_BAR_CART_DRAWERS.map((drawer) => (
            <button
              key={drawer.id}
              type="button"
              onClick={() => setExpandedDrawer(drawer.id === expandedDrawer ? null : drawer.id)}
              className={`flex w-36 shrink-0 flex-col overflow-hidden rounded-xl border text-left sm:w-auto ${
                expandedDrawer === drawer.id
                  ? 'border-navy ring-2 ring-navy/30 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <img
                src={drawer.image}
                alt={drawer.label}
                className="h-28 w-full bg-gray-100 object-contain object-center p-1 dark:bg-gray-800 sm:h-32"
              />
              <div className="bg-gray-50 p-2 dark:bg-gray-900">
                <p className="text-xs font-bold text-navy dark:text-blue-300">{drawer.label}</p>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                  {drawer.contents}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {expandedDrawer && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900">
          {BC_BAR_CART_DRAWERS.filter((d) => d.id === expandedDrawer).map((drawer) => (
            <div key={drawer.id}>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{drawer.label}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{drawer.contents}</p>
              <img
                src={drawer.image}
                alt={drawer.label}
                className="mx-auto mt-4 max-h-80 w-auto rounded-lg object-contain"
              />
            </div>
          ))}
        </div>
      )}

    </GuideCard>
  );
}
