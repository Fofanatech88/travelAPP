import { Platform, Share } from 'react-native';

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'manual';

export async function shareSummary(summary: string): Promise<ShareOutcome> {
  if (Platform.OS === 'web') {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text: summary });
        return 'shared';
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError')
          return 'cancelled';
      }
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
        return 'copied';
      }
    } catch {
      // A selectable summary remains available when clipboard access is denied.
    }
    return 'manual';
  }
  try {
    const result = await Share.share({ message: summary });
    return result.action === Share.dismissedAction ? 'cancelled' : 'shared';
  } catch {
    return 'manual';
  }
}
