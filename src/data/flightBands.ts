export type FlightBand = 1 | 2 | 3;

export interface Destination {
  code: string;
  city: string;
  band: FlightBand;
}

export const BAND_LABELS: Record<FlightBand, string> = {
  1: 'Band 1 — up to 1h 30m',
  2: 'Band 2 — 1h 30m to 2h 30m',
  3: 'Band 3 — over 2h 30m',
};

const BAND_1 = [
  'BNX', 'DBV', 'LJU', 'SJJ', 'SKG', 'SKP', 'SOF', 'SPU', 'TGD', 'TIV', 'PUY', 'TIA',
  'OTP', 'ZAG', 'RJK', 'ZAD', 'VIE', 'NAP', 'CFU', 'OMO', 'BUD', 'OHD',
];

const BAND_2 = [
  'ATH', 'FCO', 'FRA', 'MLA', 'MXP', 'PRG', 'STR', 'BER', 'ZRH', 'IST', 'DUS', 'CPH',
  'BRU', 'HAJ', 'LYS', 'BRI', 'NUE', 'BLQ', 'SZG', 'KRK', 'NCE', 'CTA', 'RHO', 'ESB',
  'ADB', 'PMO', 'AHO', 'HER', 'JMK', 'CHQ', 'HAM', 'FLR', 'VCE', 'CGN', 'MRS', 'VAR',
  'GVA', 'TRS', 'KBP',
];

const BAND_3 = [
  'ARN', 'AMS', 'CDG', 'LCA', 'LHR', 'SVO', 'LED', 'MAD', 'CAI', 'BCN', 'VLC', 'AER',
  'OSL', 'OPO', 'AGP', 'LIS', 'KZN', 'TBS', 'PMI', 'GOT', 'AMM', 'BEY', 'HEL', 'KRR',
  'ROV', 'TLV',
];

const CITY_NAMES: Record<string, string> = {
  BNX: 'Banja Luka', DBV: 'Dubrovnik', LJU: 'Ljubljana', SJJ: 'Sarajevo', SKG: 'Thessaloniki',
  SKP: 'Skopje', SOF: 'Sofia', SPU: 'Split', TGD: 'Podgorica', TIV: 'Tivat', PUY: 'Pula',
  TIA: 'Tirana', OTP: 'Bucharest', ZAG: 'Zagreb', RJK: 'Rijeka', ZAD: 'Zadar', VIE: 'Vienna',
  NAP: 'Naples', CFU: 'Corfu', OMO: 'Mostar', BUD: 'Budapest', OHD: 'Ohrid', ATH: 'Athens',
  FCO: 'Rome Fiumicino', FRA: 'Frankfurt', MLA: 'Malta', MXP: 'Milan Malpensa', PRG: 'Prague',
  STR: 'Stuttgart', BER: 'Berlin', ZRH: 'Zurich', IST: 'Istanbul', DUS: 'Düsseldorf', CPH: 'Copenhagen',
  BRU: 'Brussels', HAJ: 'Hannover', LYS: 'Lyon', BRI: 'Bari', NUE: 'Nuremberg', BLQ: 'Bologna',
  SZG: 'Salzburg', KRK: 'Kraków', NCE: 'Nice', CTA: 'Catania', RHO: 'Rhodes', ESB: 'Ankara',
  ADB: 'Izmir', PMO: 'Palermo', AHO: 'Alghero', HER: 'Heraklion', JMK: 'Mykonos', CHQ: 'Chania',
  HAM: 'Hamburg', FLR: 'Florence', VCE: 'Venice', CGN: 'Cologne', MRS: 'Marseille', VAR: 'Varna',
  GVA: 'Geneva', TRS: 'Trieste', KBP: 'Kyiv', ARN: 'Stockholm', AMS: 'Amsterdam', CDG: 'Paris CDG',
  LCA: 'Larnaca', LHR: 'London Heathrow', SVO: 'Moscow Sheremetyevo', LED: 'St Petersburg', MAD: 'Madrid',
  CAI: 'Cairo', BCN: 'Barcelona', VLC: 'Valencia', AER: 'Sochi', OSL: 'Oslo', OPO: 'Porto',
  AGP: 'Málaga', LIS: 'Lisbon', KZN: 'Kazan', TBS: 'Tbilisi', PMI: 'Palma', GOT: 'Gothenburg',
  AMM: 'Amman', BEY: 'Beirut', HEL: 'Helsinki', KRR: 'Krasnodar', ROV: 'Rostov-on-Don', TLV: 'Tel Aviv',
};

function buildDestinations(codes: string[], band: FlightBand): Destination[] {
  return codes.map((code) => ({
    code,
    city: CITY_NAMES[code] ?? code,
    band,
  }));
}

export const ALL_DESTINATIONS: Destination[] = [
  ...buildDestinations(BAND_1, 1),
  ...buildDestinations(BAND_2, 2),
  ...buildDestinations(BAND_3, 3),
].sort((a, b) => a.city.localeCompare(b.city));

export function getBandForDestination(code: string): FlightBand | null {
  const dest = ALL_DESTINATIONS.find((d) => d.code === code.toUpperCase());
  return dest?.band ?? null;
}

export function getDestination(code: string): Destination | undefined {
  return ALL_DESTINATIONS.find((d) => d.code === code.toUpperCase());
}

export function searchDestinations(query: string): Destination[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_DESTINATIONS;
  return ALL_DESTINATIONS.filter(
    (d) => d.code.toLowerCase().includes(q) || d.city.toLowerCase().includes(q),
  );
}

export function aperitifGuidance(band: FlightBand): string {
  if (band === 3) return 'Band 3 — offer aperitif after crew release; serve even if passenger will not dine';
  if (band === 2) return 'Band 2 — CS assess time & BC load; aperitif only if enough time';
  return 'No aperitif in standard sequence';
}
