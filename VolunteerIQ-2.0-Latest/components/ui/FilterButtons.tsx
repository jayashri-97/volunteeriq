'use client';

import { URGENCY_COLORS, URGENCY_LABELS } from '@/lib/constants';
import type { UrgencyLevel } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface FilterButtonsProps {
  activeFilters: Set<UrgencyLevel>;
  onToggle: (level: UrgencyLevel) => void;
}

const levels: UrgencyLevel[] = ['critical', 'high', 'medium', 'resolved'];

export default function FilterButtons({ activeFilters, onToggle }: FilterButtonsProps) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Filter by urgency">
      {levels.map(level => {
        const active = activeFilters.has(level);
        const color = URGENCY_COLORS[level];
        return (
          <button
            key={level}
            onClick={() => onToggle(level)}
            className={cn(
              'px-2 py-1 rounded text-[9px] font-semibold uppercase tracking-wider transition-all duration-150',
              'border',
              active
                ? 'border-transparent shadow-sm'
                : 'border-border1 bg-bg2 text-text2 hover:text-text1 hover:border-border2'
            )}
            style={
              active
                ? {
                    background: `${color}18`,
                    color: color,
                    borderColor: `${color}30`,
                  }
                : undefined
            }
            aria-pressed={active}
            aria-label={`Filter ${URGENCY_LABELS[level]}`}
          >
            {URGENCY_LABELS[level]}
          </button>
        );
      })}
    </div>
  );
}
