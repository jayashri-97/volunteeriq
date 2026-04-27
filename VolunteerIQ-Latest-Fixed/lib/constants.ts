// ───────────────── VolunteerIQ Constants ─────────────────

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'resolved';
export type NeedStatus = 'unassigned' | 'in-progress' | 'assigned' | 'resolved';
export type VolunteerStatus = 'available' | 'deployed' | 'offline';
export type AssignButtonState = 'default' | 'hover' | 'loading' | 'assigned';

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  critical: 'var(--red)',
  high: 'var(--orange)',
  medium: 'var(--green)',
  resolved: 'var(--text3)',
};

export const URGENCY_BG: Record<UrgencyLevel, string> = {
  critical: 'rgba(239, 68, 68, 0.08)',
  high: 'rgba(245, 158, 11, 0.08)',
  medium: 'rgba(16, 185, 129, 0.08)',
  resolved: 'rgba(156, 163, 175, 0.08)',
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  critical: 'CRIT',
  high: 'HIGH',
  medium: 'MED',
  resolved: 'DONE',
};

export const STATUS_LABELS: Record<NeedStatus, string> = {
  'unassigned': 'Unassigned',
  'in-progress': 'In Progress',
  'assigned': 'Assigned',
  'resolved': 'Resolved',
};

export const NEED_TYPES = [
  'Water Supply',
  'Medical Aid',
  'Food Distribution',
  'Shelter',
  'Search & Rescue',
  'Clothing',
  'Sanitation',
  'Power Restoration',
  'Road Clearance',
  'Communication',
  'Earthquake Relief',
  'Cyclone Response',
  'Flood Rescue',
  'Heatwave Relief',
  'Chemical Spill',
  'Epidemic Control',
  'Landslide Clearance',
  'Tsunami Response',
  'Fire Response',
  'Child Protection',
  'Mental Health',
  'Animal Rescue',
  'Infrastructure Repair',
] as const;

export type NeedType = typeof NEED_TYPES[number];

export const VOLUNTEER_SKILLS = [
  'First Aid',
  'Driving',
  'Medical',
  'Logistics',
  'Communication',
  'Cooking',
  'Construction',
  'Counseling',
  'Water Purification',
  'Rescue Operations',
  'Data Entry',
  'Translation',
  'Engineering',
  'Swimming',
  'Hazmat Handling',
  'Firefighting',
  'Crowd Management',
  'Nursing',
  'Child Care',
  'Veterinary',
] as const;

export type VolunteerSkill = typeof VOLUNTEER_SKILLS[number];

// Avatar color generation from ID
export function getAvatarColor(id: string): string {
  const colors = [
    '#5352ED', '#2ED8A3', '#FF4757', '#FFA502',
    '#2ED573', '#A855F7', '#FFD93D', '#FF6B81',
    '#70A1FF', '#7BED9F',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Match score color
export function getMatchColor(score: number): string {
  return score >= 85 ? 'var(--green)' : 'var(--orange)';
}

// Topbar stat config
export const TOPBAR_STATS = [
  { key: 'critical', label: 'Critical', color: 'var(--red)' },
  { key: 'active', label: 'Active', color: 'var(--text2)' },
  { key: 'deployed', label: 'Deployed', color: 'var(--green)' },
  { key: 'available', label: 'Available', color: 'var(--teal)' },
  { key: 'resolved', label: 'Resolved', color: 'var(--purple)' },
] as const;
