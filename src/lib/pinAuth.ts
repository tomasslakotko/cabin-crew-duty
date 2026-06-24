const UNLOCK_KEY = 'crew-duty-pin-unlocked';
export const APP_PIN = '0905';

export function isPinUnlocked(): boolean {
  return sessionStorage.getItem(UNLOCK_KEY) === 'true';
}

export function unlockPin(): void {
  sessionStorage.setItem(UNLOCK_KEY, 'true');
}

export function lockPin(): void {
  sessionStorage.removeItem(UNLOCK_KEY);
}

export function verifyPin(input: string): boolean {
  return input === APP_PIN;
}
