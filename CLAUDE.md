# NutriAI — Design & Development Context

## Product
NutriAI is an AI-powered nutrition tracking and dietitian management platform. Turkish dietitians (ages 30-55) use it to manage patients, review meals, create diet plans, and communicate — all within a professional medical context.

## Aesthetic: "Organik Profesyonel"
Imagine a **botanical reference book meets a modern health dashboard**. The design blends the warmth of nature (earthy greens, organic curves, generous whitespace) with clinical precision (tight data tables, clear hierarchies, purposeful animation).

### References
- **Linear** — spatial precision, keyboard-first, purposeful motion
- **Stripe** — typography clarity, information density done right
- Add: organic warmth via tinted neutrals and botanical green palette

### Anti-references
- Generic SaaS dashboards (purple gradients, glassmorphism, neon accents)
- "AI slop" aesthetics (emoji icons, uniform card grids, default Inter font)
- Over-animated interfaces (parallax everything, 3D transforms for no reason)

## Design Tokens
- **Font:** Outfit (geometric but warm terminals)
- **Colors:** OKLCH-based. Primary: deep forest green `oklch(0.40 0.10 155)`. Accent: warm teal. All neutrals are green-tinted.
- **60-30-10 rule:** 60% tinted neutral surfaces, 30% primary green panels/elements, 10% teal accent for CTAs and highlights
- **Spacing:** 4pt base grid
- **Radius:** 10px default, softer than sharp but not bubbly
- **Motion:** ease-out-quart curves, 200-300ms durations, staggered entrances. `prefers-reduced-motion` respected.

## Theme
- Light mode is primary
- Dark mode fully supported
- WCAG AA contrast minimum everywhere

## Language
- All UI text is in **Turkish**
- Use professional/medical tone, not casual

## Tech Stack
- React 19 + TypeScript
- Tailwind CSS 4 (with `@theme inline`)
- shadcn/ui (Radix UI primitives)
- Vite 7
- Zustand (state), React Hook Form + Zod (forms), Recharts (charts)
- Lucide React (icons — never use emoji for UI icons)

## File Structure Conventions
- `web/src/components/ui/` — shadcn/ui base components
- `web/src/components/layout/` — layout building blocks (sidebar, header, breadcrumbs)
- `web/src/components/shared/` — reusable cross-feature components
- `web/src/components/{feature}/` — feature-specific components
- `web/src/layouts/` — page layout wrappers
- `web/src/pages/` — route-level page components
- `web/src/stores/`, `hooks/`, `services/`, `mock/`, `types/`, `lib/` — business logic (DO NOT modify)

## Protected Files (Never Modify)
- `web/src/stores/` — Zustand stores
- `web/src/hooks/` — Custom hooks
- `web/src/services/` — API services
- `web/src/mock/` — Mock data
- `web/src/types/` — TypeScript types
- `web/src/lib/` — Utilities
- `shared/types/` — Shared types
