// ───────────────── VolunteerIQ Utilities ─────────────────

/** Merge class names, filtering falsy values */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Debounce a function call */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

/** Format relative time (e.g., "2m ago", "1h ago") — stable for SSR */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${diffDays}d ago`;
}

/** Alias for formatRelativeTime */
export const formatTimeAgo = formatRelativeTime;

/** Format time as HH:MM */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Calculate bar fill width as percentage */
export function scoreToPercent(score: number, max = 100): number {
  return Math.min(Math.max((score / max) * 100, 0), 100);
}

/** Generate a unique-ish ID */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
