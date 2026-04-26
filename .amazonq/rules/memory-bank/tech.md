# VolunteerIQ — Technology Stack

## Languages & Runtimes
- **TypeScript 5** — strict typing throughout; all source files are `.ts` or `.tsx`
- **Node.js** — runtime for Next.js server and API routes

## Frameworks & Libraries

### Core
| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.4 | App Router, SSR, API Route Handlers |
| `react` | 19.2.4 | UI rendering |
| `react-dom` | 19.2.4 | DOM rendering |

### AI
| Package | Version | Purpose |
|---|---|---|
| `@google/generative-ai` | ^0.24.1 | Gemini 1.5 Flash — field report parsing + volunteer matching |

### Mapping
| Package | Version | Purpose |
|---|---|---|
| `leaflet` | ^1.9.4 | Interactive map rendering |
| `react-leaflet` | ^5.0.0 | React bindings for Leaflet |
| `@types/leaflet` | ^1.9.21 | TypeScript types for Leaflet |

### Styling
| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4 | Utility-first CSS (v4 with `@theme inline`) |
| `@tailwindcss/postcss` | ^4 | PostCSS integration for Tailwind v4 |

### Dev Tools
| Package | Version | Purpose |
|---|---|---|
| `typescript` | ^5 | Type checking |
| `eslint` | ^9 | Linting (flat config via `eslint.config.mjs`) |
| `eslint-config-next` | 16.2.4 | Next.js ESLint rules |

## Fonts
- **Syne** (400, 500, 600, 700) — primary sans-serif, loaded via `next/font/google`, mapped to `--font-sans`
- **IBM Plex Mono** (400, 500) — monospace for scores/stats, mapped to `--font-mono`

## Environment Variables
| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Google Gemini API key; app degrades gracefully to mock parser if absent |

## Development Commands
```bash
npm run dev      # Start development server (Next.js with hot reload)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Configuration Files
- `next.config.ts` — Next.js configuration (TypeScript)
- `tsconfig.json` — TypeScript compiler options with `@/` path alias pointing to project root
- `postcss.config.mjs` — PostCSS with `@tailwindcss/postcss` plugin
- `eslint.config.mjs` — ESLint flat config format (ESLint 9)

## Path Aliases
- `@/` → project root (`Volunteeriq-2.0/`) — used for all internal imports (e.g., `@/lib/constants`, `@/components/ui/Toast`)

## CSS Architecture
- **Tailwind v4** with `@theme inline` block in `globals.css` — no `tailwind.config.js` needed
- CSS custom properties defined in `:root` for inline `style={}` usage
- Matching `--color-*` variables in `@theme` for Tailwind class generation
- Custom keyframe animations: `pinPulse`, `blink`, `toastPop`, `cardSlideIn`, `modalSlide`, `sheetSlide`, `urgencyFlash`, `pinDrop`, `fadeIn`
- `prefers-reduced-motion` media query disables all animations for accessibility

## Deployment Target
- **Vercel** (recommended by Next.js team)
- Standard Next.js build output — compatible with any Node.js hosting

## Key Technical Decisions
- **No external state management** — React `useState`/`useMemo`/`useCallback` only
- **No database** — all data is in-memory mock; designed for demo/prototype phase
- **Leaflet loaded via `next/dynamic` with `ssr: false`** — avoids SSR window reference errors
- **Gemini API called server-side** in Route Handler — API key never exposed to client
- **300ms debounce** on search input via `useEffect` + `setTimeout`
- **`useCallback` on all event handlers** to prevent unnecessary re-renders
