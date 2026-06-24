import { formatWineLabel, getWinePairingForMeal, type WineSuggestion } from '../../data/winePairings';
import { DrinkThumbnail } from '../drinks/DrinkThumbnail';

interface WinePairingHintProps {
  mealName: string | null | undefined;
  compact?: boolean;
}

export function WinePairingHint({ mealName, compact }: WinePairingHintProps) {
  const pairing = getWinePairingForMeal(mealName);
  if (!pairing) return null;

  return (
    <div
      className={`rounded-2xl border border-purple-200 bg-purple-50/80 dark:border-purple-800 dark:bg-purple-900/20 ${
        compact ? 'px-3 py-3' : 'px-4 py-4'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
        Wine pairing
      </p>
      <div className="mt-3 space-y-3">
        <SuggestionRow suggestion={pairing.primary} featured />
        {pairing.alternative && <SuggestionRow suggestion={pairing.alternative} />}
      </div>
    </div>
  );
}

function SuggestionRow({
  suggestion,
  featured,
}: {
  suggestion: WineSuggestion;
  featured?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <DrinkThumbnail
        name={suggestion.name}
        variant={suggestion.variant}
        size="sm"
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0">
        <p
          className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${
            featured ? '' : 'opacity-90'
          }`}
        >
          {featured ? 'Recommended' : 'Also works'}: {formatWineLabel(suggestion)}
        </p>
        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
      </div>
    </div>
  );
}
