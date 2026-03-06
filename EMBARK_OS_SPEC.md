# Embark OS — Full Project Specification

> Master spec for Claude Code. Read this entire document before writing a single line of code.
> Generate all supporting `.md` files referenced at the bottom of this spec before beginning implementation.

---

## 1. What This Is

**Embark OS** is a private internal operations dashboard built for **Lauf** (the studio, owned by Michael Laufersweiler) to manage the full **Embark Pet Services** portfolio. It is the single source of truth for every location's web infrastructure, DNS/email state, migration status, rebuild progress, site metrics, contacts, assets, and operational notes.

This is not a CMS. It is not a public-facing app. It is a high-end internal tool — the kind that impresses a PE-backed operator when you open your laptop in a meeting. It should feel like **Linear** or **Vercel's dashboard** designed with the precision of an **Apple** product: fast, dense, confident, and frictionless.

Secondary purpose: When shown to **Cadence Private Capital** (Peter Mark and Jack) or future ETA clients, the quality and clarity of this tool implicitly demonstrates the quality of Lauf's work better than any deck could.

---

## 2. Context: The Players

### Lauf (the studio)

- Owner: Michael Laufersweiler (michael.laufersweiler@lauf.co)
- Site: https://www.lauf.co — Next.js, high-quality modern design
- Specializes in digital rebrands + technical infrastructure for PE-backed acquisitions
- Stack: Next.js, Tailwind, Sanity CMS, Cloudflare, M365, Vercel

### Cadence Private Capital

- PE firm overseeing the Embark portfolio
- Site: https://www.cadenceprivatecapital.com — built by Lauf, Next.js, clean institutional design
- Key contacts: Peter Mark, Jack (decision-makers, budget approvers)

### Embark Pet Services

- Holding company / brand umbrella for a growing network of pet care facilities
- Site: https://www.embarkpetservices.com — built by Lauf, Next.js, blue brand identity
- Tagline: "Caring For Your Pets Like Family" / "We unite local pet care brands under one standard of excellence"
- Brand colors: deep navy (#1a2e4a range), sky blue (#7ec8e3 range), white
- 10 locations total, varying service mixes (daycare, boarding, grooming, training, vet, grooming education)

### The Portfolio — Current State Assessment

**Hound Around Resort** — Cottage Grove, MN

- Status: Migration complete (Bluehost → M365 via GoDaddy/Cloudflare). Full rebuild in progress.
- Stack: Wix (current) → Next.js + Sanity (rebuild, Template 5 "warm editorial")
- Preview: https://hound-3-frontend.vercel.app/ (pending client approval)
- Services: Daycare, Boarding, Grooming
- Infrastructure: Cloudflare DNS, M365 email, GoDaddy reseller
- Notes: Pricing pages, webcam integration, and service calculator built. Webcam decision pending (Zosi/IPCamLive vs. Bravas).

**Wags Stay N' Play** — Moorhead, MN

- Current site: https://www.wagsstaynplay.com — **Wix**. Outdated. Basic template aesthetic, no performance optimization.
- Status: DNS recon complete. Awaiting Wix login + facility contact info from Peter.
- Infrastructure: Wix-hosted site, separate cPanel mail server via subdomain MX, no SPF records
- Services: Daycare, Boarding, Grooming

**Canine Country Club** — West Des Moines, IA

- Current site: https://caninecountryclubwdm.com — recently rebuilt by IMPACT Marketing
- Status: Domain + email migration only (no website rebuild in scope)
- Infrastructure: Two domains — caninecountryclubwdm.com (DNS via Randy Goldstein/Bizmarquee/AWS) and ccc-wdm.com (email-heavy, Homestead nameservers, Google Workspace MX with misconfigured SPF)
- Key contacts: Karissa Schreurs (owner), Sara Krier, Erin Reiner (IMPACT Marketing), Randy Goldstein (Bizmarquee)
- Services: Daycare, Boarding, Grooming, Training

**Rio Grooming School & Salon** — Hastings, MN

- Current site: https://riogrooming.com — needs assessment
- Status: In queue, not yet started
- Services: Grooming, Grooming Education, Self-Service Dog Wash
- Google Rating: 4.7 (222 reviews)

**Barks & Rec Hastings** — Hastings, MN

- Current site: https://www.barksnrec.co — needs assessment
- Status: In queue
- Services: Daycare, Boarding
- Google Rating: 4.9 (56 reviews)

**Boxers Bed & Biscuits** — Belpre, OH

- Current site: https://www.boxersbedandbiscuits.com — **Wix**. Dated template, poor performance.
- Status: In queue, managed by Biztec IT
- Services: Daycare, Boarding, Grooming, Vet Care, Training, Pet Cams
- Google Rating: 4.6 (272 reviews)
- Notes: Has a TV commercial, active social. Most full-service location in portfolio.

**Kingdom Canine** — Pacific, MO

- Current site: https://kingdomcanine.com — GHL (GoHighLevel/LeadConnector). Generic SaaS template.
- Status: In queue
- Services: Boarding, Daycare, Grooming, Transportation
- Google Rating: 4.5 (111 reviews)
- Booking: Gingr portal

**Home Away From Home (HAFH)** — Fargo, ND

- Current site: https://hafhfacility.com — needs assessment
- Status: In queue
- Services: Daycare, Boarding, Grooming, Mobile Grooming
- Google Rating: 4.6 (154 reviews)

**Embark Pet Services (main)** — Corporate site

- Site: https://www.embarkpetservices.com — built by Lauf, Next.js
- Pending: Add Canine Country Club, update location count

**Cadence Private Capital** — PE parent

- Site: https://www.cadenceprivatecapital.com — built by Lauf, Next.js

---

## 3. Design System

### Philosophy

Linear meets Apple. Dense enough to be useful, restrained enough to be elegant. Every pixel is intentional. Micro-animations that communicate state, not decorate it. The UI should feel faster than it is.

Reference products: **Linear** (information density, keyboard-first, status chips), **Vercel dashboard** (monochromatic, developer-confident), **Apple system apps** (micro-interaction quality, transition timing).

### Color System (Light Theme)

Colors are defined as CSS custom properties in `src/styles/globals.css` and consumed via semantic Tailwind classes. Components should use classes like `bg-background`, `text-foreground`, `border-border` -- never hardcoded hex values.

```css
/* Base (Light) */
--background: #ffffff;       /* page background — bg-background */
--card: #ffffff;             /* card/panel backgrounds — bg-card */
--muted: #f4f4f5;           /* hover states, subtle fills — bg-muted */
--border: #e4e4e7;          /* dividers, input borders — border-border */
--ring: #2563eb;            /* focus rings — ring-ring */

/* Typography */
--foreground: #09090b;       /* text-foreground */
--muted-foreground: #71717a; /* text-muted-foreground */

/* Embark Brand Accent (blue family) */
--primary: #2563eb;          /* bg-primary / text-primary */
--accent: #dbeafe;           /* bg-accent (tinted backgrounds) */
--accent-foreground: #1e3a5f;

/* Status Colors (used for pills/chips only) */
--color-status-live: #15803d;       /* green-700 */
--color-status-live-bg: #dcfce7;    /* green-100 */
--color-status-progress: #92400e;   /* amber-800 */
--color-status-progress-bg: #fef3c7;/* amber-100 */
--color-status-blocked: #991b1b;    /* red-800 */
--color-status-blocked-bg: #fee2e2; /* red-100 */
--color-status-queued: #3f3f46;     /* zinc-700 */
--color-status-queued-bg: #f4f4f5;  /* zinc-100 */
--color-status-complete: #1d4ed8;   /* blue-700 */
--color-status-complete-bg: #dbeafe;/* blue-100 */
```

### Typography

```
Display / Headers:   'DM Serif Display' (Google Fonts) — weight 400 italic for hero moments
UI / Body:           'Geist' (Vercel, npm: geist) — weights 400, 500, 600
Monospace / Data:    'Geist Mono' — for URLs, DNS records, IP addresses, code
```

Never use: Inter, Roboto, Arial, system-ui as primary font.

### Spacing & Radius

- Base unit: 4px
- Content padding: 24px
- Card radius: 8px (not rounded-xl, not sharp — precise)
- Pill/chip radius: 9999px (full round)
- Input radius: 6px

### Motion Principles

- Duration: 120ms–200ms for micro (state changes), 250ms–350ms for layout transitions
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast out, natural settle
- Never animate layout shifts or cause reflow
- Use `will-change: transform` for elements that animate frequently
- Page transitions: subtle fade + 4px vertical translate (content slides up into view)
- Sidebar collapse: smooth width transition with icon-only mode
- Status pills: color transitions on state change (not instant swap)
- Row hover: `background` transition only, 120ms
- Loading states: skeleton shimmer, never spinners except for explicit async actions

### Component Patterns

- **Sidebar**: Collapsible, icon-only mode at narrow, full labels at wide. Light bg, subtle active state highlight.
- **Data rows**: Clean table rows with hover highlight. Status pill right-aligned. Click to drill down.
- **Cards**: Subtle border, dark bg, slight elevation on hover. Information hierarchy: label → value, not label: value
- **Status pills**: Compact, colored background + foreground. Text: 11px, uppercase, letter-spaced.
- **Tabs**: Underline style, not box/pill tabs. Active tab: dark text + blue underline.
- **Empty states**: Centered, muted icon + text, action button. Never just blank space.
- **Toasts**: Bottom-right, card bg, subtle border. Auto-dismiss 3s.

---

## 4. Tech Stack

### Core

```
Framework:      Next.js 15 (App Router, TypeScript strict)
Styling:        Tailwind CSS v4
Components:     shadcn/ui (Radix UI primitives, owned code)
State:          Zustand (client state: sidebar, active location, UI prefs)
Tables:         TanStack Table v8
Charts:         Recharts
Icons:          Lucide React
Fonts:          geist (npm package), DM Serif Display (next/font/google)
Animation:      Framer Motion (layout animations, page transitions, micro-interactions)
Forms:          React Hook Form + Zod
```

### Data Layer

```
Database:       SQLite via Prisma (local, no hosting required to start)
Migrations:     Prisma migrate
Seed:           TypeScript seed script with all known Embark data pre-populated
Future path:    Swap Prisma datasource to Supabase/Postgres with zero app code changes
```

### Infrastructure

```
Runtime:        Node.js 20+
Deployment:     Vercel (same infra as all Lauf projects)
Env management: .env.local (never committed)
API routes:     Next.js Route Handlers (app/api/*)
Auth:           Minimal — single-user password via next-auth with credentials provider
                (this is an internal tool, not a SaaS product)
```

### Code Quality

```
TypeScript:     strict mode, no any
Linting:        ESLint + @typescript-eslint + eslint-plugin-react-hooks
Formatting:     Prettier (2 spaces, single quotes, trailing commas)
Git hooks:      husky + lint-staged (lint + typecheck on commit)
Path aliases:   @/* maps to src/*
```

---

## 5. Project Structure

```
embark-os/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Shell: sidebar + topbar
│   │   │   ├── page.tsx            # Portfolio overview (/)
│   │   │   ├── locations/
│   │   │   │   ├── page.tsx        # All locations table
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Location detail
│   │   │   ├── pipeline/
│   │   │   │   └── page.tsx        # Migration + rebuild kanban
│   │   │   ├── metrics/
│   │   │   │   └── page.tsx        # Lighthouse scores, SEO, keywords
│   │   │   ├── contacts/
│   │   │   │   └── page.tsx        # Contact directory
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── locations/
│   │       ├── contacts/
│   │       └── metrics/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components (auto-generated)
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── locations/
│   │   │   ├── LocationCard.tsx
│   │   │   ├── LocationRow.tsx
│   │   │   ├── LocationDetail/
│   │   │   │   ├── InfraTab.tsx
│   │   │   │   ├── SiteTab.tsx
│   │   │   │   ├── ContactsTab.tsx
│   │   │   │   ├── AssetsTab.tsx
│   │   │   │   └── NotesTab.tsx
│   │   │   └── StatusPill.tsx
│   │   ├── pipeline/
│   │   │   ├── KanbanBoard.tsx
│   │   │   └── KanbanCard.tsx
│   │   ├── metrics/
│   │   │   ├── LighthouseScore.tsx
│   │   │   └── ScoreRadar.tsx
│   │   └── shared/
│   │       ├── EmptyState.tsx
│   │       ├── SkeletonRow.tsx
│   │       └── CopyButton.tsx
│   ├── lib/
│   │   ├── db.ts                   # Prisma client singleton
│   │   ├── auth.ts                 # next-auth config
│   │   ├── utils.ts                # cn() and shared utils
│   │   └── constants.ts
│   ├── store/
│   │   ├── ui.store.ts             # Zustand: sidebar state, active tab
│   │   └── location.store.ts
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   └── styles/
│       └── globals.css             # Tailwind base + CSS variables
├── docs/                           # Claude Code generates and maintains these
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── DESIGN_SYSTEM.md
│   ├── TIMELINE.md
│   ├── LOCATIONS.md                # Seed data reference
│   └── DECISIONS.md                # Architectural decisions log
├── .env.local.example
├── SPEC.md                         # This file
└── README.md
```

---

## 6. Data Model (Prisma Schema)

```prisma
model Location {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  address         String?
  city            String
  state           String
  phone           String?
  acquiredAt      DateTime?
  facilityType    String   // "multi-service" | "grooming" | "boarding" | "training"

  // Services offered
  serviceBoarding    Boolean @default(false)
  serviceDaycare     Boolean @default(false)
  serviceGrooming    Boolean @default(false)
  serviceTraining    Boolean @default(false)
  serviceVetCare     Boolean @default(false)
  serviceGroomingEd  Boolean @default(false)
  serviceWebcams     Boolean @default(false)
  serviceMobileGroom Boolean @default(false)
  serviceRetail      Boolean @default(false)

  // Website — current state
  currentUrl         String?
  currentPlatform    String?  // "wix" | "wordpress" | "squarespace" | "ghl" | "webflow" | "nextjs" | "custom" | "none"
  currentTechStack   String?  // freeform, e.g. "Wix, cPanel email"
  lighthousePerf     Int?     // 0-100
  lighthouseA11y     Int?     // 0-100
  lighthouseSEO      Int?     // 0-100
  lighthouseBP       Int?     // 0-100
  lighthouseAudited  DateTime?
  googleRating       Float?
  googleReviewCount  Int?

  // Website — rebuild state
  rebuildStatus      String  @default("not-scoped")
  // "not-scoped" | "scoped" | "in-design" | "in-development" | "in-review" | "live"
  rebuildTemplate    String?  // e.g. "Template 5 - Warm Editorial"
  previewUrl         String?
  targetLaunchDate   DateTime?
  liveUrl            String?

  // Website functional requirements (what the rebuilt site needs)
  needsOnlineBooking     Boolean @default(false)
  needsWebcamFeed        Boolean @default(false)
  needsPricingCalculator Boolean @default(false)
  needsStaffPage         Boolean @default(false)
  needsServicePages      Boolean @default(false)
  needsPhotoGallery      Boolean @default(false)
  needsContactForm       Boolean @default(false)
  needsMapsEmbed         Boolean @default(false)
  needsReviewsWidget     Boolean @default(false)

  // Infrastructure
  domainRegistrar     String?
  dnsProvider         String?
  nameservers         String?   // JSON string of array
  hostingProvider     String?
  emailPlatform       String?   // "m365" | "google-workspace" | "cpanel" | "none"
  mxStatus            String?   // "correct" | "misconfigured" | "missing" | "unknown"
  spfStatus           String?   // "correct" | "misconfigured" | "missing" | "unknown"
  dkimStatus          String?   // "correct" | "missing" | "unknown"
  infraNotes          String?   // freeform
  secondaryDomain     String?   // e.g. ccc-wdm.com
  secondaryDomainNotes String?

  // Migration status
  migrationStatus     String  @default("not-started")
  // "not-started" | "recon" | "stakeholder-outreach" | "access-gathered" | "in-execution" | "complete"
  migrationBlockedBy  String?
  migrationNotes      String?

  // Assets
  hasLogoVector     Boolean @default(false)
  hasLogoRaster     Boolean @default(false)
  hasBrandColors    Boolean @default(false)
  hasPhotography    String  @default("none") // "none" | "partial" | "full"
  assetNotes        String?

  // Relations
  contacts  Contact[]
  notes     Note[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Contact {
  id         String   @id @default(cuid())
  locationId String
  location   Location @relation(fields: [locationId], references: [id], onDelete: Cascade)

  name       String
  email      String?
  phone      String?
  role       String
  // "owner" | "operations" | "it-dns" | "marketing-agency" | "billing" | "facility-manager"
  company    String?  // e.g. "IMPACT Marketing" or "Bizmarquee"
  notes      String?
  isPrimary  Boolean @default(false)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Note {
  id         String   @id @default(cuid())
  locationId String
  location   Location @relation(fields: [locationId], references: [id], onDelete: Cascade)

  body       String
  author     String   @default("Mike")
  isBlocker  Boolean  @default(false)
  isResolved Boolean  @default(false)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## 7. Views & Pages

### 7.1 Portfolio Overview (`/`)

The command center. Grid of all locations with at-a-glance status.

**Layout**:

- Top: summary stats bar — total locations, migrations complete, rebuilds live, rebuilds in progress
- Below: Location cards grid (2-col on 1280px+, 1-col on mobile)

**Location Card contains**:

- Location name (DM Serif Display, large)
- City, State
- Service tags (compact pill list: Boarding, Daycare, Grooming, etc.)
- Migration status pill
- Rebuild status pill
- Current platform badge (Wix, GHL, Next.js, etc.)
- Lighthouse performance score (circular progress, colored by score range)
- Quick link to current URL (external icon, opens new tab)
- Click entire card → Location Detail

**UX notes**: Cards animate in with staggered fade-up on load (Framer Motion). Hover state: border lightens, slight shadow. Active/selected: accent border.

---

### 7.2 Locations Table (`/locations`)

Power-user view. Full TanStack Table with all locations.

**Columns**: Name | City | Platform | Migration Status | Rebuild Status | Perf Score | SEO Score | Last Audited | Actions
**Features**: Column sorting, filter by status, search by name/city, click row to navigate to detail

---

### 7.3 Location Detail (`/locations/[slug]`)

The most important view. Everything about one location.

**Header**: Location name, city/state, service tags, status pills, external site link, edit button

**Tabs** (underline style):

1. **Overview** — Key facts, Google rating, facility type, acquired date, functional requirements checklist
2. **Site** — Current site details, Lighthouse scores (4 circular gauges), rebuild status + preview URL, template assignment
3. **Infrastructure** — DNS provider, registrar, nameservers (monospace), email platform, MX/SPF/DKIM status chips, any secondary domain, infra notes
4. **Migration** — Status pipeline (visual step indicator), blocked-by field, migration notes
5. **Contacts** — Contact cards with role badge, email (click to copy), phone, company, notes
6. **Assets** — Photography status, logo availability, brand colors status, asset notes
7. **Notes** — Chronological activity log, add new note inline, blocker flag toggle, resolve button

**UX notes**: Tabs animate content with crossfade. Sticky header on scroll (location name stays visible). Copy-to-clipboard on DNS values and emails with toast confirmation.

---

### 7.4 Pipeline (`/pipeline`)

Kanban view across all locations for both migration and rebuild workflows.

**Two kanban boards** (tabbed):

1. **Migration Pipeline**: columns = Not Started → Recon → Stakeholder Outreach → Access Gathered → In Execution → Complete
2. **Rebuild Pipeline**: columns = Not Scoped → Scoped → In Design → In Development → In Review → Live

**Cards** show: location name, city, platform, key blocker if any
**Drag to reorder** within columns (dnd-kit)
**Quick-edit** status from the card without navigating away

---

### 7.5 Metrics (`/metrics`)

SEO and performance intelligence across the portfolio.

**Layout**:

- Top: sortable table of all locations with Lighthouse scores (Perf, A11y, SEO, BP) — color-coded cells (red < 50, yellow 50-89, green 90+)
- Below: bar chart comparing scores across locations (Recharts)
- Per-location expandable row: keywords in use, suggested improvements, platform notes
- "Last audited" timestamp per location + manual "Mark as audited" button

**Notes**: Scores are manually entered (not auto-fetched). This is an intelligence layer, not a live monitoring tool. Scores can be updated from the Location Detail → Site tab as well. Future enhancement: integrate PageSpeed Insights API.

---

### 7.6 Contacts (`/contacts`)

Full directory of all contacts across all locations.

**TanStack Table**: Name | Role | Company | Location | Email | Phone
Searchable, filterable by role and location.
Click to expand inline contact detail.

---

## 8. Key UX Patterns

### Sidebar Navigation

```
[Lauf logo mark]          ← small, tasteful, links to lauf.co
─────────────────
Overview
Locations
Pipeline
Metrics
Contacts
─────────────────
Settings
```

- Collapsible to icon-only (Zustand state, persisted to localStorage)
- Active route: left-border accent + bg highlight
- Keyboard shortcut hints visible on hover (e.g. `G then O` for Overview, similar to Linear)

### Global Search

- `Cmd+K` opens command palette (cmdk library)
- Search locations by name, city, contact name, domain
- Jump to any location detail instantly
- Quick actions: "Add note to...", "Update migration status..."

### Inline Editing

- Every field in location detail is inline-editable (click to edit pattern)
- Edit mode: input appears, pencil icon becomes checkmark/x
- Auto-save on blur with optimistic UI update
- No separate "edit mode" page — editing happens where you read

### Status Updates

- Status pills are clickable → dropdown to select new status
- Optimistic update with revert on error
- Toast confirmation on save

---

## 9. Security Considerations

This tool contains sensitive infrastructure credentials context and client contact information.

- **Auth**: next-auth with credentials provider. Single user. Strong password in env. No user registration.
- **Route protection**: Middleware that redirects all non-auth routes to `/login` if no valid session.
- **API routes**: All protected — check session server-side before returning data.
- **Env vars**: Database URL, auth secret, session secret — never committed, never exposed to client.
- **No sensitive secrets stored in DB**: Passwords, API keys, SMTP credentials should never go in the Notes or any text field. Store those in 1Password / a secrets manager. This tool tracks _what_ infrastructure exists and _who controls it_, not the credentials themselves.
- **HTTPS only**: Enforced by Vercel. Strict headers via next.config.ts.
- **Data**: SQLite file is local. If deployed to Vercel, migrate to Supabase/Postgres + enable row-level security.
- **Input sanitization**: All user input validated with Zod schemas on both client and server.

---

## 10. Seed Data

The Prisma seed file (`prisma/seed.ts`) must pre-populate all 8+ locations with known data:

| Location                    | Slug                    | Platform        | Migration            | Rebuild        |
| --------------------------- | ----------------------- | --------------- | -------------------- | -------------- |
| Hound Around Resort         | hound-around            | wix→nextjs      | complete             | in-development |
| Wags Stay N' Play           | wags-stay-n-play        | wix             | access-gathered      | not-scoped     |
| Canine Country Club         | canine-country-club     | custom (IMPACT) | stakeholder-outreach | not-scoped     |
| Rio Grooming School & Salon | rio-grooming            | unknown         | not-started          | not-scoped     |
| Barks & Rec Hastings        | barks-and-rec           | unknown         | not-started          | not-scoped     |
| Boxers Bed & Biscuits       | boxers-bed-biscuits     | wix             | not-started          | not-scoped     |
| Kingdom Canine              | kingdom-canine          | ghl             | not-started          | not-scoped     |
| Home Away From Home         | home-away-from-home     | unknown         | not-started          | not-scoped     |
| Embark Pet Services (main)  | embark-pet-services     | nextjs          | complete             | live           |
| Cadence Private Capital     | cadence-private-capital | nextjs          | complete             | live           |

All known contact data from project history should be seeded (see LOCATIONS.md doc for full detail).

---

## 11. MD Documentation Files to Generate

Claude Code must create and maintain the following files in the `/docs` directory. Generate these FIRST before any implementation code.

### `/docs/ARCHITECTURE.md`

- System architecture diagram (ASCII or Mermaid)
- Request lifecycle: Client → Next.js Route → Prisma → SQLite
- Auth flow
- Component hierarchy overview
- State management approach

### `/docs/DATA_MODEL.md`

- Full Prisma schema with field explanations
- Enum definitions and valid values for all status fields
- Relationships diagram
- Seed data approach

### `/docs/DESIGN_SYSTEM.md`

- Color tokens with usage rules
- Typography scale
- Spacing system
- Component inventory (what exists, what to build)
- Animation guidelines with exact timing values
- Do / Don't examples for each pattern

### `/docs/TIMELINE.md`

Phase-based build plan:

- **Phase 1** (Foundation): Auth, layout shell, sidebar, Prisma setup, seed data, Portfolio overview
- **Phase 2** (Core): Location detail all tabs, Locations table, inline editing
- **Phase 3** (Pipeline): Kanban boards, drag-and-drop, status updates
- **Phase 4** (Metrics): Lighthouse score UI, charts, keyword fields
- **Phase 5** (Polish): Cmd+K search, animations, keyboard shortcuts, mobile responsiveness, settings

### `/docs/LOCATIONS.md`

- Full reference for every location's known data
- Infrastructure details (DNS, email, hosting)
- Contact directory
- Outstanding blockers per location
- Source of truth for seed data

### `/docs/DECISIONS.md`

- Why SQLite over Supabase to start (speed, no hosting, easy future migration)
- Why shadcn/ui over a full component library (code ownership, Radix primitives, accessible by default)
- Why Zustand over Context (minimal boilerplate, no provider hell)
- Why TanStack Table over simple HTML tables (sorting, filtering, virtualization readiness)
- Why Framer Motion over pure CSS (layout animations require JS, complex orchestration)
- Why single-user auth vs. no auth (sensitive client data warrants protection even for personal tools)

---

## 12. Research Directive for Claude Code

Before building, Claude Code should:

1. **Fetch and analyze current sites** to establish baseline scores and platform observations:
   - https://www.wagsstaynplay.com (Wix)
   - https://www.boxersbedandbiscuits.com (Wix)
   - https://kingdomcanine.com (GHL/LeadConnector)
   - https://caninecountryclubwdm.com
   - https://riogrooming.com
   - https://www.barksnrec.co
   - https://hafhfacility.com

2. **Compare against Lauf's rebuilt sites**:
   - https://www.embarkpetservices.com (Lauf, Next.js)
   - https://www.cadenceprivatecapital.com (Lauf, Next.js)
   - https://hound-3-frontend.vercel.app (Lauf, in progress)

3. **Document findings in `/docs/LOCATIONS.md`** with platform identification, estimated quality tier, and rebuild priority notes.

4. **Use web search** to look up current Lighthouse/PageSpeed best practices for pet care service businesses and note common SEO patterns in this industry.

---

## 13. Getting Started (Claude Code Instructions)

```bash
# 1. This is being built on top of an existing Next.js 15 project
# Check existing structure first before scaffolding anything new
ls -la
cat package.json

# 2. Generate all /docs/*.md files first — no app code until docs exist

# 3. Install required dependencies
npm install prisma @prisma/client
npm install @tanstack/react-table
npm install zustand
npm install framer-motion
npm install next-auth@beta
npm install react-hook-form zod @hookform/resolvers
npm install recharts
npm install cmdk
npm install geist
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npx shadcn@latest init

# 4. Initialize Prisma
npx prisma init --datasource-provider sqlite

# 5. Create schema, run migration, seed data
npx prisma migrate dev --name init
npx prisma db seed

# 6. Build in phase order per TIMELINE.md
```

---

## 14. Quality Bar

This tool will be shown to PE operators and used as evidence of Lauf's capability. The code and UI must reflect that.

- **No placeholder lorem ipsum** — use real location names and real data from seed
- **No default shadcn gray theme** — implement the full light design system from section 3
- **No skipped loading states** — every async operation has a skeleton or optimistic update
- **No console errors or warnings** in production build
- **TypeScript strict** — no `any`, no `@ts-ignore`
- **Accessible** — keyboard navigable, proper ARIA labels, focus management
- **Mobile-aware** — sidebar collapses, tables scroll horizontally, cards stack vertically

---

_Spec version 1.0 — Lauf Studio × Embark Pet Services OS_
_Prepared by Claude (Anthropic) for Claude Code implementation_
