import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { MenuDiscussionGuide } from '../components/flight/MenuDiscussionGuide';
import { AperitifServiceGuide } from '../components/flight/AperitifServiceGuide';
import { showAperitifServiceGuide } from '../data/aperitifServiceGuide';
import { PageHeader } from '../components/layout/PageHeader';
import { BarCartGuide } from '../components/catering/BarCartGuide';
import { DeliveryNoteGuide } from '../components/catering/DeliveryNoteGuide';
import { DrinksUsedGuide } from '../components/catering/DrinksUsedGuide';
import { GalleyTabs } from '../components/catering/GalleyTabs';
import { PhaseStepper } from '../components/catering/PhaseStepper';
import { SealLocationGuide } from '../components/catering/SealLocationGuide';
import { getGalleyGuide } from '../data/cateringGuide';
import { aggregateDrinkUsage } from '../lib/flightSummary';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore } from '../stores/orderStore';
import type { FlightPhase, Galley } from '../types/catering';

export function CateringPage() {
  const flight = useFlightStore((s) => s.flight);
  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const [phase, setPhase] = useState<FlightPhase>('ground');
  const [galley, setGalley] = useState<Galley>('fwd');

  useEffect(() => {
    if (flight) void loadOrders(flight.id);
  }, [flight, loadOrders]);

  const drinkUsage = useMemo(() => aggregateDrinkUsage(orders), [orders]);

  const guide = getGalleyGuide(galley);

  return (
    <>
      <PageHeader title="Catering guide" />
      <p className="border-b border-gray-200 bg-white px-6 pb-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Help for filling delivery notes, ABC lists, and seal verification — use your paper forms; this page shows where to write.
      </p>
      <PhaseStepper active={phase} onChange={setPhase} />
      <GalleyTabs active={galley} onChange={setGalley} />

      <div className="flex-1 space-y-6 overflow-y-auto p-4 pb-12">
        {flight?.destination && flight.flightBand && (
          <MenuDiscussionGuide destination={flight.destination} band={flight.flightBand} />
        )}

        {flight?.flightBand && showAperitifServiceGuide(flight.flightBand) && (
          <AperitifServiceGuide band={flight.flightBand} />
        )}

        <DrinksUsedGuide usage={drinkUsage} phase={phase} />

        {galley === 'fwd' && <BarCartGuide />}

        <Link
          to="/checklist"
          className="flex min-h-14 items-center justify-between rounded-2xl border-2 border-dashed border-navy/30 bg-navy/5 px-5 py-4 text-navy active:bg-navy/10 dark:text-blue-300"
        >
          <div>
            <p className="font-semibold">Interactive checklist</p>
            <p className="text-sm opacity-80">Ground · After take-off · Before landing</p>
          </div>
          <span className="text-lg">→</span>
        </Link>

        {(phase === 'ground' || phase === 'descent') && (
          <SealLocationGuide sealBlocks={guide.sealBlocks} />
        )}

        <DeliveryNoteGuide
          cateringSections={guide.cateringSections}
          abcSections={guide.abcSections}
          phase={phase}
        />

        </div>
    </>
  );
}
