import { useFlightStore } from '../../stores/flightStore';
import { useChecklistStore } from '../../stores/checklistStore';
import {
  dutyChecklistKey,
  dutySectionProgress,
  type DutyChecklistRow,
  type DutyChecklistSection,
} from '../../data/dutyChecklists';

interface DutyChecklistTableProps {
  section: DutyChecklistSection;
}

export function DutyChecklistTable({ section }: DutyChecklistTableProps) {
  const flight = useFlightStore((s) => s.flight);
  const items = useChecklistStore((s) => s.items);
  const toggleItem = useChecklistStore((s) => s.toggleItem);
  const progress = dutySectionProgress(section.id, items);

  if (!flight) return null;

  const allDone = progress.done === progress.total && progress.total > 0;

  const groups = groupRows(section.rows);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-300 shadow-sm dark:border-gray-600">
      <div className="bg-red-600 px-4 py-3 text-center">
        <h2 className="text-base font-bold text-white sm:text-lg">{section.title}</h2>
      </div>

      <div className="flex items-center justify-end border-b border-gray-300 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-800">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tabular-nums ${
            allDone
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-300'
          }`}
        >
          {progress.done}/{progress.total}
        </span>
      </div>

      <div className="divide-y divide-gray-300 dark:divide-gray-600">
        {groups.map((block) => (
          <div key={block.group ?? block.rows[0]?.id}>
            {block.group && (
              <div className="border-b border-gray-300 bg-gray-100 px-3 py-2.5 text-sm font-bold text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                {block.group}
              </div>
            )}
            {block.rows.map((row) => (
              <DutyRow
                key={row.id}
                row={row}
                sectionId={section.id}
                flightId={flight.id}
                toggleItem={toggleItem}
                indented={Boolean(block.group)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DutyRowProps {
  row: DutyChecklistRow;
  sectionId: DutyChecklistSection['id'];
  flightId: string;
  toggleItem: (flightId: string, itemKey: string) => Promise<void>;
  indented?: boolean;
}

function DutyRow({ row, sectionId, flightId, toggleItem, indented }: DutyRowProps) {
  const key = dutyChecklistKey(sectionId, row.id);
  const done = useChecklistStore((s) => Boolean(s.items[key]));
  const hasDetail = Boolean(row.detail || row.detailBullets?.length);

  return (
    <button
      type="button"
      onClick={() => void toggleItem(flightId, key)}
      className={`grid w-full grid-cols-[1fr_auto] text-left transition-colors sm:grid-cols-[2fr_1fr_auto] ${
        done
          ? 'bg-emerald-50/60 active:bg-emerald-100/80 dark:bg-emerald-900/10 dark:active:bg-emerald-900/20'
          : 'bg-white active:bg-gray-50 dark:bg-gray-900 dark:active:bg-gray-800'
      }`}
    >
      <div
        className={`border-r border-gray-300 p-3 dark:border-gray-600 ${
          indented ? 'pl-5 sm:pl-6' : ''
        }`}
      >
        <p className="font-bold text-gray-900 dark:text-gray-100">
          {row.task}
          {row.mandatory && <span className="text-red-600"> *</span>}
        </p>
        {row.taskSubtext && (
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{row.taskSubtext}</p>
        )}
        {row.taskBullets && (
          <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
            {row.taskBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>

      {hasDetail ? (
        <div className="hidden border-r border-gray-300 p-3 text-sm text-gray-700 sm:block dark:border-gray-600 dark:text-gray-300">
          {row.detail && <p>{row.detail}</p>}
          {row.detailBullets && (
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {row.detailBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="hidden border-r border-gray-300 sm:block dark:border-gray-600" />
      )}

      <div className="flex min-w-[7.5rem] flex-col items-center justify-center p-3 text-center">
        {done ? (
          <>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {row.statusLabel}
            </span>
            {row.statusSubtext && (
              <span className="mt-0.5 text-xs italic text-gray-600 dark:text-gray-400">
                {row.statusSubtext}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Tap</span>
        )}
      </div>

      {hasDetail && (
        <div className="col-span-2 border-t border-gray-200 px-3 py-2 text-sm text-gray-600 sm:hidden dark:border-gray-700 dark:text-gray-400">
          {row.detail}
          {row.detailBullets && (
            <ul className="mt-1 list-inside list-disc">
              {row.detailBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </button>
  );
}

function groupRows(rows: DutyChecklistRow[]): { group?: string; rows: DutyChecklistRow[] }[] {
  const blocks: { group?: string; rows: DutyChecklistRow[] }[] = [];
  let currentGroup: string | undefined;
  let currentBlock: DutyChecklistRow[] = [];

  const flush = (group?: string) => {
    if (currentBlock.length > 0) {
      blocks.push({ group, rows: currentBlock });
      currentBlock = [];
    }
  };

  for (const row of rows) {
    if (row.group) {
      if (row.group !== currentGroup) {
        flush(currentGroup);
        currentGroup = row.group;
      }
      currentBlock.push(row);
    } else {
      flush(currentGroup);
      currentGroup = undefined;
      blocks.push({ rows: [row] });
    }
  }
  flush(currentGroup);

  return blocks;
}
