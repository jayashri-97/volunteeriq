# VolunteerIQ

**AI-powered disaster relief coordination — from raw field report to matched volunteer in under 10 seconds.**

VolunteerIQ is a web platform that lets NGO field coordinators paste any unstructured disaster report — a WhatsApp message, an SMS, a handwritten note — and receive an urgency-scored, geo-located need card with AI-ranked volunteer matches, ready to dispatch in one click.

---

## Team

| Name | Role |
|---|---|
| **Vivek Ingale** | Team Lead · Full-Stack Engineer · Gemini AI Integration |
| **Jayashri Shimpi** | Frontend Engineer · UI/UX · Component Architecture |

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         END-TO-END FLOW                                     │
│                                                                             │
│  Coordinator                 VolunteerIQ                    Gemini AI       │
│      │                           │                              │           │
│      │  Paste raw report         │                              │           │
│      │ ─────────────────────────▶│                              │           │
│      │  (any language, format)   │  POST /api/parse-need        │           │
│      │                           │ ─────────────────────────────▶           │
│      │                           │                    Parse report          │
│      │                           │                    (12 fields, JSON)     │
│      │                           │◀─────────────────────────────           │
│      │                           │  Match volunteers            │           │
│      │                           │ ─────────────────────────────▶           │
│      │                           │                    Rank top 3            │
│      │                           │◀─────────────────────────────           │
│      │  Need card on map         │                              │           │
│      │◀──────────────────────────│                              │           │
│      │  Matched volunteers shown │                              │           │
│      │◀──────────────────────────│                              │           │
│      │                           │                              │           │
│      │  Click Assign ────────────▶ Status: assigned             │           │
│      │                                                          │           │
└─────────────────────────────────────────────────────────────────────────────┘
```

```
┌────────────────────────── DASHBOARD LAYOUT ──────────────────────────────┐
│  Topbar ─ Logo · Live stats (Critical / Active / Deployed / Available)   │
├──────────────┬──────────────────────────────────┬────────────────────────┤
│  LEFT PANEL  │         CENTER — MAP              │     RIGHT PANEL        │
│              │                                  │                        │
│  Urgency     │  Leaflet.js India map            │  Volunteers tab        │
│  filters     │  · Color-coded pins              │  · Match score 0-100   │
│              │    critical  = red               │  · Skill tags          │
│  Needs list  │    high      = amber             │  · ETA estimate        │
│  sorted by   │    medium    = green             │  · Assign button       │
│  score DESC  │    resolved  = grey              │                        │
│              │  · Pulse ring on critical        │  Detail tab            │
│  Search bar  │  · Fly-to on selection           │  · Raw report          │
│  (300ms      │  · Tooltip on hover              │  · Parsed fields       │
│  debounced)  │                                  │  · Contact info        │
│              │  Input strip (bottom)            │                        │
│              │  · Textarea (20–5000 chars)      │  Activity tab          │
│              │  · File upload (.txt/.csv/.pdf)  │  · Event timeline      │
│              │  · Ctrl+Enter to parse           │  · Action log          │
│              │  · Drag-and-drop files           │                        │
└──────────────┴──────────────────────────────────┴────────────────────────┘
│                      MOBILE NAV (bottom, < md breakpoint)                │
│               Needs · Map · Submit · Profile                             │
└──────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────── URGENCY SCORING FORMULA ──────────────────────────┐
│                                                                        │
│  finalScore = (ai_score × 0.5)                                        │
│             + (recency_weight × 0.3 × 10)                             │
│             + (family_weight  × 0.2)                                  │
│                                                                        │
│  where:                                                                │
│    ai_score      = Gemini score 1–10                                  │
│    recency_weight = max(0, 1.0 − hours_since_report × 0.05)           │
│    family_weight  = min(family_count / 50, 1.0) × 10                 │
│                                                                        │
│  Result scaled 0–100. Urgency level:                                  │
│    ai_score >= 8  →  critical   ai_score >= 5  →  high   else medium  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

- **Gemini AI field report parser** — accepts raw text in any language or format; extracts 12 structured fields including location, urgency score, required skills, and family count in under 3 seconds
- **Dual-AI architecture** — a second Gemini call immediately ranks the top 3 matched volunteers for each parsed need, weighted by skill overlap, geographic proximity, and current availability
- **Intelligent fallback** — a fully functional rule-based parser runs without a Gemini API key; the app never breaks, even in offline or key-absent conditions
- **Live India map** — Leaflet.js interactive map centered on India, with urgency-coloured circular pins, animated pulse rings on critical needs, fly-to navigation on selection, and rich hover tooltips
- **Real-time urgency dashboard** — needs sorted by composite urgency score, with live stat counters (Critical / Active / Deployed / Available / Resolved) in the topbar
- **File ingestion** — drag-and-drop or button upload of `.txt`, `.csv`, and `.pdf` field reports directly into the parse input; PDF upload is noted for AI extraction
- **Debounced search** — 300ms debounced cross-field search across need title, location, type, and district
- **Multi-level filtering** — toggle filters for Critical / High / Medium / Resolved urgency levels independently
- **One-click volunteer assignment** — select a matched volunteer and assign; need status updates to `assigned` and the topbar stats recompute immediately
- **Resolve flow with modal confirmation** — coordinators mark a need resolved via a confirmation modal; the need moves to resolved state and timestamps are recorded
- **Activity log** — per-need chronological event feed tracking created, assigned, resolved, parsed, updated, and escalated actions
- **Mobile-responsive** — dedicated bottom tab navigation for small screens, switching between Needs, Map, Submit, and Profile views
- **24 disaster need types** and **20 volunteer skill categories** covering the full spectrum of Indian disaster relief scenarios
- **54-city Indian location table** with lat/lng coordinates for automatic geo-resolution when Gemini returns ambiguous location text

---

## Tech Stack

| Category | Technology | Version | Role |
|---|---|---|---|
| Framework | Next.js | 16.2.4 | App Router, SSR, API routes |
| UI library | React | 19.2.4 | Component model, hooks |
| Language | TypeScript | ^5 | Full type safety across all files |
| Styling | Tailwind CSS | ^4 | Utility classes via `@theme` inline tokens |
| CSS processor | @tailwindcss/postcss | ^4 | Tailwind v4 PostCSS integration |
| AI | @google/generative-ai | ^0.24.1 | Gemini 1.5 Flash — parse and match |
| Mapping | Leaflet.js | ^1.9.4 | Interactive India map |
| Mapping (React) | react-leaflet | ^5.0.0 | React bindings for Leaflet |
| Map types | @types/leaflet | ^1.9.21 | TypeScript types for Leaflet |
| Font — sans | Inter (Google Fonts) | — | Body and UI text via `next/font/google` |
| Font — mono | IBM Plex Mono (Google Fonts) | — | Scores, IDs, timestamps |
| Tile provider | OpenStreetMap | — | Map tiles, free, no API key required |
| Linting | ESLint | ^9 | Code quality; `eslint-config-next` 16.2.4 |
| Deployment target | Vercel / Node.js | — | `next build && next start` |

---

## Application Flow

### 1. Landing and authentication

Users arrive at `/` (the marketing landing page) and navigate to `/login` or `/register`. Both pages share a tab-switching component (`Tab = 'signin' | 'register'`) with styled inputs, focus rings, and client-side routing via `useRouter`. After sign-in the app routes to `/dashboard`.

### 2. Dashboard initialization

`app/dashboard/page.tsx` is a client component (`'use client'`). On mount it initialises React state from `lib/mock-data.ts`:

- `needs` — the full list of `Need` objects (base needs + `extraNeeds` from `lib/extra-needs.ts`)
- `mockVolunteers` — the volunteer roster (base + `extraVolunteers` from `lib/extra-volunteers.ts`)
- `mockActivityLog` — activity entries
- `matchMap` — a static lookup of pre-computed volunteer matches per need ID

`MapView` is loaded via `next/dynamic` with `ssr: false` because Leaflet uses browser APIs incompatible with server-side rendering.

### 3. Needs list and filtering

`filteredNeeds` is computed via `useMemo` from three inputs:

1. `activeFilters` — a `Set<UrgencyLevel>` that starts with all four levels active
2. `debouncedQuery` — search text with a 300ms `useEffect` debounce
3. Sort: resolved needs sink to the bottom; all others sort by `score` descending

The `FilterButtons` component renders CRIT / HIGH / MED / DONE toggle buttons. Each toggle calls `handleFilterToggle` which uses an immutable `Set` update pattern.

### 4. Parsing a field report

1. The coordinator types or pastes text into the `InputStrip` textarea (20–5000 chars validated client-side)
2. Clicking **Parse Report** or pressing `Ctrl+Enter` calls `handleParse` in the dashboard
3. `handleParse` sets `isParsing = true` and POSTs `{ raw_text }` to `/api/parse-need`
4. The API route validates the text, then:
   - **With `GEMINI_API_KEY`**: calls `gemini-flash-latest` with `PARSE_SYSTEM_PROMPT` at temperature 0.1, max 1024 tokens; strips any markdown fences from the JSON response; validates coordinates against India bounding box (lat 8–37, lng 68–97.5); falls back to keyword lookup if coords are invalid
   - **Without API key**: `buildMockNeed()` runs keyword-based type detection, urgency inference from signal words, regex-based family count and phone number extraction, and keyword-based location resolution
5. `computeFinalScore()` calculates the composite urgency score (0–100)
6. A second Gemini call (`MATCH_SYSTEM_PROMPT`) ranks the top 3 volunteers against the parsed need; falls back to `mockVolunteerMatch()` on failure
7. The API returns the complete `Need` object including `ai_matched_volunteers`
8. The dashboard prepends the new need to `needs` state, sets `newNeedId` to trigger map fly-to and a 6-second highlight, stores AI matches in `dynamicMatchMap`, and shows a success toast

### 5. Volunteer matching and assignment

When a need is selected (`handleNeedClick` or `handlePinClick`), `matchedVolunteers` is resolved via `useMemo`:

1. Check `dynamicMatchMap[selectedNeedId]` for AI-parsed matches
2. Try to resolve returned volunteer IDs against `mockVolunteers`; if IDs are placeholders, fall back to a proximity+availability composite score
3. Fall back to the static `matchMap` for pre-seeded needs

The `RightPanel` renders `VolunteerCard` for each matched volunteer. Clicking **Assign** calls `handleAssign`, which updates the need's `assignedVolunteerIds` and sets `status: 'assigned'`. Stats recompute via `useMemo(() => computeStats(needs, mockVolunteers))`.

### 6. Resolving a need

Clicking **Resolve** on the selected need opens the `Modal` component. Confirming calls `confirmResolve`, which sets `status: 'resolved'` and `resolvedAt: new Date()` on the need. The need card dims in the list; the map pin turns grey.

### 7. Map interactions

`MapView` maintains three `useRef` maps: `markersRef` (main pins), `pulseRef` (animated pulse rings for critical needs), and tracks `prevSelectedRef` to avoid redundant fly-to calls. On each render:

- Markers not in the current needs list are removed
- Each need gets or updates a `L.divIcon` styled circle; selected needs get a larger icon with an indigo border
- Critical needs get a secondary pulse marker with the CSS animation class `animate-pin-pulse`
- Clicking a marker calls `onPinClick`, which scrolls the corresponding `NeedCard` into view via `needsListRef`
- On new parsed need: map flies to the coordinates and shows a temporary indigo pulse for 5 seconds

### 8. State types

```typescript
// lib/constants.ts
type UrgencyLevel = 'critical' | 'high' | 'medium' | 'resolved';
type NeedStatus   = 'unassigned' | 'in-progress' | 'assigned' | 'resolved';
type VolunteerStatus = 'available' | 'deployed' | 'offline';

// lib/mock-data.ts
interface Need {
  id: string;          type: NeedType;       title: string;
  location: string;    district: string;     lat: number; lng: number;
  urgency: UrgencyLevel;  score: number;     status: NeedStatus;
  families: number;    description: string;  rawReport: string;
  reportedAt: Date;    resolvedAt?: Date;    assignedVolunteerIds: string[];
}

interface Volunteer {
  id: string;          name: string;         phone: string;
  skills: VolunteerSkill[];  status: VolunteerStatus;  availability: number;
  location: string;    lat: number;          lng: number;
  eta?: string;        matchScore?: number;
}

interface ActivityLog {
  id: string;  needId: string;
  action: 'created' | 'assigned' | 'resolved' | 'updated' | 'parsed' | 'escalated';
  description: string;  timestamp: Date;
}
```

---

## Project Structure

```
volunteeriq/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout — Inter + IBM Plex Mono fonts, metadata
│   ├── globals.css                   # Design system — Tailwind v4 @theme tokens, CSS vars,
│   │                                 #   animation keyframes (pinPulse, blink, toastPop,
│   │                                 #   cardSlideIn, modalSlide, sheetSlide, pinDrop, fadeIn)
│   ├── page.tsx                      # Landing page — hero, how-it-works, features, impact
│   ├── error.tsx                     # Global error boundary — Try Again + Contact Support
│   ├── not-found.tsx                 # 404 page — map pin SVG + navigation links
│   │
│   ├── login/
│   │   └── page.tsx                  # Login page — tabbed sign-in / register form
│   │
│   ├── register/
│   │   └── page.tsx                  # Registration page — same tab component as login
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Main coordinator dashboard — all state management,
│   │                                 #   parse handler, filter/search/sort, assignment flow
│   │
│   └── api/
│       ├── parse-need/
│       │   └── route.ts              # POST /api/parse-need
│       │                             #   Gemini parse + volunteer match + fallback parser
│       │                             #   India coordinate table (54 cities/districts)
│       │                             #   computeFinalScore, mapAiScoreToUrgency
│       └── match-volunteers/
│           └── route.ts              # POST /api/match-volunteers
│                                     #   Gemini ranking OR algorithmic fallbackMatcher
│                                     #   Filters to status='available' volunteers
│
├── components/
│   ├── Logo.tsx                      # SVG logo component
│   │
│   ├── dashboard/
│   │   ├── ActivityFeedItem.tsx      # Single activity log entry — icon, description, timestamp
│   │   ├── InputStrip.tsx            # Report textarea — validation, file upload, drag-drop,
│   │   │                             #   Ctrl+Enter shortcut, character counter
│   │   ├── NeedCard.tsx              # Urgency card — score badge, status dot, families,
│   │   │                             #   location, type, time ago, new-need highlight
│   │   ├── RightPanel.tsx            # Tab panel — Volunteers / Detail / Activity tabs
│   │   └── VolunteerCard.tsx         # Volunteer match card — avatar, skills, score,
│   │                                 #   ETA, assign button state machine
│   │
│   ├── map/
│   │   └── MapView.tsx               # Leaflet map — SSR-incompatible, loaded via next/dynamic;
│   │                                 #   marker management, pulse rings, legend, fly-to,
│   │                                 #   tooltip HTML, resize handler
│   │
│   └── ui/
│       ├── EmptyState.tsx            # Empty-list placeholder — SVG icon + message + CTA
│       ├── FilterButtons.tsx         # CRIT / HIGH / MED / DONE toggle buttons
│       ├── Modal.tsx                 # Confirmation modal — backdrop, title, body, actions
│       ├── MobileNav.tsx             # Bottom tab bar for small screens
│       ├── RelativeTime.tsx          # Live-updating relative timestamp ("2m ago")
│       ├── Toast.tsx                 # Notification toast — success / error / info;
│       │                             #   toastPop animation, auto-dismiss
│       └── Topbar.tsx                # Header — logo, live badge, 5 stat cells, search input
│
├── lib/
│   ├── constants.ts                  # All TypeScript enums and type unions:
│   │                                 #   UrgencyLevel, NeedStatus, VolunteerStatus,
│   │                                 #   AssignButtonState, NEED_TYPES (24), VOLUNTEER_SKILLS (20),
│   │                                 #   URGENCY_COLORS, URGENCY_BG, URGENCY_LABELS,
│   │                                 #   getAvatarColor (hash-based), getMatchColor, TOPBAR_STATS
│   ├── mock-data.ts                  # Data types + seed data: mockNeeds, mockVolunteers,
│   │                                 #   mockActivityLog, matchMap, computeStats,
│   │                                 #   getMatchedVolunteers — merges base + extra datasets
│   ├── extra-needs.ts                # Extended need dataset — Earthquake (Gujarat), Cyclone
│   │                                 #   (Odisha/AP), Flood (Assam/Bihar), Heatwave (UP/Rajasthan),
│   │                                 #   Chemical spill, Landslide (Uttarakhand), Wildfire
│   ├── extra-volunteers.ts           # Extended volunteer roster + extra match entries + activity
│   │                                 #   logs for the extended need set
│   └── utils.ts                      # Shared helpers: cn (classnames), debounce, formatRelativeTime,
│                                     #   formatTimeAgo, formatTime (HH:MM), scoreToPercent, uid
│
├── public/
│   ├── logo.png                      # Raster logo asset
│   ├── logo.svg                      # Vector logo asset
│   └── *.svg                         # Next.js default public assets
│
├── next.config.ts                    # Next.js configuration (minimal, default)
├── tsconfig.json                     # TypeScript — strict mode, path alias @/ → root
├── postcss.config.mjs                # PostCSS — @tailwindcss/postcss plugin
├── eslint.config.mjs                 # ESLint — eslint-config-next flat config
├── package.json                      # Dependencies and scripts
├── LICENSE                           # MIT — Copyright 2026 Vivek Ingale
└── AGENTS.md                         # AI agent instructions for Next.js version awareness
```

---

## Installation and Setup

### Prerequisites

- **Node.js** ≥ 18 (required by Next.js 16)
- **npm** ≥ 9
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey) *(optional — the app runs in intelligent fallback mode without one)*

### 1. Clone the repository

```bash
git clone https://github.com/your-username/volunteeriq.git
cd volunteeriq
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
# .env.local

# Gemini API key — get one free at https://aistudio.google.com
# If omitted, the app uses the intelligent rule-based fallback parser.
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Without a key**: the app parses field reports using keyword-based type detection, regex-based urgency inference, and the 54-city coordinate lookup table. All UI features work normally.
>
> **With a key**: `gemini-flash-latest` runs at temperature 0.1 for deterministic JSON extraction, followed by a second `gemini-2.0-flash` call for AI-ranked volunteer matching.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

### 6. Lint

```bash
npm run lint
```

---

## Quick Start Guide

### Parsing your first field report

1. Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. Locate the **input strip** at the bottom of the center map panel
3. Paste any disaster field report into the textarea — for example:

```
urgent — nandgaon village amravati district. 34 families no food 3 weeks.
2 kids under 5 malnourished. road ok by jeep. need food distribution
volunteers asap. contact sarpanch ramrao 9823xxxxxx
```

4. Click **Parse Report** or press `Ctrl+Enter`
5. Within a few seconds a new need card appears in the left panel and a pin drops on the map at the detected location
6. Click the need card or the map pin to load matched volunteers in the right panel
7. Click **Assign** on the top-matched volunteer to change the need status to `assigned`

### Uploading a report file

In the input strip, click **Upload** or drag a `.txt`, `.csv`, or `.pdf` file directly onto the textarea. The file contents populate the textarea for review before parsing.

### Keyboard shortcut

While focus is in the textarea: `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (macOS) submits the report for parsing.

### Filtering the needs list

Use the **CRIT / HIGH / MED / DONE** toggle buttons above the needs list to show or hide needs by urgency level. All filters are active by default. Filters combine with the search bar (300ms debounce) using `AND` logic.

### Resolving a need

Select a need, then click **Resolve** in the Detail tab of the right panel. Confirm in the modal. The need's status changes to `resolved`, it sinks to the bottom of the list, and its map pin turns grey.

---

## API Reference

### `POST /api/parse-need`

Parses a raw field report text and returns a structured need object with AI-ranked volunteer suggestions.

**Request body**

```json
{
  "raw_text": "string (20–5000 characters)"
}
```

**Response** (200 OK)

```json
{
  "id": "n-1234567890",
  "type": "Food Distribution",
  "title": "Food Distribution — Nandgaon, Amravati",
  "location": "Nandgaon, Amravati",
  "district": "Amravati",
  "state": "Maharashtra",
  "lat": 20.81,
  "lng": 77.68,
  "urgency": "critical",
  "score": 87,
  "ai_score": 9,
  "status": "unassigned",
  "families": 34,
  "description": "34 families without food for 3 weeks. Two children under 5 showing signs of malnutrition.",
  "rawReport": "urgent — nandgaon village...",
  "reportedAt": "2026-04-26T10:30:00.000Z",
  "assignedVolunteerIds": [],
  "skills_required": ["Logistics", "Cooking", "First Aid"],
  "contact": "9823xxxxxx",
  "notes": "Road accessible by jeep",
  "ai_matched_volunteers": [
    {
      "volunteer_id": "v-match-1",
      "match_score": 91,
      "match_reason": "Has Logistics and Cooking skills; located in Amravati district."
    }
  ]
}
```

**Error responses**

| Status | Condition | Message |
|--------|-----------|---------|
| 400 | Empty body | `"Please paste or type a field report first."` |
| 400 | Text < 20 chars | `"Report is too short. Add more detail about the need."` |
| 400 | Text > 5000 chars | `"Report exceeds 5,000 characters. Please shorten it."` |
| 500 | Unhandled exception | `"Failed to parse report. Please try again."` |

---

### `POST /api/match-volunteers`

Ranks available volunteers against a given need using Gemini AI or an algorithmic fallback.

**Request body**

```json
{
  "need": { "...Need object..." }
}
```

**Response** (200 OK)

```json
{
  "matches": [
    {
      "volunteerId": "v-003",
      "score": 94,
      "reason": "Has Medical skills and is located in Washim district."
    },
    {
      "volunteerId": "v-007",
      "score": 81,
      "reason": "Available immediately with First Aid certification."
    },
    {
      "volunteerId": "v-012",
      "score": 73,
      "reason": "Nearest available volunteer with relevant experience."
    }
  ]
}
```

The algorithmic fallback scorer awards:
- **Base**: 50 points
- **Location match** (volunteer district contains need district): +30 points
- **Skill overlap** (any required skill in volunteer's skills): +15 points
- **Availability**: up to +5 points (`availability / 20`, rounded)

---

## Design System

The design tokens are defined in `app/globals.css` as Tailwind v4 `@theme inline` declarations and mirrored as CSS custom properties in `:root` for use in inline styles.

```css
/* Background layers */
--bg1: #FFFFFF    --bg2: #F8F9FC    --bg3: #F0F2F7    --bg4: #E4E7EE

/* Text layers */
--text1: #111827  --text2: #4B5563  --text3: #9CA3AF  --text4: #D1D5DB

/* Border layers */
--border1: #E8EAF0  --border2: #D4D8E2  --border3: #BFC4D0

/* Semantic — maps to Tailwind as v-blue, v-teal, etc. */
--blue:   #4F46E5  --teal:   #0D9488  --red:    #EF4444
--orange: #F59E0B  --green:  #10B981  --purple: #8B5CF6

/* Urgency colours */
--urgency-critical: #EF4444  --urgency-high:     #F59E0B
--urgency-medium:   #10B981  --urgency-resolved: #9CA3AF
```

**Fonts** loaded via `next/font/google`:
- `Inter` (weights 400–800) → `--font-sans` / `--font-inter`
- `IBM Plex Mono` (weights 400–500) → `--font-mono` / `--font-ibm-plex-mono`

**Animation keyframes** defined in `globals.css`: `pinPulse`, `blink`, `toastPop`, `spin`, `cardSlideIn`, `modalSlide`, `sheetSlide`, `urgencyFlash`, `pinDrop`, `fadeIn`.

---

## Need Types and Volunteer Skills

### 24 disaster need types

`Water Supply` · `Medical Aid` · `Food Distribution` · `Shelter` · `Search & Rescue` · `Clothing` · `Sanitation` · `Power Restoration` · `Road Clearance` · `Communication` · `Earthquake Relief` · `Cyclone Response` · `Flood Rescue` · `Heatwave Relief` · `Chemical Spill` · `Epidemic Control` · `Landslide Clearance` · `Tsunami Response` · `Fire Response` · `Child Protection` · `Mental Health` · `Animal Rescue` · `Infrastructure Repair` · `Food Scarcity`

### 20 volunteer skill categories

`First Aid` · `Driving` · `Medical` · `Logistics` · `Communication` · `Cooking` · `Construction` · `Counseling` · `Water Purification` · `Rescue Operations` · `Data Entry` · `Translation` · `Engineering` · `Swimming` · `Hazmat Handling` · `Firefighting` · `Crowd Management` · `Nursing` · `Child Care` · `Veterinary`

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. **Fork** the repository and create a branch from `main`
2. **Verify** your changes with `npm run lint` and `npm run build` before opening a pull request — both must pass cleanly
3. **Match the code style** — TypeScript strict mode, Tailwind v4 utility classes, CSS custom properties for inline styles that reference design tokens, and the existing component patterns
4. **One concern per pull request** — keep changes focused; a PR that adds a feature should not also refactor unrelated code
5. **Document new environment variables** — if your change requires a new env var, add it to this README with a description and whether it is required or optional
6. **Do not commit `.env.local`** — it is already listed in `.gitignore`
7. For significant changes, open an issue first to discuss the approach before investing time in implementation

### Running locally with the full dataset

The extended needs and volunteers (`lib/extra-needs.ts` and `lib/extra-volunteers.ts`) are already merged at startup. No additional setup is needed to see the full dataset — just run `npm run dev`.

---

## License

MIT License — Copyright (c) 2026 Vivek Ingale & Jayashri Shimpi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
