import { getDrinkInfo } from '../../data/drinkInfo';

interface DrinkThumbnailProps {
  name: string;
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onPreview?: () => void;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export function DrinkThumbnail({
  name,
  variant,
  size = 'md',
  interactive = false,
  onPreview,
  className = '',
}: DrinkThumbnailProps) {
  const info = getDrinkInfo(name, variant);
  const hasImage = Boolean(info?.image);
  const sizeClass = SIZE_CLASSES[size];

  const content = info?.image ? (
    <img
      src={info.image}
      alt={info.productName ?? name}
      className="h-full w-full object-contain object-center p-0.5"
    />
  ) : (
    <DrinkIcon className="h-1/2 w-1/2 text-gray-400" />
  );

  const baseClass = `flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 ${sizeClass}`;

  if (interactive && hasImage && onPreview) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        className={`${baseClass} ring-2 ring-navy/20 active:ring-navy dark:ring-blue-400/30 ${className}`}
        aria-label={`View ${info?.productName ?? name}`}
      >
        {content}
      </button>
    );
  }

  return <div className={`${baseClass} ${className}`}>{content}</div>;
}

function DrinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3h8v3l-2 14H10L8 6V3z" />
      <path d="M8 6h8" />
    </svg>
  );
}
