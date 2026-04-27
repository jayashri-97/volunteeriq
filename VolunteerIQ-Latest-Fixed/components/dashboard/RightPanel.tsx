'use client';

import { useState } from 'react';
import type { Need, Volunteer, ActivityLog } from '@/lib/mock-data';
import { URGENCY_COLORS, URGENCY_LABELS, STATUS_LABELS, getAvatarColor, getMatchColor } from '@/lib/constants';
import { cn } from '@/lib/utils';
import RelativeTime from '@/components/ui/RelativeTime';
import ActivityFeedItem from './ActivityFeedItem';

interface RightPanelProps {
  selectedNeed: Need | null;
  matchedVolunteers: (Volunteer & { matchScore: number; matchReason?: string })[];
  activities: ActivityLog[];
  onAssign: (volunteerId: string) => void;
  onResolve: () => void;
}

type Tab = 'volunteers' | 'detail' | 'activity';

interface AssignState {
  [volunteerId: string]: 'default' | 'loading' | 'assigned';
}

export default function RightPanel({
  selectedNeed,
  matchedVolunteers,
  activities,
  onAssign,
  onResolve,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('volunteers');
  const [assignStates, setAssignStates] = useState<AssignState>({});

  if (!selectedNeed) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}
            className="w-10 h-10 text-text4 mx-auto mb-3 opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="text-[11px] text-text3 font-medium">Select a need</p>
          <p className="text-[9px] text-text4 mt-1">Click a card or map pin to view details</p>
        </div>
      </div>
    );
  }

  const relatedActivities = activities.filter(a => a.needId === selectedNeed.id);
  const urgencyColor = URGENCY_COLORS[selectedNeed.urgency];

  const handleAssign = (volunteerId: string) => {
    setAssignStates(prev => ({ ...prev, [volunteerId]: 'loading' }));
    setTimeout(() => {
      setAssignStates(prev => ({ ...prev, [volunteerId]: 'assigned' }));
      onAssign(volunteerId);
    }, 1200);
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'volunteers', label: 'Volunteers', count: matchedVolunteers.length },
    { key: 'detail', label: 'Detail' },
    { key: 'activity', label: 'Activity', count: relatedActivities.length },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Need header */}
      <div className="p-3 border-b border-border1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: urgencyColor + '20', color: urgencyColor }}>
            {URGENCY_LABELS[selectedNeed.urgency]}
          </span>
          <span className="text-[9px] text-text3">{STATUS_LABELS[selectedNeed.status]}</span>
          <span className="text-[9px] font-mono text-text4 ml-auto">#{selectedNeed.id.slice(2)}</span>
        </div>
        <h2 className="text-[16px] font-bold text-text1 leading-tight">{selectedNeed.title}</h2>
        <p className="text-[12px] text-text2 font-bold mt-1.5 flex items-center gap-1.5">
          <span className="shrink-0">📍 {selectedNeed.location}</span>
          <span className="text-text3">·</span>
          <RelativeTime date={selectedNeed.reportedAt} className="font-mono text-v-blue" />
        </p>
        {selectedNeed.families > 0 && (
          <p className="text-[13px] font-bold mt-2.5 flex items-center gap-2">
            <span className="font-mono px-2 py-1 rounded bg-bg3 text-text2 border border-border1" style={{ color: urgencyColor }}>
              {selectedNeed.families.toLocaleString()}
            </span>
            <span style={{ color: 'var(--text2)' }}>families affected</span>
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border1">
        {tabs.map(tab => (
          <button key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 py-3 text-[13px] font-bold transition-colors relative',
              activeTab === tab.key ? 'text-text1' : 'text-text2 hover:text-v-blue'
            )}>
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 text-[8px] font-mono" style={{
                color: activeTab === tab.key ? 'var(--teal)' : 'var(--text2)'
              }}>{tab.count}</span>
            )}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-v-blue" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {/* VOLUNTEERS TAB */}
        {activeTab === 'volunteers' && (
          <div className="p-2.5 space-y-2">
            {matchedVolunteers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[10px] text-text3">No matched volunteers found</p>
                <p className="text-[8px] text-text4 mt-1">Try adjusting filters or check volunteer availability</p>
              </div>
            ) : (
              matchedVolunteers.map(vol => {
                const state = assignStates[vol.id] || 'default';
                const initials = vol.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                const avatarColor = getAvatarColor(vol.id);
                const matchColor = getMatchColor(vol.matchScore);
                const isAssigned = state === 'assigned' || selectedNeed.assignedVolunteerIds.includes(vol.id);

                return (
                  <div key={vol.id}
                    className={cn(
                      'rounded-lg border p-3 transition-all duration-200',
                      isAssigned ? 'border-emerald-200 bg-emerald-50' : 'border-border1 bg-bg2 hover:border-border2'
                    )}>
                    {/* Top row: avatar + name + score */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: avatarColor }}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-text1 truncate">{vol.name}</span>
                          <span className="text-[11px] font-bold font-mono flex-shrink-0" style={{ color: matchColor }}>
                            {vol.matchScore}%
                          </span>
                        </div>
                        {vol.eta && (
                          <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--teal)' }}>
                            ETA {vol.eta}
                          </p>
                        )}
                        <p className="text-[10px] text-text2 font-bold mt-0.5">📍 {vol.location}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {vol.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-bg3 text-text2 border border-border1">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* AI Recommendation Reason */}
                    {vol.matchReason && (
                      <div className="mt-2.5 p-2 rounded-md bg-v-blue/5 border border-v-blue/20">
                        <div className="flex items-start gap-1.5">
                          <svg className="w-3 h-3 text-v-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <p className="text-[9px] text-text2 leading-snug">
                            <span className="font-semibold text-v-blue">AI Match: </span>
                            {vol.matchReason}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Availability bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-text2 font-bold uppercase tracking-wider">Availability</span>
                        <span className="text-[10px] font-bold font-mono text-text1">{vol.availability}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-bg4 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${vol.availability}%`,
                            background: vol.availability > 60 ? 'var(--teal)' : vol.availability > 30 ? 'var(--orange)' : 'var(--red)',
                          }} />
                      </div>
                    </div>

                    {/* Assign button */}
                    <button
                      onClick={() => handleAssign(vol.id)}
                      disabled={isAssigned || state === 'loading'}
                      className={cn(
                        'w-full mt-2.5 h-7 rounded-md text-[10px] font-bold transition-all duration-200',
                        isAssigned
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                          : state === 'loading'
                          ? 'bg-bg3 text-text3 border border-border1 cursor-wait'
                          : 'bg-bg2 text-text2 border border-border2 hover:border-v-blue hover:text-v-blue'
                      )}>
                      {isAssigned ? (
                        <span className="flex items-center justify-center gap-1">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                          Assigned — Email Sent
                        </span>
                      ) : state === 'loading' ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                          </svg>
                          Assigning…
                        </span>
                      ) : (
                        'Assign Volunteer'
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* DETAIL TAB */}
        {activeTab === 'detail' && (
          <div className="p-3 space-y-3">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-text2 mb-1.5">Description</h3>
              <p className="text-[13px] text-text2 leading-relaxed">{selectedNeed.description}</p>
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-text2 mb-1.5">Raw Field Report</h3>
              <div className="p-3 rounded-md bg-bg3 border border-border1">
                <p className="text-[12px] text-text3 font-mono leading-relaxed italic">
                  &quot;{selectedNeed.rawReport}&quot;
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-md bg-bg3 border border-border1">
                <span className="text-[10px] text-text2 font-bold uppercase tracking-wider">Type</span>
                <p className="text-[12px] text-text1 font-bold mt-1">{selectedNeed.type}</p>
              </div>
              <div className="p-2.5 rounded-md bg-bg3 border border-border1">
                <span className="text-[10px] text-text2 font-bold uppercase tracking-wider">District</span>
                <p className="text-[12px] text-text1 font-bold mt-1">{selectedNeed.district}</p>
              </div>
              <div className="p-2.5 rounded-md bg-bg3 border border-border1">
                <span className="text-[10px] text-text2 font-bold uppercase tracking-wider">Score</span>
                <p className="text-[12px] font-bold font-mono mt-1" style={{ color: urgencyColor }}>{selectedNeed.score}</p>
              </div>
              <div className="p-2.5 rounded-md bg-bg3 border border-border1">
                <span className="text-[10px] text-text2 font-bold uppercase tracking-wider">Coords</span>
                <p className="text-[12px] text-text3 font-mono mt-1">{selectedNeed.lat.toFixed(3)}, {selectedNeed.lng.toFixed(3)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-text2 mb-1">Assigned ({selectedNeed.assignedVolunteerIds.length})</h3>
              {selectedNeed.assignedVolunteerIds.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedNeed.assignedVolunteerIds.map(vid => (
                    <span key={vid} className="px-2 py-0.5 rounded text-[8px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {vid}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[9px] text-text4 italic">No volunteers assigned yet</p>
              )}
            </div>
            {/* Resolve button */}
            {selectedNeed.status !== 'resolved' && (
              <button onClick={onResolve}
                className="w-full h-8 rounded-md text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors mt-2">
                ✓ Mark as Resolved
              </button>
            )}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="p-2.5 space-y-1">
            {relatedActivities.length > 0 ? (
              relatedActivities
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map(activity => (
                  <ActivityFeedItem key={activity.id} activity={activity} />
                ))
            ) : (
              <div className="text-center py-6">
                <p className="text-[10px] text-text3">No activity recorded yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
