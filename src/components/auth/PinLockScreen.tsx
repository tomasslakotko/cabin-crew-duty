import { useCallback, useState } from 'react';
import { unlockPin, verifyPin } from '../../lib/pinAuth';
import { hapticLight } from '../../lib/haptics';

interface PinLockScreenProps {
  onUnlock: () => void;
}

const PIN_LENGTH = 4;

export function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [digits, setDigits] = useState('');
  const [error, setError] = useState(false);

  const tryUnlock = useCallback(
    (pin: string) => {
      if (verifyPin(pin)) {
        unlockPin();
        hapticLight();
        onUnlock();
        return;
      }
      setError(true);
      setDigits('');
      setTimeout(() => setError(false), 500);
    },
    [onUnlock],
  );

  function press(key: string) {
    if (key === 'back') {
      setDigits((d) => d.slice(0, -1));
      setError(false);
      return;
    }
    if (digits.length >= PIN_LENGTH) return;

    const next = digits + key;
    setDigits(next);
    setError(false);

    if (next.length === PIN_LENGTH) {
      setTimeout(() => tryUnlock(next), 120);
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-navy px-6 safe-area-top safe-area-bottom">
      <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white">
        CC
      </div>

      <h1 className="text-2xl font-bold text-white">Cabin Crew Duty</h1>
      <p className="mt-2 text-center text-sm text-white/70">Enter PIN to open the app</p>

      <div
        className={`mt-10 flex gap-4 transition-transform ${error ? 'animate-pin-shake' : ''}`}
        aria-live="polite"
      >
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-full border-2 transition-colors ${
              i < digits.length
                ? 'border-white bg-white'
                : error
                  ? 'border-red-400 bg-transparent'
                  : 'border-white/50 bg-transparent'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-300">Incorrect PIN. Try again.</p>
      )}

      <div className="mt-12 grid w-full max-w-xs grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'].map((key) => {
          if (key === '') {
            return <div key="spacer" />;
          }
          if (key === 'back') {
            return (
              <button
                key="back"
                type="button"
                onClick={() => press('back')}
                className="flex min-h-[64px] items-center justify-center rounded-2xl text-lg font-semibold text-white/90 active:bg-white/10"
                aria-label="Delete"
              >
                ⌫
              </button>
            );
          }
          return (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              className="flex min-h-[64px] items-center justify-center rounded-2xl bg-white/10 text-2xl font-semibold text-white active:bg-white/20"
            >
              {key}
            </button>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-white/40">A220-300 Business Class · Crew only</p>
    </div>
  );
}
