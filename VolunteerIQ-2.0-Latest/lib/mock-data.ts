// ───────────────── VolunteerIQ Mock Data ─────────────────

import type { UrgencyLevel, NeedStatus, NeedType, VolunteerSkill, VolunteerStatus } from './constants';
import { extraNeeds } from './extra-needs';
import { extraVolunteers, extraMatchMap, extraActivityLog } from './extra-volunteers';

// ── Types ──

export interface Need {
  id: string;
  type: NeedType;
  title: string;
  location: string;
  district: string;
  lat: number;
  lng: number;
  urgency: UrgencyLevel;
  score: number;
  status: NeedStatus;
  families: number;
  description: string;
  rawReport: string;
  reportedAt: Date;
  resolvedAt?: Date;
  assignedVolunteerIds: string[];
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  skills: VolunteerSkill[];
  status: VolunteerStatus;
  availability: number; // 0-100
  location: string;
  lat: number;
  lng: number;
  eta?: string;
  matchScore?: number;
}

export interface ActivityLog {
  id: string;
  needId: string;
  action: 'created' | 'assigned' | 'resolved' | 'updated' | 'parsed' | 'escalated';
  description: string;
  timestamp: Date;
}

export interface Organization {
  id: string;
  name: string;
  coordinator: string;
  email: string;
  phone: string;
}

// ── Mock Needs ──

export const mockNeeds: Need[] = [
  {
    id: 'n-001',
    type: 'Water Supply',
    title: 'Drinking water shortage — Parbhani East',
    location: 'Parbhani East Ward 12',
    district: 'Parbhani',
    lat: 19.2610,
    lng: 76.7747,
    urgency: 'critical',
    score: 94,
    status: 'unassigned',
    families: 340,
    description: 'Bore wells dry for 72 hours. Pipeline from Godavari canal disrupted. 340 families without drinking water. Tanker supply needed urgently.',
    rawReport: 'Parbhani ward 12 bore wells dried up 3 days back. Canal pipeline broken near Godavari bridge. About 340 families. Need tanker trucks ASAP.',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    assignedVolunteerIds: [],
  },
  {
    id: 'n-002',
    type: 'Medical Aid',
    title: 'Flood injury cases — Washim Rural',
    location: 'Washim Rural PHC',
    district: 'Washim',
    lat: 20.1029,
    lng: 77.1471,
    urgency: 'critical',
    score: 91,
    status: 'in-progress',
    families: 180,
    description: 'Primary Health Center overwhelmed after flash floods. 23 injury cases, 7 requiring surgical attention. Medical supplies depleting.',
    rawReport: 'PHC Washim rural overflowing. 23 injuries from flash floods, 7 need surgery. Bandages and antibiotics running out. Doctor requested backup.',
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    assignedVolunteerIds: ['v-003'],
  },
  {
    id: 'n-003',
    type: 'Food Distribution',
    title: 'Food relief needed — Yavatmal South',
    location: 'Yavatmal South Colony',
    district: 'Yavatmal',
    lat: 20.3899,
    lng: 78.1307,
    urgency: 'high',
    score: 78,
    status: 'unassigned',
    families: 520,
    description: 'Prolonged drought has left farming communities without food reserves. 520 families need dry ration kits for 2 weeks.',
    rawReport: 'Yavatmal south colony. Drought hit farmers, no food stock left. 520 families. Need dry ration kits — rice, dal, oil. 2 week supply minimum.',
    reportedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    assignedVolunteerIds: [],
  },
  {
    id: 'n-004',
    type: 'Shelter',
    title: 'Temporary shelter — Nanded Floods',
    location: 'Nanded Riverbank Area',
    district: 'Nanded',
    lat: 19.1383,
    lng: 77.3210,
    urgency: 'high',
    score: 74,
    status: 'assigned',
    families: 210,
    description: 'Riverbank settlements submerged. 210 families displaced. Need tarpaulin sheets and temporary shelter at municipal school.',
    rawReport: 'Nanded river area flooded again. 210 families homes underwater. They can go to the municipal school nearby but need tents and tarps urgently.',
    reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    assignedVolunteerIds: ['v-001', 'v-005'],
  },
  {
    id: 'n-005',
    type: 'Search & Rescue',
    title: 'Missing persons — Akola landslide',
    location: 'Akola Hilly Terrain',
    district: 'Akola',
    lat: 20.7002,
    lng: 77.0082,
    urgency: 'high',
    score: 82,
    status: 'in-progress',
    families: 45,
    description: 'Landslide at hill area. 12 persons reported missing. Rescue teams from nearby districts requested. Heavy machinery needed.',
    rawReport: 'Akola hill area landslide happened early morning. 12 people missing under debris. Local rescue team too small. Need heavy equipment and more hands.',
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    assignedVolunteerIds: ['v-002', 'v-007'],
  },
  {
    id: 'n-006',
    type: 'Sanitation',
    title: 'Sewage overflow — Amravati Center',
    location: 'Amravati Ward 5',
    district: 'Amravati',
    lat: 20.9374,
    lng: 77.7796,
    urgency: 'medium',
    score: 56,
    status: 'unassigned',
    families: 150,
    description: 'Heavy rains caused sewage overflow in residential area. Risk of waterborne diseases. Chlorination and cleanup needed.',
    rawReport: 'Ward 5 Amravati sewage drains overflowing since 2 days. Stink everywhere. Kids falling sick. Need cleanup crew and chlorination.',
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    assignedVolunteerIds: [],
  },
  {
    id: 'n-007',
    type: 'Power Restoration',
    title: 'Power outage — Buldhana Rural',
    location: 'Buldhana Taluka',
    district: 'Buldhana',
    lat: 20.5297,
    lng: 76.1846,
    urgency: 'medium',
    score: 48,
    status: 'unassigned',
    families: 800,
    description: 'Storm damaged 3 electric poles. 800 families without power for 36 hours. MSEDCL team awaiting material supply.',
    rawReport: '3 electric poles fallen in Buldhana taluka area. 800 plus families no power since yesterday. MSEDCL says waiting for new poles.',
    reportedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    assignedVolunteerIds: [],
  },
  {
    id: 'n-008',
    type: 'Clothing',
    title: 'Winter clothing — Hingoli Schools',
    location: 'Hingoli District Schools',
    district: 'Hingoli',
    lat: 19.7150,
    lng: 77.1499,
    urgency: 'medium',
    score: 42,
    status: 'assigned',
    families: 300,
    description: 'Children in 12 rural schools lack adequate winter clothing. Temperatures dropping. Blankets and sweaters needed.',
    rawReport: 'Hingoli schools — kids coming without warm clothes. 12 schools, about 300 families affected. Need blankets and sweaters before cold wave hits.',
    reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    assignedVolunteerIds: ['v-009'],
  },
  {
    id: 'n-009',
    type: 'Road Clearance',
    title: 'Road blockage — Chandrapur Highway',
    location: 'Chandrapur NH-930',
    district: 'Chandrapur',
    lat: 19.9615,
    lng: 79.2961,
    urgency: 'medium',
    score: 38,
    status: 'in-progress',
    families: 0,
    description: 'Fallen trees blocking NH-930 for 8km stretch. Vehicles stranded. PWD team working but undermanned.',
    rawReport: 'Chandrapur highway NH-930 fully blocked. Trees fallen over 8km. Many trucks and cars stuck. PWD working but need more workers and equipment.',
    reportedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    assignedVolunteerIds: ['v-006'],
  },
  {
    id: 'n-010',
    type: 'Water Supply',
    title: 'Water purification — Latur Town',
    location: 'Latur Municipal Area',
    district: 'Latur',
    lat: 18.4088,
    lng: 76.5604,
    urgency: 'resolved',
    score: 86,
    status: 'resolved',
    families: 450,
    description: 'Contaminated water supply detected. RO systems deployed. All 450 families now have access to clean drinking water.',
    rawReport: 'Latur municipal water contamination reported. 450 families affected. Water purification team deployed RO units successfully.',
    reportedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    assignedVolunteerIds: ['v-004', 'v-008'],
  },
  {
    id: 'n-011',
    type: 'Medical Aid',
    title: 'Vaccination camp — Osmanabad',
    location: 'Osmanabad Central',
    district: 'Osmanabad',
    lat: 18.1860,
    lng: 76.0407,
    urgency: 'resolved',
    score: 72,
    status: 'resolved',
    families: 600,
    description: 'Post-flood vaccination drive completed. 600 families covered for typhoid and hepatitis A.',
    rawReport: 'Osmanabad vaccination camp done. 600 families vaccinated. Typhoid and Hep A covered. No adverse reactions reported.',
    reportedAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    assignedVolunteerIds: ['v-003', 'v-010'],
  },
  ...extraNeeds,
];

// ── Mock Volunteers ──

export const mockVolunteers: Volunteer[] = [
  {
    id: 'v-001',
    name: 'Rahul Deshmukh',
    phone: '+91 98765 43210',
    skills: ['Logistics', 'Driving', 'Construction'],
    status: 'deployed',
    availability: 30,
    location: 'Nanded',
    lat: 19.1605,
    lng: 77.3150,
    eta: '25 min',
  },
  {
    id: 'v-002',
    name: 'Priya Sharma',
    phone: '+91 98765 43211',
    skills: ['Rescue Operations', 'First Aid', 'Communication'],
    status: 'deployed',
    availability: 15,
    location: 'Akola',
    lat: 20.7069,
    lng: 77.0130,
    eta: '10 min',
  },
  {
    id: 'v-003',
    name: 'Dr. Ankit Patil',
    phone: '+91 98765 43212',
    skills: ['Medical', 'First Aid', 'Counseling'],
    status: 'deployed',
    availability: 45,
    location: 'Washim',
    lat: 20.1100,
    lng: 77.1500,
    eta: '5 min',
  },
  {
    id: 'v-004',
    name: 'Sneha Kulkarni',
    phone: '+91 98765 43213',
    skills: ['Water Purification', 'Logistics', 'Data Entry'],
    status: 'available',
    availability: 90,
    location: 'Latur',
    lat: 18.4000,
    lng: 76.5700,
  },
  {
    id: 'v-005',
    name: 'Vikram Jadhav',
    phone: '+91 98765 43214',
    skills: ['Construction', 'Driving', 'Logistics'],
    status: 'deployed',
    availability: 20,
    location: 'Nanded',
    lat: 19.1400,
    lng: 77.3300,
    eta: '30 min',
  },
  {
    id: 'v-006',
    name: 'Aditya Bhosale',
    phone: '+91 98765 43215',
    skills: ['Driving', 'Communication', 'Logistics'],
    status: 'deployed',
    availability: 55,
    location: 'Chandrapur',
    lat: 19.9500,
    lng: 79.3000,
    eta: '15 min',
  },
  {
    id: 'v-007',
    name: 'Meera Wagh',
    phone: '+91 98765 43216',
    skills: ['Rescue Operations', 'First Aid', 'Construction'],
    status: 'deployed',
    availability: 10,
    location: 'Akola',
    lat: 20.6900,
    lng: 77.0200,
    eta: '8 min',
  },
  {
    id: 'v-008',
    name: 'Sanjay Gaikwad',
    phone: '+91 98765 43217',
    skills: ['Water Purification', 'Cooking', 'Logistics'],
    status: 'available',
    availability: 85,
    location: 'Latur',
    lat: 18.4100,
    lng: 76.5500,
  },
  {
    id: 'v-009',
    name: 'Anjali Pawar',
    phone: '+91 98765 43218',
    skills: ['Communication', 'Data Entry', 'Translation'],
    status: 'deployed',
    availability: 40,
    location: 'Hingoli',
    lat: 19.7200,
    lng: 77.1600,
    eta: '20 min',
  },
  {
    id: 'v-010',
    name: 'Rohit Shinde',
    phone: '+91 98765 43219',
    skills: ['Medical', 'First Aid', 'Driving'],
    status: 'available',
    availability: 95,
    location: 'Osmanabad',
    lat: 18.1900,
    lng: 76.0500,
  },
  {
    id: 'v-011',
    name: 'Kavita Deshpande',
    phone: '+91 98765 43220',
    skills: ['Counseling', 'Communication', 'Translation'],
    status: 'available',
    availability: 80,
    location: 'Amravati',
    lat: 20.9400,
    lng: 77.7800,
  },
  {
    id: 'v-012',
    name: 'Nilesh Raut',
    phone: '+91 98765 43221',
    skills: ['Construction', 'Logistics', 'Driving'],
    status: 'available',
    availability: 70,
    location: 'Yavatmal',
    lat: 20.3900,
    lng: 78.1200,
  },
  ...extraVolunteers,
];

// ── Volunteer-Need Match Map ──
// Maps needId → array of volunteer IDs with match scores
export const matchMap: Record<string, { volunteerId: string; score: number }[]> = {
  'n-001': [
    { volunteerId: 'v-004', score: 92 },
    { volunteerId: 'v-008', score: 87 },
    { volunteerId: 'v-012', score: 71 },
  ],
  'n-002': [
    { volunteerId: 'v-003', score: 96 },
    { volunteerId: 'v-010', score: 89 },
    { volunteerId: 'v-011', score: 65 },
  ],
  'n-003': [
    { volunteerId: 'v-012', score: 82 },
    { volunteerId: 'v-008', score: 78 },
    { volunteerId: 'v-006', score: 60 },
  ],
  'n-004': [
    { volunteerId: 'v-001', score: 90 },
    { volunteerId: 'v-005', score: 88 },
    { volunteerId: 'v-012', score: 75 },
  ],
  'n-005': [
    { volunteerId: 'v-002', score: 94 },
    { volunteerId: 'v-007', score: 91 },
    { volunteerId: 'v-001', score: 68 },
  ],
  'n-006': [
    { volunteerId: 'v-004', score: 80 },
    { volunteerId: 'v-011', score: 72 },
    { volunteerId: 'v-008', score: 65 },
  ],
  'n-007': [
    { volunteerId: 'v-012', score: 76 },
    { volunteerId: 'v-005', score: 70 },
    { volunteerId: 'v-006', score: 62 },
  ],
  'n-008': [
    { volunteerId: 'v-009', score: 85 },
    { volunteerId: 'v-011', score: 80 },
    { volunteerId: 'v-004', score: 58 },
  ],
  'n-009': [
    { volunteerId: 'v-006', score: 88 },
    { volunteerId: 'v-001', score: 82 },
    { volunteerId: 'v-005', score: 74 },
  ],
  ...extraMatchMap,
};

// ── Mock Activity Log ──

export const mockActivityLog: ActivityLog[] = [
  {
    id: 'a-001',
    needId: 'n-001',
    action: 'created',
    description: 'Need reported via field SMS from **Parbhani coordinator**',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'a-002',
    needId: 'n-002',
    action: 'parsed',
    description: 'AI parsed field report — urgency set to **Critical**',
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
  },
  {
    id: 'a-003',
    needId: 'n-002',
    action: 'assigned',
    description: '**Dr. Ankit Patil** assigned to medical response',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'a-004',
    needId: 'n-004',
    action: 'assigned',
    description: '**Rahul Deshmukh** + **Vikram Jadhav** assigned for shelter setup',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
  },
  {
    id: 'a-005',
    needId: 'n-005',
    action: 'escalated',
    description: 'Need escalated — 12 missing persons, additional rescue team requested',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'a-006',
    needId: 'n-005',
    action: 'assigned',
    description: '**Priya Sharma** + **Meera Wagh** deployed for rescue operations',
    timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
  },
  {
    id: 'a-007',
    needId: 'n-010',
    action: 'resolved',
    description: 'Water purification complete — **450 families** now have clean water',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'a-008',
    needId: 'n-011',
    action: 'resolved',
    description: 'Vaccination camp completed — **600 families** covered',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'a-009',
    needId: 'n-006',
    action: 'created',
    description: 'Sanitation issue reported in **Amravati Ward 5**',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'a-010',
    needId: 'n-009',
    action: 'updated',
    description: 'PWD team clearance 40% complete, **Aditya Bhosale** assisting',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  ...extraActivityLog,
];

// ── Mock Organization ──

export const mockOrganization: Organization = {
  id: 'org-001',
  name: 'Maharashtra Relief Network',
  coordinator: 'Sunil Kale',
  email: 'coordinator@mrngo.org',
  phone: '+91 98765 00000',
};

// ── Computed Stats ──

export function computeStats(needs: Need[], volunteers: Volunteer[]) {
  return {
    critical: needs.filter(n => n.urgency === 'critical' && n.status !== 'resolved').length + 12,
    active: needs.filter(n => n.status !== 'resolved').length + 245,
    deployed: volunteers.filter(v => v.status === 'deployed').length + 1024,
    available: volunteers.filter(v => v.status === 'available').length + 1450,
    resolved: needs.filter(n => n.status === 'resolved').length + 512,
  };
}

// ── Get matched volunteers for a need ──

export function getMatchedVolunteers(needId: string): (Volunteer & { matchScore: number })[] {
  const matches = matchMap[needId] || [];
  return matches
    .map(m => {
      const vol = mockVolunteers.find(v => v.id === m.volunteerId);
      if (!vol) return null;
      return { ...vol, matchScore: m.score };
    })
    .filter((v): v is Volunteer & { matchScore: number } => v !== null);
}
