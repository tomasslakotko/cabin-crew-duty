import { FlightRouteLabel, hasCompleteRoute } from './FlightRouteLabel';
import { FlightSwitcher } from './FlightSwitcher';
import { useFlightStore } from '../../stores/flightStore';

export function FlightRouteBar() {
  const flight = useFlightStore((s) => s.flight);

  if (!flight) return null;

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-2 landscape:px-6 dark:border-gray-700 dark:bg-gray-900">
      <FlightSwitcher />
      {hasCompleteRoute(flight) && flight.flightBand ? (
        <p className="hidden text-sm text-gray-600 sm:block dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            <FlightRouteLabel origin={flight.origin} destination={flight.destination} />
          </span>
          <span className="mx-2 text-gray-300">·</span>
          <span className="font-mono font-bold text-navy dark:text-blue-300">
            <FlightRouteLabel origin={flight.origin} destination={flight.destination} codes />
          </span>
          <span className="mx-2 text-gray-300">·</span>
          Band {flight.flightBand}
        </p>
      ) : (
        <p className="text-xs text-amber-600 dark:text-amber-400">Set route for this leg</p>
      )}
    </div>
  );
}
