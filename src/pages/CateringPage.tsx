import { useEffect, useMemo, useState } from 'react';
import { MenuDiscussionGuide } from '../components/flight/MenuDiscussionGuide';
import { AperitifServiceGuide } from '../components/flight/AperitifServiceGuide';
import { showAperitifServiceGuide } from '../data/aperitifServiceGuide';
import { PageHeader } from '../components/layout/PageHeader';
import { BobDutyGuide } from '../components/catering/BobDutyGuide';
import { BarCartGuide } from '../components/catering/BarCartGuide';
import { DeliveryNoteGuide } from '../components/catering/DeliveryNoteGuide';
import { DrinksUsedGuide } from '../components/catering/DrinksUsedGuide';
import { GalleyTabs } from '../components/catering/GalleyTabs';
import { PhaseStepper } from '../components/catering/PhaseStepper';
import { PhaseTasksGuide } from '../components/catering/PhaseTasksGuide';
import { SealLocationGuide } from '../components/catering/SealLocationGuide';
import { bobDutiesForPhase, getGalleyGuide } from '../data/cateringGuide';
import { PHASE_LABELS } from '../data/cateringConfig';
import { aggregateDrinkUsage } from '../lib/flightSummary';
import { useChecklistStore } from '../stores/checklistStore';
import { useFlightStore } from '../stores/flightStore';
import { useOrderStore } from '../stores/orderStore';
import type { FlightPhase, Galley } from '../types/catering';

export function CateringPage() {
  const flight = useFlightStore((s) => s.flight);
  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const loadChecklist = useChecklistStore((s) => s.loadChecklist);
  const [phase, setPhase] = useState<FlightPhase>('ground');
  const [galley, setGalley] = useState<Galley>('fwd');

  useEffect(() => {
    if (flight) {
      void loadOrders(flight.id);
      void loadChecklist(flight.id);
    }
  }, [flight, loadOrders, loadChecklist]);

  const drinkUsage = useMemo(() => aggregateDrinkUsage(orders), [orders]);

  const guide = getGalleyGuide(galley);
  const bobDuties = bobDutiesForPhase(phase);
  const bobPhaseLabel =
    phase === 'after_takeoff' ? 'After take-off' : phase === 'descent' ? 'Before landing' : '';

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

        <PhaseTasksGuide phase={phase} showSignoff={phase === 'descent'} />

        {(phase === 'ground' || phase === 'descent') && (
          <SealLocationGuide sealBlocks={guide.sealBlocks} />
        )}

        <DeliveryNoteGuide
          cateringSections={guide.cateringSections}
          abcSections={guide.abcSections}
          phase={phase}
        />

        {bobDuties.length > 0 && (
          <BobDutyGuide duties={bobDuties} phaseLabel={bobPhaseLabel || PHASE_LABELS[phase]} />
        )}

        {phase === 'descent' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <strong>Before landing:</strong> Re-seal all carts. Destroy spare seals. ABC copies — 1 for Cabin Senior envelope, rest in dry ice compartment.
          </div>
        )}
      </div>
    </>
  );
}
