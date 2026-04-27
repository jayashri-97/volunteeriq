'use client';

import { useState } from 'react';
import type { Volunteer } from '@/lib/mock-data';
import { getAvatarColor, getMatchColor } from '@/lib/constants';
import type { AssignButtonState } from '@/lib/constants';
import { cn, scoreToPercent } from '@/lib/utils';

interface VolunteerCardProps {
  volunteer: Volunteer & { matchScore: number };
  onAssign: (volunteerId: string) => void;
  isAssigned?: boolean;
}

export default function VolunteerCard({ volunteer, onAssign, isAssigned = false }: VolunteerCardProps) {
  const [btnState, setBtnState] = useState<AssignButtonState>(isAssigned ? 'assigned' : 'default');
  const avatarColor = getAvatarColor(volunteer.id);
  const matchColor = getMatchColor(volunteer.matchScore);

  const handleAssign = () => {
    if (btnState !== 'default') return;
    setBtnState('loading');
    setTimeout(() => {
      setBtnState('assigned');
      onAssign(volunteer.id);
    }, 1200);
  };

  const initials = volunteer.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="p-3 rounded-lg border border-border1 bg-bg2 hover:border-border3 transition-colors duration-200 animate-card-slide">
      {/* Header: Avatar + Name + Match */}
      <div className="flex items-center gap-2.5 mb-2">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-text1 truncate">
              {volunteer.name}
            </span>
            {/* Match badge */}
            <span
              className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded shrink-0"
              style={{
                color: matchColor,
                background: volunteer.matchScore >= 85
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(245, 158, 11, 0.08)',
              }}
            >
              {volunteer.matchScore}%
            </span>
          </div>

          {/* ETA */}
          {volunteer.eta && (
            <span className="text-[9px] font-mono" style={{ color: 'var(--teal)' }}>
              ETA {volunteer.eta}
            </span>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-2">
        {volunteer.skills.slice(0, 4).map(skill => (
          <span
            key={skill}
            className="text-[8px] font-medium px-1.5 py-0.5 rounded-full bg-bg4 text-text2"
          >
            {skill}
          </span>
        ))}
        {volunteer.skills.length > 4 && (
          <span className="text-[8px] font-mono text-text3 px-1">
            +{volunteer.skills.length - 4}
          </span>
        )}
      </div>

      {/* Availability bar */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[8px] text-text3 uppercase tracking-wider">Availability</span>
          <span className="text-[9px] font-mono text-text2">{volunteer.availability}%</span>
        </div>
        <div className="h-[1.5px] w-full bg-border1 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${scoreToPercent(volunteer.availability)}%`,
              background: 'var(--teal)',
            }}
          />
        </div>
      </div>

      {/* Assign button */}
      <button
        onClick={handleAssign}
        disabled={btnState !== 'default'}
        className={cn(
          'w-full h-7 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all duration-200',
          btnState === 'default' &&
            'bg-v-blue/10 text-v-blue hover:bg-v-blue hover:text-white border border-v-blue/20 hover:border-v-blue',
          btnState === 'loading' &&
            'bg-bg3 text-text3 border border-border1 cursor-wait',
          btnState === 'assigned' &&
            'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
        )}
        aria-label={
          btnState === 'assigned'
            ? `${volunteer.name} assigned`
            : `Assign ${volunteer.name}`
        }
      >
        {btnState === 'default' && 'Assign'}
        {btnState === 'loading' && (
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            </svg>
            Assigning…
          </span>
        )}
        {btnState === 'assigned' && (
          <span className="flex items-center justify-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Assigned
          </span>
        )}
      </button>
    </div>
  );
}
