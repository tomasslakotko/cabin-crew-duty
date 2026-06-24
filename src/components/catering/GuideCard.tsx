import type { ReactNode } from 'react';

interface GuideCardProps {
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function GuideCard({ title, badge, action, children, className = '' }: GuideCardProps) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        {badge}
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {children}
    </section>
  );
}
