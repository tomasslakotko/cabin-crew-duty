import type { SealBlockGuide } from '../../data/cateringGuide';
import { LIST_TYPE_COLORS, LIST_TYPE_LABELS, SEAL_DIRECTION_LABELS } from '../../data/cateringGuide';
import type { ListType } from '../../types/catering';
import { GuideCard } from './GuideCard';

interface SealLocationGuideProps {
  sealBlocks: SealBlockGuide[];
}

export function SealLocationGuide({ sealBlocks }: SealLocationGuideProps) {
  const byList = (listType: ListType) => sealBlocks.filter((b) => b.listType === listType);

  return (
    <GuideCard title="Where to find & write seals">
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Seal blocks are at the <strong>top of each list section</strong> on your FWD/AFT delivery note.
        Match list color: blue = Catering Checklist, red = ABC List.
      </p>
      {(['catering', 'abc'] as const).map((listType) => {
        const blocks = byList(listType);
        if (blocks.length === 0) return null;
        return (
          <div key={listType} className="mb-5 last:mb-0">
            <span
              className={`mb-3 inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${LIST_TYPE_COLORS[listType]}`}
            >
              {LIST_TYPE_LABELS[listType]}
            </span>
            <ul className="space-y-3">
              {blocks.map((block) => (
                <li
                  key={`${block.direction}-${block.color}`}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {SEAL_DIRECTION_LABELS[block.direction]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {block.sealType} · {block.color}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-navy dark:text-blue-300">{block.whereOnForm}</p>
                  <ul className="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
                    {block.whatToWrite.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </GuideCard>
  );
}
