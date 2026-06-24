import { Outlet } from 'react-router-dom';
import { FlightDestinationModal } from '../flight/FlightDestinationModal';
import { FlightRouteBar } from '../flight/FlightRouteBar';
import { useFlightStore } from '../../stores/flightStore';
import { Sidebar } from './Sidebar';
import { InstallHint } from './InstallHint';
import { UndoToast } from './UndoToast';

export function AppShell() {
  const flight = useFlightStore((s) => s.flight);
  const setDestination = useFlightStore((s) => s.setDestination);
  const needsDestination = flight && !flight.destination;

  return (
    <div className="flex h-full min-h-0 bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col safe-area-right safe-area-bottom">
        <FlightRouteBar />
        <Outlet />
      </main>
      <InstallHint />
      <UndoToast />
      {needsDestination && (
        <FlightDestinationModal onSelect={(code) => void setDestination(code)} />
      )}
    </div>
  );
}
