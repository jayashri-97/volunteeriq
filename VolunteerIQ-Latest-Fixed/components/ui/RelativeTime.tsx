'use client';

import { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/lib/utils';

/**
 * Client-only relative time display.
 * Renders a placeholder on the server, then hydrates with actual relative time on the client.
 * This avoids SSR/client hydration mismatches caused by Date.now() differences.
 */
export default function RelativeTime({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) {
  const [text, setText] = useState('—');

  useEffect(() => {
    setText(formatRelativeTime(date));
    // Update every 30 seconds for live feel
    const interval = setInterval(() => {
      setText(formatRelativeTime(date));
    }, 30_000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <span className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}
