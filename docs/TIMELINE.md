# Embark OS - Build Timeline

## Phase 1: Foundation

### Deliverables
- [x] Generate all `/docs/*.md` files
- [x] Restructure to `src/` layout
- [x] Install all dependencies
- [x] Initialize shadcn/ui (light theme)
- [x] Initialize Prisma with SQLite
- [x] Create full schema + run migration
- [x] Create seed script with all 10 locations + contacts + notes
- [x] Build auth (next-auth credentials provider)
- [x] Build layout shell (sidebar + topbar)
- [x] Create `globals.css` with full design system tokens
- [x] Build Portfolio Overview page (`/`) with location cards grid
- [x] Summary stats bar (total locations, migrations, rebuilds)

### Routes Created
- `/login`
- `/` (portfolio overview)

---

## Phase 2: Core

### Deliverables
- [x] Location detail page (`/locations/[slug]`) with all 7 tabs
  - Overview, Site, Infrastructure, Migration, Contacts, Assets, Notes
- [x] Locations table (`/locations`) with TanStack Table
- [x] Contacts directory (`/contacts`) with TanStack Table
- [x] Inline editing pattern (click-to-edit) — see Phase 2b below
- [x] API routes for CRUD (locations, contacts, notes)
- [x] Copy-to-clipboard on DNS values and emails
- [x] Toast notifications on save

### Routes Created
- `/locations`
- `/locations/[slug]`
- `/contacts`
- `/api/locations/[id]`
- `/api/contacts/[id]`
- `/api/notes`

---

## Phase 2b: Inline Editing (added post-initial build)

### Deliverables
- [x] `InlineEditField` component — click-to-edit text with pencil icon, Enter/Escape/blur, checkmark/X buttons
- [x] `InlineSelectField` component — click-to-open dropdown for enum fields
- [x] `InlineToggleField` component — toggle switch for boolean fields
- [x] `useLocationUpdate` hook — shared PATCH handler with toast + `router.refresh()`
- [x] `StatusPill` upgraded — accepts optional `options` + `onSave` for clickable status dropdowns
- [x] OverviewTab — editable facility type, phone, address, all 9 rebuild requirement toggles
- [x] SiteTab — editable URL, platform, tech stack, all 4 Lighthouse scores, rebuild status pill, template, preview/live URLs
- [x] InfraTab — editable registrar, DNS provider, nameservers, hosting, email platform, MX/SPF/DKIM status pills, secondary domain + notes, infra notes
- [x] MigrationTab — clickable pipeline steps to set status, editable blocked-by + migration notes
- [x] AssetsTab — logo/brand toggle switches, photography dropdown, editable asset notes
- [x] Header status pills — migration + rebuild status clickable with dropdown
- [x] ContactsTab — full CRUD: add form, inline edit all fields, role dropdown, primary star toggle, delete with confirm
- [x] `POST /api/contacts` route with validation
- [x] Toast description text visibility fix (Sonner light theme)

### New Files
- `src/hooks/useLocationUpdate.ts`
- `src/components/shared/InlineEditField.tsx`
- `src/components/shared/InlineSelectField.tsx`
- `src/components/shared/InlineToggleField.tsx`
- `src/app/api/contacts/route.ts`

---

## Phase 3: Pipeline

### Deliverables
- [x] Migration kanban board
- [x] Rebuild kanban board
- [x] Drag-and-drop reordering (dnd-kit)
- [x] Quick-edit status from kanban cards
- [x] Tabbed view switching between pipelines

### Routes Created
- `/pipeline`

---

## Phase 4: Metrics

### Deliverables
- [x] Lighthouse score display (4 circular gauges per location)
- [x] Cross-portfolio score comparison table (color-coded cells)
- [x] Bar chart comparing scores across locations (Recharts)
- [x] "Last audited" timestamp + "Mark as audited" button
- [x] Score editing from metrics page and location detail

### Routes Created
- `/metrics`

---

## Phase 5: Polish

### Deliverables
- [x] Cmd+K command palette (cmdk)
- [x] Framer Motion animations
  - Staggered card entrance
  - Page transitions (fade + translateY)
  - Tab crossfade
  - Sidebar collapse animation
- [x] Keyboard shortcuts (Linear-style G+O, G+L, G+P, G+M, G+C)
- [x] Mobile responsiveness (sidebar collapse, table scroll, card stack)
- [x] Settings page (user preferences)
- [x] Final QA
  - No console errors/warnings
  - TypeScript strict, no `any`
  - All routes protected
  - Accessible (keyboard nav, ARIA labels)
  - `npm run build` succeeds

### Routes Created
- `/settings`

---

## Phase 6: Hardening & Enhancements (backlog)

### Remaining Items
- [x] Hardcoded hex cleanup — replaced all hardcoded hex values with semantic tokens (`text-success`, `text-warning`, `text-destructive`, `text-primary`, `text-muted-foreground`, `var(--chart-N)`) across 14 component files; added `--success` and `--warning` CSS custom properties
- [ ] Mobile responsiveness audit — test sidebar collapse, table scroll, card stacking on narrow viewports
- [ ] Data enrichment — run Lighthouse on portfolio sites, populate real scores in seed data
- [ ] Sanity CMS integration — connect location/content data to a Sanity dataset
- [ ] Deployment prep — env validation, SQLite → Postgres swap for Vercel, production hardening
- [ ] Note deletion — add ability to delete notes (currently only create + resolve)
- [ ] Contact creation from `/contacts` page — currently only possible from location detail
