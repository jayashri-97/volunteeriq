'use client';

import { cn, formatRelativeTime } from '@/lib/utils';
import type { ActivityLog } from '@/lib/mock-data';

interface ActivityFeedItemProps {
  activity: ActivityLog;
}

const actionColors: Record<ActivityLog['action'], string> = {
  created: 'var(--blue)',
  assigned: 'var(--teal)',
  resolved: 'var(--green)',
  updated: 'var(--orange)',
  parsed: 'var(--purple)',
  escalated: 'var(--red)',
};

export default function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const dotColor = actionColors[activity.action];

  // Render description with **bold** parts
  const renderDescription = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="font-semibold text-text1">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex items-start gap-2.5 py-2 group">
      {/* Colored dot */}
      <span
        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
        style={{ background: dotColor }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text2 leading-relaxed">
          {renderDescription(activity.description)}
        </p>
      </div>

      {/* Timestamp */}
      <span className="text-[9px] font-mono text-text3 shrink-0">
        {formatRelativeTime(activity.timestamp)}
      </span>
    </div>
  );
}
