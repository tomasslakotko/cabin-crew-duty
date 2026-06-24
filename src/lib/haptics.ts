export function hapticLight() {
  try {
    navigator.vibrate?.(12);
  } catch {
    /* unsupported */
  }
}

export function hapticSuccess() {
  try {
    navigator.vibrate?.([12, 40, 12]);
  } catch {
    /* unsupported */
  }
}

export function hapticMedium() {
  try {
    navigator.vibrate?.(24);
  } catch {
    /* unsupported */
  }
}
