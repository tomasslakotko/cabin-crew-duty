import { useEffect, useState } from 'react';

export function InstallHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('install-hint-dismissed');
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone);
    if (!dismissed && !isStandalone) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(90vw,420px)] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
      <p className="text-sm font-semibold text-navy">Install for offline use</p>
      <p className="mt-1 text-sm text-gray-600">
        Tap Share in Safari, then &quot;Add to Home Screen&quot; to use this app offline on your iPad.
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem('install-hint-dismissed', '1');
          setVisible(false);
        }}
        className="mt-3 min-h-[44px] rounded-xl bg-navy px-4 text-sm font-medium text-white"
      >
        Got it
      </button>
    </div>
  );
}
