import { Outlet } from 'react-router-dom';
import { FlightRouteModal } from '../flight/FlightRouteModal';
import { hasCompleteRoute } from '../flight/FlightRouteLabel';
import { FlightRouteBar } from '../flight/FlightRouteBar';
import { HUB_CODE } from '../../data/flightBands';
import { useFlightStore } from '../../stores/flightStore';
import { Sidebar } from './Sidebar';
import { InstallHint } from './InstallHint';
import { UndoToast } from './UndoToast';

export function AppShell() {
  const flight = useFlightStore((s) => s.flight);
  const setRoute = useFlightStore((s) => s.setRoute);
  const needsRoute = flight && !hasCompleteRoute(flight);

  return (
    <div className="flex h-full min-h-0 bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col safe-area-right safe-area-bottom">
        <FlightRouteBar />
        <Outlet />
      </main>
      <InstallHint />
      <UndoToast />
      {needsRoute && (
        <FlightRouteModal
          initialOrigin={flight.origin ?? HUB_CODE}
          initialDestination={flight.destination}
          onConfirm={(origin, destination) => void setRoute(origin, destination)}
        />
      )}
    </div>
  );
}
