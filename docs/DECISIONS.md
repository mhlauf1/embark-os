# Embark OS - Architectural Decisions

## ADR-001: SQLite via Prisma over Supabase/Postgres

**Decision**: Start with SQLite as the database.

**Rationale**:
- Zero infrastructure cost or setup — just a local file
- Instant development cycle — no remote DB latency
- Prisma abstracts the database engine — switching to Postgres/Supabase later requires only changing the datasource in `schema.prisma`
- This is a single-user internal tool — SQLite handles the concurrency needs
- Reduces initial complexity and deployment dependencies

**Migration path**: Change `provider = "sqlite"` to `provider = "postgresql"`, update connection string, run `prisma migrate`.

---

## ADR-002: shadcn/ui over Full Component Library

**Decision**: Use shadcn/ui (Radix UI primitives with owned code) instead of MUI, Chakra, or Ant Design.

**Rationale**:
- Code ownership — components live in the project, fully customizable
- Radix UI primitives provide accessibility out of the box (ARIA, keyboard nav, focus management)
- Tailwind-native styling — no CSS-in-JS runtime or theme provider overhead
- Matches the design philosophy of Linear/Vercel — minimal, precise, not opinionated
- No version lock-in — update individual components without full library upgrades

---

## ADR-003: Zustand over React Context

**Decision**: Use Zustand for client-side state management.

**Rationale**:
- No Provider wrapper hell — works outside the React tree
- Minimal boilerplate — a store is a single function call
- Built-in persistence middleware (localStorage for sidebar state)
- Selective subscriptions — components only re-render when their slice changes
- Tiny bundle size (~1KB)
- Sufficient for the UI state needs: sidebar collapsed, active tab, view preferences

**What Zustand manages**: sidebar state, UI preferences, optimistic update state.
**What Zustand does NOT manage**: database/server state (handled by Server Components + fetch).

---

## ADR-004: TanStack Table over Simple HTML Tables

**Decision**: Use TanStack Table v8 for all tabular data.

**Rationale**:
- Sorting, filtering, and search built-in with zero custom logic
- Column visibility and ordering support
- Virtualization-ready for future large datasets
- Headless — full control over rendering and styling
- Type-safe column definitions
- Used for: locations table, contacts directory, metrics comparison

---

## ADR-005: Framer Motion over Pure CSS Animations

**Decision**: Use Framer Motion for animations.

**Rationale**:
- Layout animations (card reordering, kanban drag) require JS measurement
- Staggered entrance animations need orchestration not possible with CSS alone
- `AnimatePresence` handles exit animations cleanly
- Page transitions coordinate multiple elements
- Tab crossfade requires content measurement
- The spec demands Linear/Apple quality micro-interactions — Framer Motion delivers this

**Where used**: page transitions, card stagger, tab crossfade, sidebar collapse, status pill transitions, kanban drag feedback.

---

## ADR-006: Single-User Auth via NextAuth

**Decision**: Implement authentication with NextAuth credentials provider, single user.

**Rationale**:
- The app contains sensitive client data: infrastructure details, contact info, DNS configurations
- Even for a personal internal tool, accidental exposure (open laptop, shared screen, Vercel preview URL) warrants protection
- NextAuth credentials provider is the simplest auth pattern — no OAuth, no database sessions
- Email + password stored in environment variables
- JWT session with httpOnly cookie
- Middleware-based route protection covers all routes

**Not included**: User registration, password reset, multi-user support. This is a single-operator tool.

---

## ADR-007: App Router with Server Components

**Decision**: Use Next.js App Router with React Server Components for data fetching.

**Rationale**:
- Server Components fetch data directly via Prisma — no API routes needed for reads
- Reduces client-side JavaScript bundle
- Streaming and Suspense provide natural loading states
- Route groups `(auth)` and `(dashboard)` organize layout boundaries
- API routes used only for mutations (POST/PATCH/DELETE)

---

## ADR-008: Light Theme over Always-Dark

**Decision**: Switch from an always-dark theme to a light theme.

**Rationale**:
- Better readability for an operations dashboard used during daytime work
- More professional appearance when showing to PE stakeholders in meeting settings
- Improved contrast for data-dense tables and status badges
- All colors moved to semantic CSS custom properties (`--background`, `--foreground`, `--border`, etc.) and consumed via Tailwind classes (`bg-background`, `text-foreground`, `border-border`)
- Status badge text colors darkened (e.g., green-700, amber-800) for proper contrast on pastel backgrounds
- Inline styles (Recharts, Toaster) use `var(--token-name)` syntax for theme consistency
- The `className="dark"` was removed from the `<html>` tag; shadcn/ui `dark:` variants remain in components as fallback but are inactive

**Migration notes**: Hardcoded hex values (`#09090b`, `#111113`, `#18181b`, `#27272a`, `#fafafa`, etc.) were replaced across ~30 component files with semantic Tailwind classes.

---

## ADR-009: DM Serif Display for Display Typography

**Decision**: Use DM Serif Display (Google Fonts) alongside Geist for UI.

**Rationale**:
- Creates visual hierarchy between location names (editorial, warm) and UI elements (clean, modern)
- Matches the "warm editorial" template aesthetic used in Embark rebuilds
- DM Serif Display italic adds character without being decorative
- Limited to display contexts only — never used for body or UI text
- Loaded via `next/font/google` for optimal performance
