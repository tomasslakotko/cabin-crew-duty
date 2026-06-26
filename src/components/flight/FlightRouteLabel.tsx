import { formatRoute, formatRouteCodes, getAirport } from '../../data/flightBands';

interface FlightRouteLabelProps {
  origin: string;
  destination: string;
  /** Show IATA codes instead of city names */
  codes?: boolean;
  className?: string;
}

export function FlightRouteLabel({
  origin,
  destination,
  codes = false,
  className,
}: FlightRouteLabelProps) {
  const label = codes ? formatRouteCodes(origin, destination) : formatRoute(origin, destination);
  return <span className={className}>{label}</span>;
}

export function hasCompleteRoute(
  flight: { origin?: string; destination?: string } | null | undefined,
): flight is { origin: string; destination: string } {
  return Boolean(flight?.origin && flight?.destination);
}

export function routeCityLabel(code: string): string {
  return getAirport(code)?.city ?? code;
}
