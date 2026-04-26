'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { UrgencyLevel } from '@/lib/constants';
import {
  mockNeeds,
  mockVolunteers,
  mockActivityLog,
  matchMap,
  computeStats,
  getMatchedVolunteers,
  type Need,
} from '@/lib/mock-data';
import Topbar from '@/components/ui/Topbar';
import MobileNav from '@/components/ui/MobileNav';
import FilterButtons from '@/components/ui/FilterButtons';
import NeedCard from '@/components/dashboard/NeedCard';
import RightPanel from '@/components/dashboard/RightPanel';
import InputStrip from '@/components/dashboard/InputStrip';
import Toast from '@/components/ui/Toast';
import type { ToastType } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';

// Dynamic import for Leaflet (SSR-incompatible)
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-bg2">
      <div className="flex flex-col items-center gap-2">
        <svg className="w-5 h-5 animate-spin text-text3" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] text-text3">Loading map…</span>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  // ── State ──
  const [needs, setNeeds] = useState(mockNeeds);
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);
  const [newNeedId, setNewNeedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<UrgencyLevel>>(new Set(['critical', 'high', 'medium', 'resolved']));
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [mobileTab, setMobileTab] = useState<'needs' | 'map' | 'submit' | 'profile'>('needs');
  const [isParsing, setIsParsing] = useState(false);
  const [toastState, setToastState] = useState<{ visible: boolean; type: ToastType; message: string }>({
    visible: false,
    type: 'success',
    message: '',
  });
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  // Dynamic match map for AI-parsed needs
  const [dynamicMatchMap, setDynamicMatchMap] = useState<Record<string, { volunteerId: string; score: number; reason?: string }[]>>({});
  const needsListRef = useRef<HTMLDivElement>(null);

  // ── Debounced search ──
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Clear new-need highlight after 6 seconds ──
  useEffect(() => {
    if (!newNeedId) return;
    const t = setTimeout(() => setNewNeedId(null), 6000);
    return () => clearTimeout(t);
  }, [newNeedId]);

  // ── Filtered needs ──
  const filteredNeeds = useMemo(() => {
    return needs
      .filter(n => activeFilters.has(n.urgency))
      .filter(n => {
        if (!debouncedQuery) return true;
        const q = debouncedQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.location.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q) ||
          n.district.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Resolved last, then by score descending
        if (a.status === 'resolved' && b.status !== 'resolved') return 1;
        if (a.status !== 'resolved' && b.status === 'resolved') return -1;
        return b.score - a.score;
      });
  }, [needs, activeFilters, debouncedQuery]);

  // ── Stats ──
  const stats = useMemo(() => computeStats(needs, mockVolunteers), [needs]);

  // ── Selected need ──
  const selectedNeed = useMemo(
    () => needs.find(n => n.id === selectedNeedId) || null,
    [needs, selectedNeedId]
  );

  // ── Matched volunteers — check dynamic map first, then static ──
  const matchedVolunteers = useMemo(() => {
    if (!selectedNeedId) return [];

    // Check dynamic matches from AI parsing
    const dynamicMatches = dynamicMatchMap[selectedNeedId];
    if (dynamicMatches && dynamicMatches.length > 0) {
      // Try to resolve volunteer IDs against known volunteers
      const resolved = dynamicMatches.map(m => {
        const vol = mockVolunteers.find(v => v.id === m.volunteerId);
        if (vol) return { ...vol, matchScore: m.score, matchReason: m.reason };
        return null;
      }).filter((v): v is NonNullable<typeof v> => v !== null);

      if (resolved.length > 0) return resolved;

      // If AI returned placeholder IDs, pick top volunteers by availability + proximity
      // and map the AI reasons to them in order
      const selectedNeedObj = needs.find(n => n.id === selectedNeedId);
      if (selectedNeedObj) {
        const availableVols = mockVolunteers
          .filter(v => v.status === 'available' || v.status === 'deployed')
          .map(v => {
            // Proximity score (closer = higher)
            const dist = Math.sqrt(
              Math.pow(v.lat - selectedNeedObj.lat, 2) + Math.pow(v.lng - selectedNeedObj.lng, 2)
            );
            const proximityScore = Math.max(0, 100 - dist * 10);
            const availScore = v.availability;
            const compositeScore = Math.round(proximityScore * 0.6 + availScore * 0.4);
            return { ...v, matchScore: Math.min(compositeScore, 98) };
          })
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 3)
          .map((v, i) => ({
             ...v, 
             matchScore: dynamicMatches[i]?.score || v.matchScore,
             matchReason: dynamicMatches[i]?.reason || `Strong candidate based on proximity and availability.`
          }));
        return availableVols;
      }
    }

    // Fallback to static match map
    return getMatchedVolunteers(selectedNeedId);
  }, [selectedNeedId, dynamicMatchMap, needs]);

  // ── Handlers ──
  const handleNeedClick = useCallback((needId: string) => {
    setSelectedNeedId(prev => (prev === needId ? null : needId));
  }, []);

  const handlePinClick = useCallback((needId: string) => {
    setSelectedNeedId(needId);
    if (needsListRef.current) {
      const card = needsListRef.current.querySelector(`[data-need-id="${needId}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const handleFilterToggle = useCallback((level: UrgencyLevel) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  }, []);

  const handleAssign = useCallback((volunteerId: string) => {
    if (!selectedNeedId) return;
    setNeeds(prev =>
      prev.map(n =>
        n.id === selectedNeedId
          ? {
              ...n,
              assignedVolunteerIds: [...n.assignedVolunteerIds, volunteerId],
              status: 'assigned' as const,
            }
          : n
      )
    );
    showToast('success', 'Volunteer assigned successfully');
  }, [selectedNeedId]);

  const handleResolve = useCallback(() => {
    setResolveModalOpen(true);
  }, []);

  const confirmResolve = useCallback(() => {
    if (!selectedNeedId) return;
    setNeeds(prev =>
      prev.map(n =>
        n.id === selectedNeedId
          ? { ...n, status: 'resolved' as const, resolvedAt: new Date() }
          : n
      )
    );
    setResolveModalOpen(false);
    showToast('success', 'Need marked as resolved');
  }, [selectedNeedId]);

  // ── Parse handler — full pipeline ──
  const handleParse = useCallback(async (text: string) => {
    setIsParsing(true);
    showToast('parsing', 'Parsing report with AI…');

    try {
      const res = await fetch('/api/parse-need', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: text,
          coordinator_id: 'coord-001',
          submitted_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || 'Failed to parse report');
      }

      const parsed = await res.json();

      // Build the Need object from API response
      const newNeed: Need = {
        id: parsed.id,
        type: parsed.type as Need['type'],
        title: parsed.title,
        location: parsed.location,
        district: parsed.district,
        lat: parsed.lat,
        lng: parsed.lng,
        urgency: parsed.urgency as Need['urgency'],
        score: parsed.score,
        status: 'unassigned',
        families: parsed.families,
        description: parsed.description,
        rawReport: parsed.rawReport,
        reportedAt: new Date(parsed.reportedAt),
        assignedVolunteerIds: [],
      };

      // Add to needs list
      setNeeds(prev => [newNeed, ...prev]);

      // Set as new need (triggers map fly-to + pin pulse)
      setNewNeedId(newNeed.id);

      // Auto-select the new need (opens right panel)
      setSelectedNeedId(newNeed.id);

      // Store AI-matched volunteers in dynamic match map
      if (parsed.ai_matched_volunteers && Array.isArray(parsed.ai_matched_volunteers)) {
        setDynamicMatchMap(prev => ({
          ...prev,
          [newNeed.id]: parsed.ai_matched_volunteers.map((m: { volunteer_id: string; match_score: number; match_reason?: string }) => ({
            volunteerId: m.volunteer_id,
            score: m.match_score,
            reason: m.match_reason,
          })),
        }));
      }

      // Scroll new card into view
      setTimeout(() => {
        if (needsListRef.current) {
          const card = needsListRef.current.querySelector(`[data-need-id="${newNeed.id}"]`);
          card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      setIsParsing(false);
      showToast('success', `Need added — Urgency score: ${parsed.score}`);
    } catch (err) {
      setIsParsing(false);
      showToast('error', err instanceof Error ? err.message : 'Failed to parse report');
    }
  }, []);

  const showToast = (type: ToastType, message: string) => {
    setToastState({ visible: true, type, message });
  };

  const dismissToast = useCallback(() => {
    setToastState(prev => ({ ...prev, visible: false }));
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          (target as HTMLInputElement).blur();
          setSearchQuery('');
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[aria-label="Search needs"]');
        input?.focus();
      }

      if (e.key === 'Escape') {
        if (resolveModalOpen) {
          setResolveModalOpen(false);
        } else if (selectedNeedId) {
          setSelectedNeedId(null);
        }
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = filteredNeeds.findIndex(n => n.id === selectedNeedId);
        let nextIndex: number;
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < filteredNeeds.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredNeeds.length - 1;
        }
        const nextNeed = filteredNeeds[nextIndex];
        if (nextNeed) {
          setSelectedNeedId(nextNeed.id);
          if (needsListRef.current) {
            const card = needsListRef.current.querySelector(`[data-need-id="${nextNeed.id}"]`);
            card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }

      if (e.key === 'r' || e.key === 'R') {
        if (selectedNeed && selectedNeed.status !== 'resolved') {
          setResolveModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNeedId, filteredNeeds, resolveModalOpen, selectedNeed]);

  return (
    <div className="h-screen flex flex-col bg-bg1 overflow-hidden">
      {/* Topbar */}
      <Topbar stats={stats} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Toast */}
      <Toast
        type={toastState.type}
        message={toastState.message}
        visible={toastState.visible}
        onDismiss={dismissToast}
      />

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop 3-panel layout */}
        <div className="hidden md:grid grid-cols-[4fr_7fr_5fr] h-full">
          {/* Left Panel — Needs List */}
          <div className="flex flex-col border-r border-border1 bg-bg1 h-full overflow-hidden">
            {/* Filter bar */}
            <div className="p-2.5 border-b border-border1 shrink-0">
              <FilterButtons activeFilters={activeFilters} onToggle={handleFilterToggle} />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] font-mono text-text3">
                  {filteredNeeds.length} needs
                </span>
              </div>
            </div>

            {/* Needs list */}
            <div ref={needsListRef} className="flex-1 overflow-y-auto p-2 space-y-1.5" role="list" aria-label="Needs list">
              {filteredNeeds.length > 0 ? (
                filteredNeeds.map(need => (
                  <div
                    key={need.id}
                    data-need-id={need.id}
                    role="listitem"
                    className={need.id === newNeedId ? 'animate-card-slide' : ''}
                  >
                    <NeedCard
                      need={need}
                      selected={need.id === selectedNeedId}
                      onClick={() => handleNeedClick(need.id)}
                    />
                  </div>
                ))
              ) : (
                <EmptyState description="No needs match your current filters." />
              )}
            </div>
          </div>

          {/* Center Panel — Map + Input */}
          <div className="flex flex-col h-full min-w-0">
            <div className="flex-1 min-h-0" style={{ position: 'relative' }}>
              <MapView
                needs={filteredNeeds}
                selectedNeedId={selectedNeedId}
                newNeedId={newNeedId}
                onPinClick={handlePinClick}
              />
            </div>
            <div className="shrink-0 z-10 bg-bg1 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-border1">
              <InputStrip onParse={handleParse} isParsing={isParsing} />
            </div>
          </div>

          {/* Right Panel — Detail */}
          <div className="border-l border-border1 bg-bg1 overflow-y-auto h-full">
            <RightPanel
              selectedNeed={selectedNeed}
              matchedVolunteers={matchedVolunteers}
              activities={mockActivityLog}
              onAssign={handleAssign}
              onResolve={handleResolve}
            />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden h-full" suppressHydrationWarning>
          {mobileTab === 'needs' && (
            <div className="h-full flex flex-col">
              <div className="p-2.5 border-b border-border1">
                <FilterButtons activeFilters={activeFilters} onToggle={handleFilterToggle} />
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 pb-4">
                {filteredNeeds.map(need => (
                  <div key={need.id} data-need-id={need.id}>
                    <NeedCard
                      need={need}
                      selected={need.id === selectedNeedId}
                      onClick={() => handleNeedClick(need.id)}
                    />
                  </div>
                ))}
              </div>
              {selectedNeed && (
                <div className="border-t border-border1 max-h-[50vh] overflow-y-auto">
                  <RightPanel
                    selectedNeed={selectedNeed}
                    matchedVolunteers={matchedVolunteers}
                    activities={mockActivityLog}
                    onAssign={handleAssign}
                    onResolve={handleResolve}
                  />
                </div>
              )}
            </div>
          )}

          {mobileTab === 'map' && (
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <MapView
                  needs={filteredNeeds}
                  selectedNeedId={selectedNeedId}
                  newNeedId={newNeedId}
                  onPinClick={handlePinClick}
                />
              </div>
            </div>
          )}

          {mobileTab === 'submit' && (
            <div className="h-full flex flex-col justify-end">
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  description="Paste a field report below to parse it with AI and create a new need."
                />
              </div>
              <InputStrip onParse={handleParse} isParsing={isParsing} />
            </div>
          )}

          {mobileTab === 'profile' && (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                title="Profile"
                description="Profile settings will be available after backend integration."
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />

      {/* Resolve Confirmation Modal */}
      <Modal
        open={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Need"
        actions={
          <>
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 rounded-md text-[11px] font-semibold text-text2 bg-bg3 border border-border1 hover:bg-bg4 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmResolve}
              className="px-4 py-2 rounded-md text-[11px] font-semibold text-white bg-v-green hover:bg-v-green/90 transition-colors"
            >
              Confirm Resolve
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to mark <strong>&quot;{selectedNeed?.title}&quot;</strong> as resolved? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
