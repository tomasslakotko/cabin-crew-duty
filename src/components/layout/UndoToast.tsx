import { useEffect } from 'react';
import { useOrderStore } from '../../stores/orderStore';
import { formatSeatDisplay } from '../../lib/utils';

export function UndoToast() {
  const lastUndo = useOrderStore((s) => s.lastUndo);
  const undoLastAction = useOrderStore((s) => s.undoLastAction);
  const dismissUndo = useOrderStore((s) => s.dismissUndo);

  useEffect(() => {
    if (!lastUndo) return;
    const id = window.setTimeout(() => dismissUndo(), 8000);
    return () => window.clearTimeout(id);
  }, [lastUndo, dismissUndo]);

  if (!lastUndo) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-gray-700 dark:bg-gray-800 safe-area-bottom">
      <p className="min-w-0 flex-1 text-sm text-gray-700 dark:text-gray-200">
        Status changed — {formatSeatDisplay(lastUndo.order.seatId)}
      </p>
      <button
        type="button"
        onClick={() => void undoLastAction()}
        className="shrink-0 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={dismissUndo}
        className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
