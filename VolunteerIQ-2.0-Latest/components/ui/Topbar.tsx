'use client';

import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

interface TopbarProps {
  stats: {
    critical: number;
    active: number;
    deployed: number;
    available: number;
    resolved: number;
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const statConfig = [
  { key: 'critical' as const, label: 'Critical', color: 'var(--red)', delta: '+2' },
  { key: 'active' as const, label: 'Active', color: 'var(--text2)', delta: '' },
  { key: 'deployed' as const, label: 'Deployed', color: 'var(--green)', delta: '' },
  { key: 'available' as const, label: 'Available', color: 'var(--teal)', delta: '' },
  { key: 'resolved' as const, label: 'Resolved', color: 'var(--purple)', delta: '+1' },
];

export default function Topbar({ stats, searchQuery, onSearchChange }: TopbarProps) {
  return (
    <header
      className="h-12 flex items-center justify-between px-4 border-b border-border1 shrink-0"
      style={{ background: 'var(--bg1)', zIndex: 'var(--z-topbar)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 min-w-[180px]">
        <Logo className="w-5 h-5" />
        <span className="text-[16px] font-bold tracking-tight text-text1">
          VolunteerIQ
        </span>
        <span
          className="ml-auto px-1.5 py-0.5 rounded-full text-[8px] font-mono font-medium uppercase tracking-wider animate-blink"
          style={{
            background: 'rgba(13, 148, 136, 0.1)',
            color: 'var(--teal)',
          }}
        >
          LIVE
        </span>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-0 divide-x divide-border1">
        {statConfig.map(({ key, label, color, delta }) => (
          <div
            key={key}
            className="flex flex-col items-center px-4 py-1"
          >
            <span
              className="text-[16px] font-mono font-bold tabular-nums"
              style={{ color }}
            >
              {stats[key]}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-text3">
              {label}
            </span>
            {delta && (
              <span
                className="text-[8px] font-mono"
                style={{ color }}
              >
                {delta}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search needs…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              'w-[160px] h-8 pl-8 pr-2 rounded-md text-[13px] font-medium',
              'bg-bg3 border border-border1 text-text1 placeholder:text-text2',
              'focus:border-v-blue focus:ring-0 outline-none',
              'transition-colors duration-150'
            )}
            aria-label="Search needs"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline text-[9px] font-mono text-text4 bg-bg4 px-1 rounded">
            /
          </kbd>
        </div>
      </div>
    </header>
  );
}
