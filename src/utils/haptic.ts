/**
 * Haptic feedback for mobile web.
 * Uses Vibration API where available (Android Chrome).
 * Silently no-ops on unsupported platforms (iOS Safari).
 */
export function haptic(ms: number = 10): void {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch {
    // Silently ignore — not all browsers support vibration
  }
}
