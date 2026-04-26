'use client';

import type { Need } from '@/lib/mock-data';
import { URGENCY_COLORS, URGENCY_BG, URGENCY_LABELS } from '@/lib/constants';
import { cn, scoreToPercent } from '@/lib/utils';
import RelativeTime from '@/components/ui/RelativeTime';

interface NeedCardProps {
  need: Need;
  selected: boolean;
  onClick: () => void;
}

export default function NeedCard({ need, selected, onClick }: NeedCardProps) {
  const isResolved = need.status === 'resolved';
  const isInProgress = need.status === 'in-progress';
  const urgencyColor = URGENCY_COLORS[need.urgency];
  const urgencyBg = URGENCY_BG[need.urgency];
  const urgencyLabel = URGENCY_LABELS[need.urgency];

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full text-left rounded-lg p-3 border transition-all duration-200 animate-card-slide',
        'hover:border-border3 hover:bg-bg3/50',
        selected
          ? 'border-v-blue bg-bg3/60'
          : 'border-border1 bg-bg2',
        isResolved && 'opacity-50'
      )}
      aria-label={`${need.type}: ${need.title}. Urgency: ${need.urgency}. Score: ${need.score}`}
    >
      {/* Selected accent bar */}
      {selected && (
        <div
          className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
          style={{ background: 'var(--blue)' }}
        />
      )}

      {/* Top row: score badge + type + status dot */}
      <div className="flex items-center gap-2 mb-1.5">
        {/* Score badge */}
        <span
          className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded text-[12px] font-mono font-bold"
          style={{ background: urgencyBg, color: urgencyColor }}
        >
          {need.score}
        </span>

        {/* Urgency label */}
        <span
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: urgencyColor }}
        >
          {urgencyLabel}
        </span>

        <div className="flex-1" />

        {/* Status dot */}
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            isInProgress && 'animate-blink'
          )}
          style={{
            background:
              need.status === 'unassigned'
                ? 'var(--text3)'
                : need.status === 'in-progress'
                ? 'var(--orange)'
                : need.status === 'assigned'
                ? 'var(--teal)'
                : 'var(--green)',
          }}
          title={need.status}
        />
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-bold text-text1 leading-tight mb-1.5 line-clamp-2">
        {need.title}
      </h3>

      {/* Location + time */}
      <div className="flex items-center gap-1.5 text-[11px] text-text2 font-bold mb-2.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span className="truncate">{need.location}</span>
        <span className="text-text3 font-bold">·</span>
        <RelativeTime date={need.reportedAt} className="font-mono font-bold shrink-0 text-v-blue" />
      </div>

      {/* Score bar */}
      <div className="h-[1.5px] w-full bg-border1 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${scoreToPercent(need.score)}%`,
            background: urgencyColor,
          }}
        />
      </div>

      {/* Families count */}
      {need.families > 0 && (
        <div className="mt-2 text-[12px] text-text2 font-bold">
          <span className="font-mono px-2 py-0.5 rounded bg-bg3 text-text2 border border-border1">{need.families}</span> families affected
        </div>
      )}
    </button>
  );
}
