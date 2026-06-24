import { lockPin } from './pinAuth';
import { useFlightStore } from '../stores/flightStore';

/** Wipe all flights/data, lock PIN, and reload for a fresh duty day. */
export async function closeDayAndLock(): Promise<void> {
  await useFlightStore.getState().closeDay();
  lockPin();
  window.location.href = '/';
  window.location.reload();
}
