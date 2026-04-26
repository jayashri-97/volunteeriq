# VolunteerIQ — Development Guidelines

## Code Quality Standards

### TypeScript Conventions
- **Strict typing everywhere** — no `any`, use explicit interfaces for all props and data shapes
- Props interfaces are defined inline above the component, not exported unless shared:
  ```tsx
  interface EmptyStateProps {
    icon?: React.ReactNode;
    title?: string;
    description: string;
    action?: { label: string; onClick: () => void; };
  }
  ```
- Use `as const` for readonly arrays that define union types:
  ```ts
  export const NEED_TYPES = ['Water Supply', 'Medical Aid', ...] as const;
  export type NeedType = typeof NEED_TYPES[number];
  ```
- Type guards use explicit return type predicates: `(v): v is NonNullable<typeof v> => v !== null`
- Exported types live in `lib/constants.ts`; data interfaces live in `lib/mock-data.ts`

### Component Structure
- All interactive components start with `'use client';` directive
- Static/layout components (landing page, root layout) are server components by default — no directive needed
- Component file = one default export, named after the file (PascalCase)
- Props destructured directly in function signature, not via intermediate variable

### Naming Conventions
- **Files**: PascalCase for components (`NeedCard.tsx`), camelCase for utilities (`mock-data.ts`, `utils.ts`)
- **Variables/functions**: camelCase (`handleNeedClick`, `filteredNeeds`, `computeStats`)
- **Types/interfaces**: PascalCase (`Need`, `Volunteer`, `ToastType`)
- **Constants**: SCREAMING_SNAKE_CASE for maps/configs (`URGENCY_COLORS`, `TOPBAR_STATS`)
- **CSS variables**: kebab-case with semantic prefixes (`--bg1`, `--text2`, `--v-blue`, `--z-modal`)
- **IDs**: prefixed strings (`n-001`, `v-003`, `a-010`, `org-001`)

### Section Comments
Use `// ── Section Name ──` style dividers to organize long files:
```ts
// ── State ──
// ── Debounced search ──
// ── Filtered needs ──
// ── Handlers ──
```
Use `// ───────────────── Title ─────────────────` for file-level headers.

---

## Styling Patterns

### Tailwind v4 Usage
- Use Tailwind utility classes for layout, spacing, and typography
- Use `bg-bg1`, `text-text1`, `border-border1` etc. (mapped from CSS variables via `@theme inline`)
- Use semantic color classes: `bg-v-blue`, `text-v-teal`, `bg-v-green`, `text-v-red`
- Use urgency color classes: `bg-urgency-critical`, `text-urgency-high`

### Inline Styles for Dynamic/CSS-Variable Values
When a value comes from a CSS variable or is computed dynamically, use `style={}`:
```tsx
<span style={{ color: 'var(--teal)' }}>text</span>
<div style={{ zIndex: 'var(--z-modal)' }}>...</div>
<div style={{ background: bgColors[type], borderColor: borderColors[type] }}>...</div>
```

### Class Merging with `cn()`
Use the `cn()` utility from `@/lib/utils` for conditional class composition:
```tsx
import { cn } from '@/lib/utils';

className={cn(
  'fixed top-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5',
  'text-[11px] font-medium text-text1',
  show ? 'animate-toast-pop' : 'opacity-0 -translate-y-3'
)}
```

### Typography Scale
Pixel-precise font sizes via arbitrary Tailwind values:
- `text-[9px]` — micro labels, empty state descriptions
- `text-[10px]` — secondary labels, stat subtitles
- `text-[11px]` — body text, button labels, toast messages
- `text-[12px]` — primary body, CTA buttons
- `text-[14px]` — card titles, modal headings
- `text-xl` / `text-2xl` — section headings
- `text-3xl` to `text-5xl` — hero headings

### Animation Classes
Use the custom animation classes defined in `globals.css`:
- `animate-blink` — status indicator dots
- `animate-spin` — loading spinners
- `animate-toast-pop` — toast entry
- `animate-card-slide` — new card entry (`animate-card-slide`)
- `animate-modal-slide` — modal entry
- `animate-fade-in` — overlay/backdrop entry
- `animate-pin-pulse` — map pin pulse ring
- `animate-pin-drop` — new map pin drop

---

## React Patterns

### State Management
All state is local to the page component — no external store. Pattern for complex pages:
```tsx
// ── State ──
const [needs, setNeeds] = useState(mockNeeds);
const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);
```

### Memoization
- `useMemo` for derived data (filtered lists, computed stats, selected item lookups)
- `useCallback` for all event handlers passed as props to prevent child re-renders:
```tsx
const handleNeedClick = useCallback((needId: string) => {
  setSelectedNeedId(prev => (prev === needId ? null : needId));
}, []);
```

### Debounced Input
Debounce via `useEffect` + `setTimeout` (not a library):
```tsx
useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

### SSR Hydration Safety
- Components that use `Date.now()` or browser APIs use `suppressHydrationWarning` on the element
- `RelativeTime` component initializes with `'—'` placeholder, then hydrates via `useEffect`
- Leaflet map loaded with `next/dynamic` + `ssr: false` to avoid window reference errors:
```tsx
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });
```

### Timed Effects with Cleanup
Always return cleanup from `useEffect` timers and intervals:
```tsx
useEffect(() => {
  const interval = setInterval(() => setText(formatRelativeTime(date)), 30_000);
  return () => clearInterval(interval);
}, [date]);
```

### Toggle Pattern for Sets
Use functional updates with `Set` for multi-select filters:
```tsx
setActiveFilters(prev => {
  const next = new Set(prev);
  next.has(level) ? next.delete(level) : next.add(level);
  return next;
});
```

---

## Accessibility Patterns

### ARIA Roles
- Lists use `role="list"` + `role="listitem"` on container and items
- Modals use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Toast uses `role="alert"` for errors, `role="status"` for info/success
- `aria-live="assertive"` for errors, `aria-live="polite"` for status updates

### Focus Management
Modal implements a full focus trap:
```tsx
// Trap focus within modal, cycle on Tab/Shift+Tab, close on Escape
const focusable = el.querySelectorAll<HTMLElement>(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
```

### Body Scroll Lock
Modals lock body scroll when open:
```tsx
useEffect(() => {
  document.body.style.overflow = open ? 'hidden' : '';
  return () => { document.body.style.overflow = ''; };
}, [open]);
```

### Reduced Motion
All animations are disabled via `globals.css` media query — no per-component handling needed:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## API Route Patterns

### Route Handler Structure (`app/api/*/route.ts`)
```ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // validate → process → return
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'message' }, { status: 500 });
  }
}
```

### Graceful Degradation
API routes always have a fallback path when external services (Gemini) are unavailable:
```ts
if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  return NextResponse.json(buildMockNeed(raw_text, submittedAt));
}
// ... try Gemini, catch → return NextResponse.json(buildMockNeed(...))
```

### Input Validation
Validate before any processing:
```ts
if (!raw_text) return NextResponse.json({ error: 'Please paste...' }, { status: 400 });
if (raw_text.length < 20) return NextResponse.json({ error: 'Too short...' }, { status: 400 });
if (raw_text.length > 5000) return NextResponse.json({ error: 'Too long...' }, { status: 400 });
```

### Gemini API Usage
```ts
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
});
const result = await model.generateContent([
  { text: SYSTEM_PROMPT },
  { text: `User input: ${userText}` },
]);
// Strip markdown fences from response before JSON.parse
const fence = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
if (fence) responseText = fence[1].trim();
```

---

## Data Patterns

### Record Maps for O(1) Lookups
Use `Record<string, T[]>` for ID-keyed lookup tables:
```ts
export const matchMap: Record<string, { volunteerId: string; score: number }[]> = {
  'n-001': [{ volunteerId: 'v-004', score: 92 }, ...],
};
```

### Computed Stats Functions
Pure functions that derive stats from arrays — no side effects:
```ts
export function computeStats(needs: Need[], volunteers: Volunteer[]) {
  return {
    critical: needs.filter(n => n.urgency === 'critical' && n.status !== 'resolved').length,
    ...
  };
}
```

### Immutable State Updates
Always spread to create new objects/arrays when updating state:
```tsx
setNeeds(prev =>
  prev.map(n =>
    n.id === selectedNeedId
      ? { ...n, status: 'resolved' as const, resolvedAt: new Date() }
      : n
  )
);
```

### `as const` for Discriminated Unions
Use `as const` when setting literal type values in state updates:
```tsx
{ ...n, status: 'resolved' as const }
{ ...n, status: 'assigned' as const }
```

---

## Import Conventions
- External libraries first, then internal imports
- Internal imports always use `@/` alias (never relative `../`)
- Type-only imports use `import type`:
  ```ts
  import type { Metadata } from 'next';
  import type { UrgencyLevel } from '@/lib/constants';
  ```
- Named exports from `lib/` files; default exports from component files
