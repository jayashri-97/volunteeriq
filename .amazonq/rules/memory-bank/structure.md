# VolunteerIQ — Project Structure

## Repository Layout
```
Volunteeriq-2.0/
└── Volunteeriq-2.0/          # Next.js application root
    ├── app/                   # Next.js App Router pages and API routes
    │   ├── api/               # Server-side API route handlers
    │   │   ├── parse-need/    # POST /api/parse-need — Gemini AI field report parser
    │   │   └── match-volunteers/ # Volunteer matching endpoint
    │   ├── dashboard/         # /dashboard — main coordinator dashboard
    │   ├── login/             # /login — authentication page
    │   ├── register/          # /register — NGO registration page
    │   ├── layout.tsx         # Root layout: fonts, metadata, global body styles
    │   ├── page.tsx           # Landing page with hero, stats strip, how-it-works
    │   ├── globals.css        # Design system: CSS variables, keyframes, Tailwind v4 theme
    │   ├── error.tsx          # Global error boundary
    │   └── not-found.tsx      # 404 page
    ├── components/            # Reusable React components
    │   ├── dashboard/         # Dashboard-specific components
    │   │   ├── NeedCard.tsx   # Individual need card with urgency badge and score
    │   │   ├── RightPanel.tsx # Detail panel: need info, matched volunteers, activity feed
    │   │   ├── InputStrip.tsx # Field report text input with parse trigger
    │   │   ├── ActivityFeedItem.tsx # Single activity log entry
    │   │   └── VolunteerCard.tsx    # Volunteer card with assign button
    │   ├── map/
    │   │   └── MapView.tsx    # Leaflet map with need pins, fly-to, pulse animations
    │   └── ui/                # Generic UI primitives
    │       ├── Topbar.tsx     # Stats bar + search input
    │       ├── FilterButtons.tsx # Urgency level filter toggles
    │       ├── MobileNav.tsx  # Bottom tab navigation for mobile
    │       ├── Modal.tsx      # Accessible confirmation modal
    │       ├── Toast.tsx      # Notification toast (success/error/parsing states)
    │       ├── EmptyState.tsx # Empty list placeholder with optional icon
    │       └── RelativeTime.tsx # Human-readable relative timestamps
    ├── lib/                   # Shared utilities and data
    │   ├── constants.ts       # Type definitions, enums, color maps, utility functions
    │   ├── mock-data.ts       # Seed data: needs, volunteers, match map, activity log
    │   ├── extra-needs.ts     # Additional mock needs (extended dataset)
    │   ├── extra-volunteers.ts # Additional mock volunteers + match map entries
    │   └── utils.ts           # General utility helpers
    ├── public/                # Static assets (SVGs)
    ├── next.config.ts         # Next.js configuration
    ├── tsconfig.json          # TypeScript configuration
    ├── eslint.config.mjs      # ESLint flat config
    ├── postcss.config.mjs     # PostCSS config for Tailwind v4
    ├── package.json           # Dependencies and scripts
    ├── AGENTS.md              # AI agent rules for this codebase
    ├── CLAUDE.md              # Claude-specific agent instructions
    └── implementation_plan    # Feature roadmap / implementation notes
```

## Core Components and Relationships

### Data Flow
```
Field Report Text
      ↓
InputStrip (UI) → POST /api/parse-need
                        ↓
                  Gemini AI (or mock parser)
                        ↓
                  Need object created
                        ↓
              DashboardPage state (useState)
              ↙           ↓           ↘
        NeedCard      MapView      RightPanel
        (list)        (pin)        (detail + volunteers)
```

### State Management
All state lives in `DashboardPage` (app/dashboard/page.tsx) — no external state library:
- `needs` — array of Need objects (mock seed + AI-parsed additions)
- `selectedNeedId` — drives right panel and map selection
- `dynamicMatchMap` — AI-returned volunteer matches keyed by need ID
- `activeFilters` — Set of active UrgencyLevel values
- `searchQuery` / `debouncedQuery` — 300ms debounced search

### Type System
All domain types originate from two files:
- `lib/constants.ts` — `UrgencyLevel`, `NeedStatus`, `NeedType`, `VolunteerSkill`, `VolunteerStatus`, `AssignButtonState`
- `lib/mock-data.ts` — `Need`, `Volunteer`, `ActivityLog`, `Organization` interfaces

### API Layer
- `app/api/parse-need/route.ts` — Next.js Route Handler (POST), calls Gemini 1.5 Flash for parsing + matching, gracefully degrades to keyword-based mock when `GEMINI_API_KEY` is absent

## Architectural Patterns

### Next.js App Router
- Pages use the `app/` directory with file-based routing
- API routes are Route Handlers (`route.ts`) using `NextRequest`/`NextResponse`
- Dynamic imports used for SSR-incompatible libraries (Leaflet loaded client-side only via `next/dynamic`)

### Component Boundaries
- `'use client'` directive on all interactive components (dashboard page, map, UI components)
- Server components used only for static pages (landing, layout)
- No server-side data fetching — all data is client-side mock or fetched via `fetch()` in event handlers

### Design System
- Single source of truth in `app/globals.css` using CSS custom properties (`--bg1`, `--text1`, `--teal`, etc.)
- Tailwind v4 `@theme inline` block maps CSS variables to Tailwind utility classes (`bg-bg1`, `text-text1`, `bg-v-blue`)
- Dual variable system: `--color-*` for Tailwind, `--*` for inline `style={}` usage
