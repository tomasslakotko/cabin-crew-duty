import type { FlightBand } from './flightBands';

export const APERITIF_SERVICE_RULES = [
  'Aperitif service should be delivered after crew being released.',
  'Should passenger not wish to dine, aperitif is still to be served.',
  'All beverages shall be poured in the galley, except wine.',
  'Open a can of beer in the galley; offer the passenger to keep it or pour at the passenger table.',
  'Once passengers have enjoyed their aperitif, clear the table using a small tray.',
  'Collect up to four glasses at the same time.',
];

export function aperitifBandNote(band: FlightBand): string | null {
  if (band === 3) {
    return 'Band 3 — aperitif is standard. Serve after crew release.';
  }
  if (band === 2) {
    return 'Band 2 — CS to assess flight length and BC load; serve aperitif only if enough time.';
  }
  return null;
}

export function showAperitifServiceGuide(band: FlightBand): boolean {
  return band === 2 || band === 3;
}
