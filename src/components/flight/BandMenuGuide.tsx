import type { BandMenuSection } from '../../data/bandMenus';

export function BandMenuGuide({ sections }: { sections: BandMenuSection[] }) {
  if (sections.length === 0) return null;

  return (
    <div className="mt-6 space-y-4 border-t border-gray-100 pt-5 dark:border-gray-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">On-board menu</p>
      {sections.map((section) => (
        <div
          key={section.id}
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-600 dark:bg-gray-900"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-navy dark:text-blue-300">
            {section.label}
          </p>
          <div className="mt-3 space-y-4">
            {section.courses.map((course) => (
              <div key={`${section.id}-${course.courseLabel}`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {course.courseLabel}
                </p>
                <ul className="mt-2 space-y-2">
                  {course.items.map((item) => (
                    <li key={item.name} className="text-sm text-gray-800 dark:text-gray-200">
                      {item.name}
                      {item.vegetarian && (
                        <sup className="ml-0.5 text-xs font-bold text-emerald-600">V</sup>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
