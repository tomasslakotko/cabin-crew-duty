import { useEffect, useState } from 'react';
import type { FlightBand } from '../../data/flightBands';
import { aperitifGuidance, BAND_LABELS, formatRoute, formatRouteCodes } from '../../data/flightBands';
import { getBandMenus, hasBandMenus } from '../../data/bandMenus';
import { AperitifServiceGuide } from './AperitifServiceGuide';
import { BandMenuGuide } from './BandMenuGuide';
import { GuideCard } from '../catering/GuideCard';
import { showAperitifServiceGuide } from '../../data/aperitifServiceGuide';

const STORAGE_KEY = 'crew-duty-menu-guide-hidden';

interface MenuDiscussionGuideProps {
  origin: string;
  destination: string;
  band: FlightBand;
  collapsible?: boolean;
}

export function MenuDiscussionGuide({
  origin,
  destination,
  band,
  collapsible = true,
}: MenuDiscussionGuideProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!collapsible) return;
    setHidden(localStorage.getItem(STORAGE_KEY) === '1');
  }, [collapsible]);

  function hide() {
    localStorage.setItem(STORAGE_KEY, '1');
    setHidden(true);
  }

  function show() {
    localStorage.removeItem(STORAGE_KEY);
    setHidden(false);
  }

  const routeLabel = formatRoute(origin, destination);
  const routeCodes = formatRouteCodes(origin, destination);
  const aperitif = aperitifGuidance(band);
  const bandMenus = getBandMenus(band);

  if (collapsible && hidden) {
    return (
      <div className="mb-6 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-gray-100">Menu discussion</span>
          <span className="mx-2 text-gray-300">·</span>
          <span className="font-mono font-bold text-navy dark:text-blue-300">{routeCodes}</span>
          <span className="mx-2 text-gray-300">·</span>
          Band {band}
        </p>
        <button
          type="button"
          onClick={show}
          className="shrink-0 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Show
        </button>
      </div>
    );
  }

  return (
    <GuideCard
      title="Menu discussion"
      badge={
        <span className="rounded-lg bg-navy px-2.5 py-1 text-xs font-bold text-white">
          {routeCodes} · Band {band}
        </span>
      }
      action={
        collapsible ? (
          <button
            type="button"
            onClick={hide}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Hide
          </button>
        ) : undefined
      }
    >
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Complete on the ground <strong>AFT → FWD</strong>. Essential for late-night departures.
        {` Flying ${routeLabel} (${BAND_LABELS[band].replace(/^Band \d — /, '')}).`}
      </p>

      <div className="mb-4 rounded-xl border border-navy/20 bg-navy/5 px-4 py-3 dark:border-blue-400/30 dark:bg-navy/20">
        <p className="text-sm font-semibold text-navy dark:text-blue-300">Aperitif</p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{aperitif}</p>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Before you start</p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
        <li>Familiarize yourself with products and quantities loaded for this flight</li>
        <li>Introduce yourself and the team if not done already</li>
        <li>Ask: would they like to <strong>DINE</strong>, <strong>RELAX</strong> or <strong>RETIRE</strong>?</li>
      </ul>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Order-taking sequence</p>
      <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {band === 3 && <li>Aperitif</li>}
        {band === 2 && <li>Aperitif (if time permits)</li>}
        <li>Main course and beverage to accompany</li>
        <li>For breakfast — always offer hot beverage selection</li>
        <li>Choice of water and preferences</li>
      </ol>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Use product knowledge and make suggestions to showcase what is on board.
      </p>

      {hasBandMenus(band) && <BandMenuGuide sections={bandMenus} />}

      {showAperitifServiceGuide(band) && (
        <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-700">
          <AperitifServiceGuide band={band} compact />
        </div>
      )}
    </GuideCard>
  );
}
