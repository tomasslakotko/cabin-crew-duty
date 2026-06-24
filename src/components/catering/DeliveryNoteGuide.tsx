import type { CartFormGuide } from '../../data/cateringGuide';
import { INVENTORY_COLUMNS, LIST_TYPE_COLORS, LIST_TYPE_LABELS } from '../../data/cateringGuide';
import type { FlightPhase } from '../../types/catering';
import { PHASE_LABELS } from '../../data/cateringConfig';
import { GuideCard } from './GuideCard';

interface DeliveryNoteGuideProps {
  cateringSections: CartFormGuide[];
  abcSections: CartFormGuide[];
  phase: FlightPhase;
}

function CartSection({ sections, phase }: { sections: CartFormGuide[]; phase: FlightPhase }) {
  if (sections.length === 0) return null;
  const listType = sections[0].listType;

  return (
    <div className="mb-5 last:mb-0">
      <span
        className={`mb-3 inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${LIST_TYPE_COLORS[listType]}`}
      >
        {LIST_TYPE_LABELS[listType]}
      </span>
      <ul className="space-y-3">
        {sections.map((cart) => {
          const fields = cart.phaseFields[phase] ?? [];
          return (
            <li
              key={cart.label}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">{cart.label}</p>
              <p className="mt-1 text-sm text-navy dark:text-blue-300">{cart.whereOnForm}</p>
              {cart.exampleItems.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Example lines: {cart.exampleItems.join(' · ')}
                </p>
              )}
              {fields.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Fill on paper now ({PHASE_LABELS[phase]})
                  </p>
                  <ul className="mt-1 list-inside list-disc text-sm text-gray-700 dark:text-gray-300">
                    {fields.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cart.note && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                  {cart.note}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DeliveryNoteGuide({ cateringSections, abcSections, phase }: DeliveryNoteGuideProps) {
  const activeColumns = INVENTORY_COLUMNS.filter((col) => {
    if (phase === 'ground') return ['Delivered', 'Comment'].includes(col.column);
    if (phase === 'after_takeoff') return ['VARIO', 'Comment'].includes(col.column);
    return true;
  });

  return (
    <>
      <GuideCard title="Delivery note — cart sections">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Each cart has its own table on the paper form. Find the section name, then fill the columns
          for this flight phase.
        </p>
        <CartSection sections={cateringSections} phase={phase} />
        <CartSection sections={abcSections} phase={phase} />
      </GuideCard>

      <GuideCard title="Column guide (ABC / delivery note)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="py-2 pr-3 font-semibold text-gray-700 dark:text-gray-300">Column</th>
                <th className="py-2 pr-3 font-semibold text-gray-700 dark:text-gray-300">Meaning</th>
                <th className="py-2 font-semibold text-gray-700 dark:text-gray-300">Where on form</th>
              </tr>
            </thead>
            <tbody>
              {activeColumns.map((col) => (
                <tr key={col.column} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 pr-3 font-medium text-gray-900 dark:text-gray-100">{col.column}</td>
                  <td className="py-3 pr-3 text-gray-600 dark:text-gray-400">{col.meaning}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{col.whereOnForm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GuideCard>
    </>
  );
}
