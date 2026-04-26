'use client';

import { cn } from '@/lib/utils';

type Tab = 'needs' | 'map' | 'submit' | 'profile';

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'needs',
    label: 'Needs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    key: 'map',
    label: 'Map',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    key: 'submit',
    label: 'Submit',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-14 flex items-stretch md:hidden border-t border-border1"
      style={{ background: 'var(--bg1)', zIndex: 'var(--z-topbar)', boxShadow: '0 -1px 3px rgba(0,0,0,0.04)' }}
      role="tablist"
      aria-label="Mobile navigation"
    >
      {tabs.map(({ key, label, icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(key)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150',
              active ? 'text-v-blue' : 'text-text3 hover:text-text2'
            )}
          >
            {icon}
            <span className="text-[9px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
