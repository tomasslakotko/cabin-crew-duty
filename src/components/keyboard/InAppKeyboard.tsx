import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useKeyboardStore } from '../../stores/keyboardStore';

type KeyboardMode = 'letters' | 'symbols';

interface InAppKeyboardProps {
  value: string;
  onChange: (next: string) => void;
  onClose: () => void;
  title?: string;
}

/** Dual-glyph key: [shiftGlyph, normalGlyph] */
type Dual = readonly [string, string];

const ROW1: Dual[] = [
  ['±', '§'],
  ['!', '1'],
  ['@', '2'],
  ['£', '3'],
  ['€', '4'],
  ['%', '5'],
  ['^', '6'],
  ['&', '7'],
  ['*', '8'],
  ['(', '9'],
  [')', '0'],
  ['_', '-'],
  ['+', '='],
];

const ROW2_LETTERS = 'qwertyuiop'.split('');
const ROW2_RIGHT: Dual[] = [
  ['{', '['],
  ['}', ']'],
  ['|', '\\'],
];

const ROW3_LETTERS = 'asdfghjkl'.split('');
const ROW3_RIGHT: Dual[] = [
  [':', ';'],
  ['"', "'"],
];

const ROW4_LETTERS = 'zxcvbnm'.split('');
const ROW4_MID: Dual[] = [
  ['~', '`'],
  ['<', ','],
  ['>', '.'],
  ['?', '/'],
];

const SYMBOL_ROW1 = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '=', '_', '\\', '|'];
const SYMBOL_ROW2 = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"', '.', ',', '?'];
const SYMBOL_ROW3 = ["'", '`', '~', '<', '>', '€', '£', '¥', '•', '…', '!', '¡'];
const SYMBOL_ROW4 = ['¿', '°', '±', '§', '¶', '©', '®', '™', '✓', '×', '÷', '∞'];

const KEY_H = 'h-[52px] sm:h-[58px]';
const KEY_GAP = 'gap-[6px]';
const KEY_BG = 'bg-[#3a3a3c]';
const MOD_BG = 'bg-[#2c2c2e]';
const KEY_RADIUS = 'rounded-[8px]';
const KEY_ACTIVE = 'active:bg-[#636366]';
const PANEL_BG = 'bg-[#1c1c1e]';

export function InAppKeyboard({ value, onChange, onClose }: InAppKeyboardProps) {
  const [shift, setShift] = useState(false);
  const [caps, setCaps] = useState(false);
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const setKeyboardHeight = useKeyboardStore((s) => s.setHeight);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const publish = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      setKeyboardHeight(h);
      document.documentElement.style.setProperty('--keyboard-inset', `${h}px`);
      document.documentElement.classList.add('keyboard-open');
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);

    return () => {
      ro.disconnect();
      setKeyboardHeight(0);
      document.documentElement.style.setProperty('--keyboard-inset', '0px');
      document.documentElement.classList.remove('keyboard-open');
    };
  }, [setKeyboardHeight]);

  const upper = shift || caps;

  function commit(next: string) {
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(next);
    // Keep history bounded
    const bounded = trimmed.length > 40 ? trimmed.slice(trimmed.length - 40) : trimmed;
    setHistory(bounded);
    setHistoryIndex(bounded.length - 1);
    onChange(next);
  }

  function add(text: string) {
    commit(`${value}${text}`);
    if (shift && !caps) setShift(false);
  }

  function dual(d: Dual) {
    add(upper ? d[0] : d[1]);
  }

  function letter(ch: string) {
    add(upper ? ch.toUpperCase() : ch);
  }

  function backspace() {
    commit(value.slice(0, -1));
  }

  function undo() {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    onChange(history[nextIndex] ?? '');
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    onChange(history[nextIndex] ?? '');
  }

  function toggleMode() {
    setMode((m) => (m === 'letters' ? 'symbols' : 'letters'));
    setShift(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[140] pointer-events-none">
      <div
        ref={panelRef}
        className={`pointer-events-auto ${PANEL_BG} px-2 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.45)]`}
      >
        <Toolbar onUndo={undo} onRedo={redo} />

        {mode === 'letters' ? (
          <>
            {/* Row 1 — numbers */}
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              {ROW1.map((d) => (
                <DualKey key={d.join()} dual={d} shift={upper} onTap={() => dual(d)} className="flex-1" />
              ))}
              <ModKey onTap={backspace} className="w-[7.5%] shrink-0" ariaLabel="Delete">
                <BackspaceIcon />
              </ModKey>
            </div>

            {/* Row 2 — qwerty + brackets */}
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              <ModKey onTap={() => add('\t')} className="w-[6.5%] shrink-0" ariaLabel="Tab">
                <TabIcon />
              </ModKey>
              {ROW2_LETTERS.map((ch) => (
                <LetterKey key={ch} label={upper ? ch.toUpperCase() : ch} onTap={() => letter(ch)} />
              ))}
              {ROW2_RIGHT.map((d) => (
                <DualKey key={d.join()} dual={d} shift={upper} onTap={() => dual(d)} className="flex-1" />
              ))}
            </div>

            {/* Row 3 — asdf + return */}
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              <ModKey
                onTap={() => {
                  setCaps((c) => !c);
                  setShift(false);
                }}
                className={`w-[7%] shrink-0 ${caps ? 'bg-[#5a7bb8] text-white' : ''}`}
                ariaLabel="Caps Lock"
              >
                <CapsIcon active={caps} />
              </ModKey>
              {ROW3_LETTERS.map((ch) => (
                <LetterKey key={ch} label={upper ? ch.toUpperCase() : ch} onTap={() => letter(ch)} />
              ))}
              {ROW3_RIGHT.map((d) => (
                <DualKey key={d.join()} dual={d} shift={upper} onTap={() => dual(d)} className="flex-1" />
              ))}
              <ModKey onTap={() => add('\n')} className="w-[9%] shrink-0" ariaLabel="Return">
                <ReturnIcon />
              </ModKey>
            </div>

            {/* Row 4 — zxcv + shifts */}
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              <ModKey
                onTap={() => setShift((s) => !s)}
                className={`w-[7%] shrink-0 ${shift && !caps ? 'bg-[#5a7bb8] text-white' : ''}`}
                ariaLabel="Shift"
              >
                <ShiftIcon filled={shift && !caps} />
              </ModKey>
              <DualKey dual={ROW4_MID[0]} shift={upper} onTap={() => dual(ROW4_MID[0])} className="flex-1" />
              {ROW4_LETTERS.map((ch) => (
                <LetterKey key={ch} label={upper ? ch.toUpperCase() : ch} onTap={() => letter(ch)} />
              ))}
              {ROW4_MID.slice(1).map((d) => (
                <DualKey key={d.join()} dual={d} shift={upper} onTap={() => dual(d)} className="flex-1" />
              ))}
              <ModKey
                onTap={() => setShift((s) => !s)}
                className={`w-[7%] shrink-0 ${shift && !caps ? 'bg-[#5a7bb8] text-white' : ''}`}
                ariaLabel="Shift"
              >
                <ShiftIcon filled={shift && !caps} />
              </ModKey>
            </div>
          </>
        ) : (
          <>
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              {SYMBOL_ROW1.map((ch) => (
                <LetterKey key={ch} label={ch} onTap={() => add(ch)} />
              ))}
              <ModKey onTap={backspace} className="w-[7.5%] shrink-0" ariaLabel="Delete">
                <BackspaceIcon />
              </ModKey>
            </div>
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              {SYMBOL_ROW2.map((ch) => (
                <LetterKey key={ch} label={ch} onTap={() => add(ch)} />
              ))}
            </div>
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              {SYMBOL_ROW3.map((ch) => (
                <LetterKey key={ch} label={ch} onTap={() => add(ch)} />
              ))}
              <ModKey onTap={() => add('\n')} className="w-[9%] shrink-0" ariaLabel="Return">
                <ReturnIcon />
              </ModKey>
            </div>
            <div className={`mb-1.5 flex ${KEY_GAP}`}>
              {SYMBOL_ROW4.map((ch) => (
                <LetterKey key={ch} label={ch} onTap={() => add(ch)} />
              ))}
            </div>
          </>
        )}

        {/* Row 5 — bottom controls */}
        <div className={`flex ${KEY_GAP}`}>
          <ModKey onTap={() => add('🙂')} className="w-[7%] shrink-0 text-xl" ariaLabel="Emoji">
            🙂
          </ModKey>
          <ModKey onTap={toggleMode} className="w-[10%] shrink-0 text-[13px] font-semibold tracking-tight" ariaLabel="Numbers">
            {mode === 'letters' ? '.?123' : 'ABC'}
          </ModKey>
          <ModKey onTap={() => undefined} className="w-[7%] shrink-0" ariaLabel="Microphone">
            <MicIcon />
          </ModKey>
          <button
            type="button"
            onClick={() => add(' ')}
            className={`${KEY_H} flex-1 ${KEY_RADIUS} ${KEY_BG} ${KEY_ACTIVE} text-[13px] font-medium text-white/80`}
            aria-label="Space"
          />
          <ModKey onTap={toggleMode} className="w-[10%] shrink-0 text-[13px] font-semibold tracking-tight" ariaLabel="Numbers">
            {mode === 'letters' ? '.?123' : 'ABC'}
          </ModKey>
          <ModKey onTap={onClose} className="w-[8%] shrink-0" ariaLabel="Hide keyboard">
            <HideKeyboardIcon />
          </ModKey>
        </div>
      </div>
    </div>
  );
}

function LetterKey({ label, onTap }: { label: string; onTap: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className={`${KEY_H} flex-1 ${KEY_RADIUS} ${KEY_BG} ${KEY_ACTIVE} text-[26px] font-normal leading-none text-white`}
    >
      {label}
    </button>
  );
}

function DualKey({
  dual,
  shift,
  onTap,
  className,
}: {
  dual: Dual;
  shift: boolean;
  onTap: () => void;
  className?: string;
}) {
  const primary = shift ? dual[0] : dual[1];
  const secondary = shift ? dual[1] : dual[0];
  return (
    <button
      type="button"
      onClick={onTap}
      className={`${KEY_H} ${KEY_RADIUS} ${KEY_BG} ${KEY_ACTIVE} relative px-0.5 ${className ?? ''}`}
    >
      <span className="absolute left-1.5 top-1 text-[10px] leading-none text-white/45">{secondary}</span>
      <span className="flex h-full items-center justify-center text-[22px] font-normal leading-none text-white">
        {primary}
      </span>
    </button>
  );
}

function ModKey({
  children,
  onTap,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  onTap: () => void;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={ariaLabel}
      className={`${KEY_H} ${KEY_RADIUS} ${MOD_BG} ${KEY_ACTIVE} flex items-center justify-center text-white/90 ${className ?? ''}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ onUndo, onRedo }: { onUndo: () => void; onRedo: () => void }) {
  return (
    <div className="mb-1.5 flex h-8 items-center justify-between px-1 text-white/70">
      <div className="flex items-center gap-4">
        <ToolbarBtn ariaLabel="Left" onTap={() => undefined}>
          <ChevronLeftIcon />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Right" onTap={() => undefined}>
          <ChevronRightIcon />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Undo" onTap={onUndo}>
          <UndoIcon />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Redo" onTap={onRedo}>
          <RedoIcon />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Paste" onTap={() => undefined}>
          <PasteIcon />
        </ToolbarBtn>
      </div>
      <div className="flex items-center gap-4">
        <ToolbarBtn ariaLabel="Menu" onTap={() => undefined}>
          <MenuIcon />
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Format" onTap={() => undefined}>
          <span className="text-[12px] font-semibold tracking-tight">A|</span>
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Command" onTap={() => undefined}>
          <span className="text-[14px]">⌘</span>
        </ToolbarBtn>
        <ToolbarBtn ariaLabel="Search" onTap={() => undefined}>
          <SearchIcon />
        </ToolbarBtn>
      </div>
    </div>
  );
}

function ToolbarBtn({
  children,
  onTap,
  ariaLabel,
}: {
  children: ReactNode;
  onTap: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={ariaLabel}
      className="flex h-7 w-7 items-center justify-center rounded-md active:bg-white/10"
    >
      {children}
    </button>
  );
}

function BackspaceIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path
        d="M8.2 1H19a2 2 0 012 2v10a2 2 0 01-2 2H8.2a2 2 0 01-1.5-.7L1.4 8.7a1 1 0 010-1.4L6.7 1.7A2 2 0 018.2 1z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M11 5l5 5M16 5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function TabIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path d="M1 7h12M9 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CapsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2L13 8H10.5V11H5.5V8H3L8 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
      />
      <path d="M4 13.5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShiftIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
      <path
        d="M8 1L14 8H11V13H5V8H2L8 1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
      <path
        d="M14 1v5.5a2 2 0 01-2 2H4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M7 5.5L3.5 8.5 7 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden>
      <rect x="4" y="1" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 8.5a6 6 0 0012 0M7 14.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function HideKeyboardIcon() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden>
      <rect x="1" y="1" width="22" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 4h2M8 4h2M12 4h2M16 4h2M4 7h2M8 7h2M12 7h2M16 7h4M6 10h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 16l4 2 4-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden>
      <path d="M8 1L2 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden>
      <path d="M2 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
      <path d="M4 4H11a4 4 0 010 8H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6 1L3 4l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
      <path d="M12 4H5a4 4 0 000 8h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 1l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PasteIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
      <rect x="3" y="3" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 3V2a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
      <path d="M1 1h12M1 6h12M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.2 9.2L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

interface KeyboardTextFieldProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  title?: string;
  onCommit?: () => void;
}

export function KeyboardTextField({
  value,
  onChange,
  placeholder,
  className,
  rows = 1,
  title,
  onCommit,
}: KeyboardTextFieldProps) {
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    onCommit?.();
  };

  useEffect(() => {
    if (!open || !fieldRef.current) return;
    // Wait a frame for keyboard height to publish, then scroll field into view
    const id = window.setTimeout(() => {
      fieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <>
      <button
        ref={fieldRef}
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        style={rows > 1 ? { minHeight: `${rows * 1.5 + 1.5}rem` } : undefined}
      >
        {value ? (
          <span className="whitespace-pre-wrap text-left">{value}</span>
        ) : (
          <span className="text-left text-gray-400">{placeholder}</span>
        )}
      </button>
      {open && <InAppKeyboard value={value} onChange={onChange} onClose={close} title={title} />}
    </>
  );
}
