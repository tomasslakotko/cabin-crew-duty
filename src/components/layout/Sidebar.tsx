import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Seat Map', icon: SeatIcon },
  { to: '/orders', label: 'Orders', icon: OrdersIcon },
  { to: '/stocking', label: 'Stocking', icon: StockIcon },
  { to: '/checklist', label: 'Checklist', icon: ChecklistIcon },
  { to: '/catering', label: 'Guide', icon: CateringIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar() {
  return (
    <aside className="flex w-[88px] shrink-0 flex-col items-center gap-2 border-r border-gray-200 bg-white py-4 safe-area-left landscape:py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-sm font-bold text-white">
        CC
      </div>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex min-h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center text-[11px] font-medium transition-colors ${
              isActive
                ? 'bg-navy text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100 hover:text-navy dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-300'
            }`
          }
        >
          <Icon className="h-6 w-6" />
          <span className="leading-tight">{label}</span>
        </NavLink>
      ))}
    </aside>
  );
}

function SeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10M7 13h6" />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function StockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16l-1.5 12H5.5L4 7z" />
      <path d="M9 7V5a3 3 0 016 0v2" />
    </svg>
  );
}

function ChecklistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function CateringIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a4 4 0 018 0v2" />
      <path d="M12 12v4" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
