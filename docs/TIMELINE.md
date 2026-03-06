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

## Phase 6: Hardening & Enhancements

### Deliverables
- [x] Hardcoded hex cleanup — replaced all hardcoded hex values with semantic tokens (`text-success`, `text-warning`, `text-destructive`, `text-primary`, `text-muted-foreground`, `var(--chart-N)`) across 14 component files; added `--success` and `--warning` CSS custom properties
- [x] Mobile responsiveness audit — added min-w to list view table, responsive padding on pipeline tabs + metrics chart, whitespace-nowrap on location detail tab triggers
- [x] Note deletion — two-click confirm delete with DELETE API route
- [x] Contact creation from `/contacts` page — add form with location selector, role dropdown, all fields

---

## Phase 7: Competitor & Reputation Tracking

### Deliverables
- [x] Competitor model (Prisma) — name, platform, city, state, rating, reviewCount per location
- [x] RatingSnapshot model — historical rating/review data per location
- [x] CRUD API routes for competitors and rating snapshots
- [x] CompetitorsTab on location detail — add/edit/delete competitors, CompetitorComparison side-by-side view
- [x] ReputationSection on metrics page — ratings table + trend chart (Recharts)
- [x] Reputation cell in StatsGrid bento grid (04 // REPUTATION)

### Routes Created
- `/api/competitors`
- `/api/competitors/[id]`
- `/api/rating-snapshots`
- `/api/locations/[id]/rating-snapshots`

### New Files
- `src/components/competitors/CompetitorCard.tsx`
- `src/components/competitors/CompetitorComparison.tsx`
- `src/components/competitors/CompetitorForm.tsx`
- `src/components/locations/LocationDetail/CompetitorsTab.tsx`
- `src/components/metrics/ReputationSection.tsx`
- `src/components/overview/ReputationCard.tsx`

---

## Phase 8: Service Coverage & PDF Export

### Deliverables
- [x] Service coverage matrix — 10 locations x 9 services grid with gap highlighting (services < 3 locations)
- [x] PDF export — `@react-pdf/renderer` for server-side portfolio PDF generation
- [x] ExportButton in overview toolbar
- [x] Portfolio overview editorial redesign — bento stats grid, pipeline tracks, location cards

### Routes Created
- `/services`
- `/api/reports/portfolio-pdf`

### New Files
- `src/components/services/ServiceMatrix.tsx`
- `src/components/overview/ExportButton.tsx`
- `src/components/overview/StatsGrid.tsx`
- `src/components/overview/PipelineTrack.tsx`
- `src/lib/pdf/generatePortfolioReport.tsx`

---

## Phase 9: Audit & SEO

### Deliverables
- [x] AuditSnapshot model — Lighthouse scores (perf, a11y, SEO, best practices) with grading
- [x] Audit dashboard — portfolio-level grades, comparison chart, run audits per location
- [x] Audit detail view — per-location score breakdown with history
- [x] SeoSnapshot model — on-page SEO crawl results with 16 checks
- [x] SEO crawler (`src/lib/seo-crawl.ts`) — cheerio-based HTML parser, 16 weighted checks, letter grading
- [x] SEO dashboard — portfolio avg grade, crawled count, pass/warn/fail distribution, location table, comparison chart
- [x] SEO detail view — all checks, issues filter, crawl history
- [x] SEO recommendations engine — deterministic, location-aware fix suggestions with copy-paste code snippets
  - Priority grouping (critical/important/minor)
  - Score potential calculator (before→after grade)
  - Per-check recommendations with contextual business data (name, city, services)

### Routes Created
- `/audit`
- `/audit/[locationId]`
- `/seo`
- `/seo/[locationId]`
- `/api/audits`
- `/api/audits/[id]`
- `/api/seo`

### New Files
- `src/lib/grading.ts`
- `src/lib/pagespeed.ts`
- `src/lib/seo-crawl.ts`
- `src/lib/seo-recommendations.ts`
- `src/components/audit/AuditDashboard.tsx`
- `src/components/audit/AuditDetailView.tsx`
- `src/components/audit/AuditItemList.tsx`
- `src/components/audit/AuditRunButton.tsx`
- `src/components/audit/AuditComparisonChart.tsx`
- `src/components/audit/ScoreTrendChart.tsx`
- `src/components/audit/GradePill.tsx`
- `src/components/seo/SeoDashboard.tsx`
- `src/components/seo/SeoDetailView.tsx`
- `src/components/seo/SeoCheckList.tsx`
- `src/components/seo/SeoScoreCard.tsx`
- `src/components/seo/SeoRunButton.tsx`
- `src/components/seo/SeoComparisonChart.tsx`
- `src/components/seo/SeoRecommendations.tsx`

---

## Backlog

### Remaining Items
- [ ] Data enrichment — run Lighthouse on portfolio sites, populate real scores in seed data
- [ ] Sanity CMS integration — connect location/content data to a Sanity dataset
- [ ] Deployment prep — env validation, SQLite → Postgres swap for Vercel, production hardening
