# Embark OS — Complete Project Knowledge

> Internal operations dashboard for Lauf Studio managing 10 Embark Pet Services franchise locations. Built as a single-user tool for tracking website migrations, rebuilds, audits, SEO health, competitor intelligence, and contact management across the portfolio.

---

## 1. Project Overview

| Key | Value |
|-----|-------|
| Name | Embark OS |
| Purpose | Internal ops dashboard for managing 10 pet care franchise locations |
| Operator | Lauf Studio (single user: Mike Laufersweiler) |
| Framework | Next.js 16.1.6 (App Router, `src/` directory) |
| Theme | Light — "Sandstone & Teal" color scheme |
| Auth | NextAuth v5 beta, credentials provider (single admin user) |
| Database | SQLite via Prisma 6 |
| Deployment | Local development (localhost:3000) |

---

## 2. Tech Stack & Dependencies

### Runtime Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | React framework |
| react / react-dom | 19.2.3 | UI library |
| @prisma/client | ^6.19.2 | Database ORM |
| next-auth | ^5.0.0-beta.30 | Authentication |
| zustand | ^5.0.11 | Client state management |
| @tanstack/react-table | ^8.21.3 | Data tables with sorting/filtering |
| framer-motion | ^12.35.0 | Animations |
| recharts | ^3.7.0 | Charts and visualizations |
| @react-pdf/renderer | ^4.3.2 | PDF report generation |
| @dnd-kit/core | ^6.3.1 | Drag and drop (Kanban) |
| @dnd-kit/sortable | ^10.0.0 | Sortable drag and drop |
| cheerio | ^1.2.0 | HTML parsing for SEO crawler |
| radix-ui | ^1.4.3 | Headless UI primitives |
| class-variance-authority | ^0.7.1 | Component variant system |
| clsx | ^2.1.1 | Conditional classnames |
| tailwind-merge | ^3.5.0 | Tailwind class merging |
| cmdk | ^1.1.1 | Command palette |
| lucide-react | ^0.577.0 | Icons |
| geist | ^1.7.0 | Geist Sans + Geist Mono fonts |
| sonner | ^2.0.7 | Toast notifications |
| react-hook-form | ^7.71.2 | Form management |
| @hookform/resolvers | ^5.2.2 | Form validation resolvers |
| zod | ^4.3.6 | Schema validation |
| next-themes | ^0.4.6 | Theme management |
| dotenv | ^17.3.1 | Env var loading (seed script) |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^4 | Utility CSS (v4, CSS-first config) |
| @tailwindcss/postcss | ^4 | PostCSS plugin for Tailwind v4 |
| tw-animate-css | ^1.4.0 | Animation utilities |
| shadcn | ^3.8.5 | Component generator CLI |
| typescript | ^5 | Type checking |
| tsx | ^4.21.0 | TypeScript execution (seed scripts) |
| eslint / eslint-config-next | ^9 / 16.1.6 | Linting |

---

## 3. Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite file path (`file:./dev.db`) |
| `NEXTAUTH_SECRET` | NextAuth JWT secret |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000`) |
| `AUTH_SECRET` | NextAuth v5 secret (same as NEXTAUTH_SECRET) |
| `ADMIN_EMAIL` | Single admin login email |
| `ADMIN_PASSWORD` | Single admin login password |
| `PAGESPEED_API_KEY` | Google PageSpeed Insights API key |
| `ANTHROPIC_API_KEY` | Claude API key (AI visibility checks) |
| `OPENAI_API_KEY` | OpenAI API key (AI visibility checks) |
| `GOOGLE_AI_API_KEY` | Google Gemini API key (AI visibility checks) |

---

## 4. Directory Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, global CSS)
│   ├── (auth)/
│   │   └── login/page.tsx            # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard shell (sidebar, command palette, toaster)
│   │   ├── page.tsx                  # Portfolio overview (/)
│   │   ├── locations/
│   │   │   ├── page.tsx              # Locations table
│   │   │   └── [slug]/page.tsx       # Location detail (8 tabs)
│   │   ├── pipeline/page.tsx         # Kanban boards
│   │   ├── metrics/page.tsx          # Lighthouse + reputation
│   │   ├── audit/
│   │   │   ├── page.tsx              # Audit dashboard
│   │   │   └── [locationId]/page.tsx # Audit detail
│   │   ├── seo/
│   │   │   ├── page.tsx              # SEO dashboard
│   │   │   └── [locationId]/page.tsx # SEO detail
│   │   ├── competitors/
│   │   │   ├── page.tsx              # Competitor intel dashboard
│   │   │   └── [locationId]/page.tsx # Market detail
│   │   ├── contacts/page.tsx         # Contact directory
│   │   └── settings/page.tsx         # App settings
│   └── api/                          # 21 API route files (see Section 11)
├── components/
│   ├── ui/                           # 14 shadcn/ui primitives
│   ├── shared/                       # 9 reusable components
│   ├── layout/                       # Sidebar, Topbar
│   ├── overview/                     # StatsGrid, PortfolioGroupedView, etc.
│   ├── locations/                    # LocationCard, LocationsTable, LocationDetail + tabs
│   ├── pipeline/                     # PipelineView, KanbanBoard, KanbanCard
│   ├── metrics/                      # MetricsView, ReputationSection, LighthouseScore
│   ├── contacts/                     # ContactsTable
│   ├── services/                     # ServiceMatrix
│   ├── audit/                        # AuditDashboard, AuditDetailView, GradePill, etc.
│   ├── seo/                          # SeoDashboard, SeoDetailView, SeoCheckList, etc.
│   ├── competitor-intel/             # CompetitorIntelDashboard, MarketDetailView, etc.
│   └── competitors/                  # CompetitorCard, CompetitorForm, etc.
├── hooks/
│   └── useLocationUpdate.ts          # PATCH hook for inline editing
├── lib/
│   ├── auth.ts                       # NextAuth config
│   ├── db.ts                         # Prisma singleton
│   ├── constants.ts                  # Enums, labels, status values
│   ├── groupLocations.ts             # Tier derivation + GROUP_META colors
│   ├── grading.ts                    # Letter grade computation
│   ├── pagespeed.ts                  # Google PageSpeed API
│   ├── seo-crawl.ts                  # cheerio-based SEO crawler
│   ├── seo-recommendations.ts        # SEO recommendation engine
│   ├── competitor-audit.ts           # Competitor audit orchestrator
│   ├── google-places.ts              # Google Places API
│   ├── market-position.ts            # Market position scoring
│   ├── ai-visibility.ts              # AI brand visibility (OpenAI/Claude/Gemini)
│   ├── pdf/generatePortfolioReport.tsx # PDF report component
│   └── utils.ts                      # cn() helper
├── store/
│   └── ui.store.ts                   # Zustand UI state
├── styles/
│   └── globals.css                   # Theme tokens, Tailwind imports
├── types/
│   └── index.ts                      # TypeScript types
└── middleware.ts                     # Auth middleware
```

---

## 5. Prisma Data Model

### Location (central entity)
```
id             String    @id @default(cuid())
slug           String    @unique
name           String
address        String?
city           String
state          String
phone          String?
acquiredAt     DateTime?
facilityType   String              # "multi-service" | "grooming" | "boarding" | "training"

# Services (9 booleans)
serviceBoarding, serviceDaycare, serviceGrooming, serviceTraining,
serviceVetCare, serviceGroomingEd, serviceWebcams, serviceMobileGroom, serviceRetail

# Website - current state
currentUrl, currentPlatform, currentTechStack   String?
lighthousePerf, lighthouseA11y, lighthouseSEO, lighthouseBP   Int?
lighthouseMobilePerf, lighthouseMobileA11y, lighthouseMobileSEO, lighthouseMobileBP   Int?
lighthouseAudited   DateTime?
googleRating   Float?
googleReviewCount   Int?

# Website - rebuild state
rebuildStatus    String @default("not-scoped")   # "not-scoped" → "scoped" → "in-design" → "in-development" → "in-review" → "live"
rebuildTemplate  String?
previewUrl       String?
targetLaunchDate DateTime?
liveUrl          String?

# Website functional requirements (9 booleans)
needsOnlineBooking, needsWebcamFeed, needsPricingCalculator, needsStaffPage,
needsServicePages, needsPhotoGallery, needsContactForm, needsMapsEmbed, needsReviewsWidget

# Infrastructure
domainRegistrar, dnsProvider, nameservers, hostingProvider   String?
emailPlatform, mxStatus, spfStatus, dkimStatus   String?
infraNotes, secondaryDomain, secondaryDomainNotes   String?

# Migration
migrationStatus    String @default("not-started")   # "not-started" → "recon" → "stakeholder-outreach" → "access-gathered" → "in-execution" → "complete"
migrationBlockedBy String?
migrationNotes     String?

# Engagement
engagementTier String?   # Manual override; null = auto-derive from statuses

# Assets
hasLogoVector, hasLogoRaster, hasBrandColors   Boolean
hasPhotography   String @default("none")
assetNotes       String?

# Relations
contacts[], notes[], competitors[], ratingSnapshots[], auditSnapshots[], seoSnapshots[], aiVisibilityChecks[]

createdAt, updatedAt   DateTime
```

### AuditSnapshot
```
id, locationId, strategy ("desktop"|"mobile"), url
scorePerf, scoreA11y, scoreSEO, scoreBP   Int
overallScore   Float
letterGrade   String   # "A+" through "F"
auditDetails   String   # Full PSI JSON response
createdAt   DateTime
@@index([locationId, strategy, createdAt])
```

### SeoSnapshot
```
id, locationId, url
overallScore   Int (0-100)
letterGrade   String
responseTimeMs   Int
checkResults   String   # JSON: SeoCheckResult[]
createdAt   DateTime
@@index([locationId, createdAt])
```

### RatingSnapshot
```
id, locationId
googleRating   Float
googleReviewCount   Int
recordedAt   DateTime
@@index([locationId, recordedAt])
```

### Competitor
```
id, locationId, name, url?, googleRating?, googleReviewCount?, notes?, placeId?
seoScore?, seoGrade?
9 service booleans (mirror Location)
Lighthouse scores (desktop + mobile: Perf, A11y, SEO, BP)
lighthouseAudited   DateTime?
Relations: snapshots[], ratingSnapshots[]
```

### CompetitorSnapshot
```
id, competitorId, strategy, url
scorePerf, scoreA11y, scoreSEO, scoreBP, overallScore, letterGrade
auditDetails, seoScore?, seoGrade?, seoChecks?, responseTimeMs?
createdAt   DateTime
@@index([competitorId, strategy, createdAt])
```

### CompetitorRatingSnapshot
```
id, competitorId, googleRating, googleReviewCount, recordedAt
@@index([competitorId, recordedAt])
```

### AIVisibilityCheck
```
id, locationId, prompt, promptSlug, model
response   String
mentionsEmbark   Boolean
embarkPosition   Int?
mentionedNames   String   # JSON: string[]
competitorsMentioned   String   # JSON: { name, position }[]
createdAt   DateTime
@@index([locationId, promptSlug, createdAt])
```

### Contact
```
id, locationId, name, email?, phone?, role, company?, notes?
isPrimary   Boolean
createdAt, updatedAt
```

### Note
```
id, locationId, body, author ("Mike"), isBlocker, isResolved
createdAt, updatedAt
```

---

## 6. TypeScript Types

```typescript
// Re-exported from @prisma/client
export type { Location, Contact, Note, Competitor, RatingSnapshot,
  AuditSnapshot, SeoSnapshot, CompetitorSnapshot,
  CompetitorRatingSnapshot, AIVisibilityCheck };

// Composite types
export type LocationWithRelations = Location & {
  contacts: Contact[];
  notes: Note[];
  competitors: Competitor[];
  ratingSnapshots: RatingSnapshot[];
  auditSnapshots: AuditSnapshot[];
  seoSnapshots: SeoSnapshot[];
};

export type CompetitorWithSnapshots = Competitor & {
  snapshots: CompetitorSnapshot[];
  ratingSnapshots: CompetitorRatingSnapshot[];
};

// SEO types
export interface SeoCheckResult {
  id: string;
  name: string;
  category: "meta" | "content" | "technical" | "structured-data";
  weight: number;
  status: "pass" | "warn" | "fail";
  score: number;  // 1, 0.5, or 0
  message: string;
  details?: string;
}

export interface SeoRecommendation {
  checkId: string;
  priority: "critical" | "important" | "minor";
  title: string;
  impact: string;
  explanation: string;
  suggestion: string;
  codeSnippet?: string;
  currentValue?: string;
}

// Service keys
export type ServiceKey =
  | "serviceBoarding" | "serviceDaycare" | "serviceGrooming"
  | "serviceTraining" | "serviceVetCare" | "serviceGroomingEd"
  | "serviceWebcams" | "serviceMobileGroom" | "serviceRetail";

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  serviceBoarding: "Boarding",
  serviceDaycare: "Daycare",
  serviceGrooming: "Grooming",
  serviceTraining: "Training",
  serviceVetCare: "Vet Care",
  serviceGroomingEd: "Grooming Ed",
  serviceWebcams: "Webcams",
  serviceMobileGroom: "Mobile Grooming",
  serviceRetail: "Retail",
};
```

---

## 7. Constants & Enums

All defined in `src/lib/constants.ts`:

```typescript
// Pipeline statuses (ordered by progression)
MIGRATION_STATUSES = ["not-started", "recon", "stakeholder-outreach", "access-gathered", "in-execution", "complete"]
REBUILD_STATUSES = ["not-scoped", "scoped", "in-design", "in-development", "in-review", "live"]

// Website platforms
PLATFORMS = ["wix", "wordpress", "squarespace", "ghl", "webflow", "nextjs", "custom", "unknown", "none"]

// Email platforms
EMAIL_PLATFORMS = ["m365", "google-workspace", "cpanel", "none"]

// DNS statuses
DNS_STATUSES = ["correct", "misconfigured", "missing", "unknown"]

// Contact roles
CONTACT_ROLES = ["owner", "operations", "it-dns", "marketing-agency", "billing", "facility-manager"]

// Facility types
FACILITY_TYPES = ["multi-service", "grooming", "boarding", "training"]

// Engagement tiers
ENGAGEMENT_TIERS = ["lauf-built", "in-development", "onboarding", "not-engaged"]
```

Each has a corresponding `*_LABELS` record mapping slugs to display names.

---

## 8. Design System

### Typography
| Token | Font | Usage |
|-------|------|-------|
| `font-display` / `--font-dm-serif` | DM Serif | Headings, location names, card titles |
| `font-sans` / `--font-geist-sans` | Geist Sans | Body text (default) |
| `font-mono` / `--font-geist-mono` | Geist Mono | Labels, metadata, section headers, kbd elements |

**Topbar pattern**: DM Serif `h1` title + Geist Mono `text-[10px] uppercase tracking-wider` description.

**Editorial label pattern**: `font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-widest text-muted-foreground`

**Table header pattern**: Geist Mono `text-[11px] uppercase tracking-wider`

**Stat card label pattern**: Geist Mono `text-[10px] uppercase tracking-widest`

### Theme Colors (Sandstone & Teal)
```css
--background: #FBF9F6    /* warm off-white */
--foreground: #1C1917    /* near-black */
--card: #FFFFFF
--primary: #2D7A6B       /* teal */
--primary-foreground: #FFFFFF
--secondary: #F4F1EC     /* light sandstone */
--muted: #F4F1EC
--muted-foreground: #78716C
--accent: #E6F0ED        /* light teal */
--accent-foreground: #1A4D42
--destructive: #C45C4A   /* warm red */
--success: #4A9A6E       /* green */
--warning: #CB8A40       /* amber */
--border: #E5DFD7        /* sandstone */
--ring: #2D7A6B          /* teal */
--sidebar: #F4F1EC
```

### Status Colors (CSS custom properties)
```css
--color-status-live: #2D6A4F       / --color-status-live-bg: #E6F3EC
--color-status-progress: #8B6914   / --color-status-progress-bg: #FDF3E0
--color-status-blocked: #943B2E    / --color-status-blocked-bg: #FBEAE7
--color-status-queued: #57534E     / --color-status-queued-bg: #F4F1EC
--color-status-complete: #1A5C4F   / --color-status-complete-bg: #E6F0ED
```

### Chart Colors
```css
--chart-1: #2D7A6B   /* teal */
--chart-2: #4A9A6E   /* green */
--chart-3: #CB8A40   /* amber */
--chart-4: #C45C4A   /* red */
--chart-5: #78716C   /* stone */
```

### Grade Colors (from `grading.ts`)
| Grade | Text Color | Background |
|-------|-----------|------------|
| A/A+/A- | `#4A9A6E` | `rgba(74,154,110,0.1)` |
| B/B+/B- | `#2D7A6B` | `rgba(45,122,107,0.1)` |
| C/C+/C- | `#CB8A40` | `rgba(203,138,64,0.1)` |
| D/F | `#C45C4A` | `rgba(196,92,74,0.1)` |

### SectionDivider Component
Reusable numbered editorial divider (`src/components/shared/SectionDivider.tsx`).

Props: `number?`, `title`, `count?`, `dotColor?`, `children?`

- With `number`: renders `01 // TITLE ————————` with optional count + colored dot
- Without `number`: renders `TITLE ————————` (for single-section pages)
- Used across: PortfolioGroupedView, MetricsView, AuditDashboard, SeoDashboard, CompetitorIntelDashboard, MarketDetailView, Contacts, Settings

### Responsive Patterns
- Sidebar: hidden on `<md` (768px), slide-out Zustand-controlled drawer on mobile
- Topbar: hamburger button on mobile (`md:hidden`), `px-4 sm:px-6`
- All page containers: `p-4 sm:p-6`
- Tables: `overflow-x-auto` + `min-w-[700px]`
- Kanban: `overflow-x-auto` + fixed `w-64` columns

---

## 9. Engagement Tier System

### Tier Definitions & Colors (from `GROUP_META` in `src/lib/groupLocations.ts`)
| Tier | Label | Accent Hex | Usage |
|------|-------|-----------|-------|
| `lauf-built` | Lauf Built | `#4A9A6E` (green) | Sites built by Lauf, live |
| `in-development` | In Development | `#3B82F6` (blue) | Active rebuild in progress |
| `onboarding` | Onboarding | `#CB8A40` (amber) | Migration started or rebuild scoped |
| `not-engaged` | Not Engaged | `#E5DFD7` (gray) | No activity yet |

### Auto-Derivation Logic (`getLocationGroup()`)
```
1. If location.engagementTier is set → use it (manual override)
2. If rebuildStatus === "live" → "lauf-built"
3. If rebuildStatus in ["in-design", "in-development", "in-review"] → "in-development"
4. If migrationStatus !== "not-started" OR rebuildStatus !== "not-scoped" → "onboarding"
5. Otherwise → "not-engaged"
```

### Visual Indicators
- **Table rows**: 3px `borderLeft` via inline `style={{ borderLeft: '3px solid ${tierMeta.accent}' }}`
- **Location cards**: Top accent bar using `GROUP_META.accent`
- **Detail pages**: 3px `borderTop` on content area
- **Kanban cards**: `borderTop` accent
- **Not-engaged items**: `opacity-60` on rows and cards
- **StatsGrid**: Uses `GROUP_META` for all tier color references

**Important**: Always import tier colors from `GROUP_META` — never hardcode tier hex values in components. The same hex values (`#4A9A6E`, `#CB8A40`) also appear as semantic success/warning colors in grading and charts — those are NOT tier colors and are fine hardcoded.

---

## 10. Routes (Pages)

### `/` — Portfolio Overview
- **Data**: All locations with competitors and SEO snapshots
- **Computed**: Tier counts, avg Google rating, avg Lighthouse score, avg SEO score, market edge stats
- **Layout**: Mobile — stats above cards. Desktop — cards (left) + sticky stats sidebar (right)
- **Components**: Topbar, PortfolioOverview (view toggle + filter), StatsGrid (bento grid), ExportButton
- **Views**: Grouped (cards by tier with SectionDividers) or List (sortable table)

### `/locations` — Locations Table
- **Data**: All locations ordered by name
- **Components**: Topbar, LocationsTable (TanStack Table with tier left-borders, DM Serif names)

### `/locations/[slug]` — Location Detail
- **Data**: Location with all relations (contacts, notes, competitors, all snapshots)
- **Components**: Topbar (with tier accent indicator), LocationDetail (8 tabs)
- **Tabs**: Overview, Site, Infrastructure, Migration, Contacts, Notes, Assets, Competitors
- **Features**: Inline editing on all tabs except Contacts/Notes, 3px tier-colored borderTop

### `/pipeline` — Pipeline Kanban
- **Data**: All locations
- **Components**: PipelineView with tab toggle (Migration/Rebuild), KanbanBoard, KanbanCard
- **Features**: dnd-kit drag-and-drop, tier accent on cards, blocker indicators

### `/metrics` — Lighthouse & Reputation
- **Data**: Locations + rating snapshots
- **Components**: MetricsView (3 sections: Lighthouse scores table, Performance vs Quality scatter, Score breakdown), ReputationSection (ratings table + trend chart)
- **Sections**: 01 Lighthouse Scores, 02 Performance vs Quality, 03 Score Breakdown, 04 Reputation

### `/audit` — Audit Dashboard
- **Data**: Locations + latest audit snapshots (distinct by locationId + strategy)
- **Components**: AuditDashboard (3 sections: Portfolio grades, Location grades table, Comparison chart)
- **Features**: Run audit button, bulk run all, links to detail pages

### `/audit/[locationId]` — Audit Detail
- **Data**: Location + all audit snapshots
- **Components**: AuditDetailView (4 tabs: Scores/History, Opportunities, Diagnostics, All Audits)
- **Features**: Tier accent borderTop, score trend charts, audit item lists

### `/seo` — SEO Dashboard
- **Data**: Locations + latest SEO snapshots (distinct by locationId)
- **Components**: SeoDashboard (3 sections: Portfolio SEO health, Location scores, Comparison chart)
- **Features**: Run crawl button, bulk run all

### `/seo/[locationId]` — SEO Detail
- **Data**: Location + all SEO snapshots
- **Components**: SeoDetailView (4 tabs: All Checks, Issues Only, Recommendations, History)
- **Features**: Tier accent borderTop, categorized check lists, code snippet recommendations

### `/competitors` — Competitor Intel Dashboard
- **Data**: Locations with competitors (including rating snapshots), AI visibility checks
- **Computed**: Market positions via `computeMarketPosition()` for all locations
- **Components**: CompetitorIntelDashboard (5 sections: Market Overview, Market-by-Market, Reputation Race, Web Perf Gap, AI Visibility)

### `/competitors/[locationId]` — Market Detail
- **Data**: Location with competitors (including snapshots + rating snapshots), AI visibility checks
- **Components**: MarketDetailView (7 sections: Market Position, Competitors, Comparison, Rankings, Rating Trends, Service Coverage, AI Visibility)
- **Features**: Tier accent borderTop, back link to location detail

### `/contacts` — Contact Directory
- **Data**: All contacts with location names/slugs
- **Components**: ContactsTable (TanStack Table with location links, copy buttons, add form)

### `/settings` — Settings
- **Components**: Static client component with 3 cards (App info, Keyboard Shortcuts, Data info)

### `/login` — Authentication
- **Components**: Email/password form, credentials provider login
- **Flow**: On success → redirect to `/` with router.refresh()

---

## 11. API Routes

### Authentication
| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |

### Locations
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/locations` | GET | Yes | List all locations (slug, name, city, state) |
| `/api/locations/[id]` | GET | Yes | Get location by ID with contacts + notes |
| `/api/locations/[id]` | PATCH | Yes | Update location fields |

### Contacts
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/contacts` | POST | Yes | Create contact (requires locationId, name, role) |
| `/api/contacts/[id]` | PATCH, DELETE | Yes | Update or delete contact |

### Notes
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/notes` | POST | Yes | Create note (locationId, body; author defaults to "Mike") |
| `/api/notes/[id]` | PATCH, DELETE | Yes | Update or delete note |

### Audits (Lighthouse/PageSpeed)
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/audits` | GET | Yes | List audits (filter by locationId, strategy; `latest` option) |
| `/api/audits` | POST | Yes | Run PageSpeed audit (maxDuration: 120s) |
| `/api/audits/[id]` | GET | Yes | Get single audit with parsed auditDetails |

### SEO
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/seo` | GET | Yes | List SEO snapshots (filter by locationId; `latest` option) |
| `/api/seo` | POST | Yes | Run SEO crawl via cheerio (maxDuration: 120s) |

### Rating Snapshots
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/rating-snapshots` | POST | No | Create rating snapshot |
| `/api/locations/[id]/rating-snapshots` | GET | Yes | Get rating history for location |

### Competitors
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/competitors` | POST | No | Create competitor (requires locationId, name) |
| `/api/competitors/[id]` | GET, PATCH, DELETE | Yes | CRUD on competitor |
| `/api/competitors/[id]/audit` | POST | Yes | Run competitor audit (PageSpeed + SEO crawl, maxDuration: 120s) |
| `/api/competitors/[id]/snapshots` | GET | Yes | Get competitor audit snapshots |
| `/api/competitors/[id]/ratings` | GET, POST | Yes | Get/scan competitor ratings via Google Places |

### Competitor Intelligence
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/competitor-intel/ratings/scan` | POST | Yes | Bulk scan all competitors with placeId (maxDuration: 120s) |
| `/api/competitor-intel/market-position` | GET | Yes | Compute market positions for all locations |
| `/api/competitor-intel/ai-visibility` | GET, POST | Yes | Get/run AI visibility checks (OpenAI, Claude, Gemini; maxDuration: 300s, 24hr cooldown) |

### Reports
| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/reports/portfolio-pdf` | GET | Yes | Generate portfolio PDF report |

---

## 12. Components

### Layout (2)
- **Sidebar** — Collapsible nav with route links, collapse toggle, mobile drawer (Zustand-controlled)
- **Topbar** — DM Serif title, Geist Mono description, mobile hamburger, logout button, optional children (accent indicators, action buttons)

### Shared (9)
- **SectionDivider** — Numbered editorial section header (see Section 8)
- **InlineEditField** — Click-to-edit text/textarea with save/cancel, pencil icon on hover
- **InlineSelectField** — Click-to-dropdown for enum fields
- **InlineToggleField** — Toggle switch for boolean fields
- **KeyboardShortcuts** — `G + key` navigation shortcuts (8 shortcuts)
- **CommandPalette** — `CMD+K` location search using cmdk
- **StaggeredGrid** — Framer Motion staggered grid animation wrapper
- **PageTransition** — Page entry animation wrapper
- **CopyButton** — Copy-to-clipboard with feedback toast

### UI (14 shadcn/ui primitives)
Button, Input, Label, Tabs, Dialog, DropdownMenu, Select, Badge, Tooltip, Separator, Card, Table, Skeleton, Sonner

### Overview (8)
- **PortfolioOverview** — View toggle container, passes data to grouped or list view
- **OverviewToolbar** — Cards/List pill toggle + filters (tier, status, platform, engagement)
- **StatsGrid** — Asymmetric bento grid: hero cell (01 Portfolio) + Web Perf + Reputation + SEO Health + Market Edge. Uses `GROUP_META` for tier colors.
- **PortfolioGroupedView** — Cards grouped by engagement tier with SectionDividers
- **PortfolioListView** — Sortable list with tier left-border, compact pipeline tracks
- **PipelineTrack** — 6-segment progress bar (full + compact variants) for migration/rebuild pipelines
- **ReputationCard** — Google rating with star + review count
- **ExportButton** — Triggers `/api/reports/portfolio-pdf` download

### Locations (13)
- **LocationCard** — Grid card: tier accent top bar, DM Serif name, Geist Mono city/state, Lighthouse score circle, pipeline tracks, service tags
- **LocationsTable** — TanStack Table with sorting, filtering, tier left-borders, DM Serif names, Geist Mono headers
- **OverviewGrid** — Framer Motion staggered animation for card grid
- **StatusPill** — Colored status badge with optional dropdown for inline editing
- **LocationDetail** — 8-tab container for location management
- **OverviewTab** — Key facts, Google rating, facility type, rebuild requirements
- **SiteTab** — Current URL, platform, tech stack, Lighthouse scores, rebuild status/preview/launch
- **InfraTab** — DNS, email, hosting, nameservers, secondary domain
- **MigrationTab** — Migration pipeline stages, blocker tracking, notes
- **ContactsTab** — Contact cards with CRUD, primary toggle, star indicator
- **NotesTab** — Blocker notes with resolve toggle, deletion
- **AssetsTab** — Logo vectors/rasters, brand colors, photography inventory
- **CompetitorsTab** — Competitor list with quick view, link to full market analysis

### Pipeline (3)
- **PipelineView** — Tab toggle (Migration/Rebuild) rendering KanbanBoards
- **KanbanBoard** — dnd-kit drag-and-drop columns with status counts
- **KanbanCard** — Draggable card with tier accent borderTop, platform badge, blocker indicator

### Metrics (3)
- **MetricsView** — 3 numbered sections: Lighthouse scores table, Performance vs Quality scatter (Recharts), Score breakdown cards
- **ReputationSection** — Ratings table + trend line chart (Recharts) grouped by location
- **LighthouseScore** — Circular SVG progress indicator (sm/md/lg sizes)

### Contacts (1)
- **ContactsTable** — TanStack Table with location links, email/phone copy buttons, inline add contact dialog

### Services (1)
- **ServiceMatrix** — 10x9 grid of locations vs services with gap analysis

### Audit (7)
- **AuditDashboard** — 3 numbered sections: Portfolio grades summary, Location grades table, Comparison chart
- **AuditDetailView** — 4 tabs: Scores/History, Opportunities, Diagnostics, All Audits
- **AuditItemList** — Collapsible list of PageSpeed audit items with status icons, savings estimates
- **GradePill** — Colored A-F letter grade badge (sm/md/lg variants)
- **AuditRunButton** — Run single audit or bulk run all with progress indicator
- **AuditComparisonChart** — 4-category grid (Perf, A11y, SEO, BP) with bar comparison + averages
- **ScoreTrendChart** — Line chart of audit scores over time with delta indicators

### SEO (8)
- **SeoDashboard** — 3 numbered sections: Portfolio SEO health, Location scores table, Comparison chart
- **SeoDetailView** — 4 tabs: All Checks, Issues Only, Recommendations, History
- **SeoCheckList** — Collapsible categories (meta, content, technical, structured-data) with pass/warn/fail icons
- **SeoStatusIcons** — Quick-glance key check indicators (Title, Desc, H1, Schema, SSL)
- **SeoComparisonChart** — Sorted horizontal bar chart of locations by SEO score
- **SeoRunButton** — Run single crawl or bulk run all with progress
- **SeoScoreCard** — Circular SVG progress with score and letter grade
- **SeoRecommendations** — Priority-grouped recommendations (critical/important/minor) with code snippets

### Competitor Intelligence (10)
- **CompetitorIntelDashboard** — 5 numbered sections: Market Overview, Market-by-Market, Reputation Race, Web Perf Gap, AI Visibility
- **MarketDetailView** — 7 numbered sections: Market Position, Competitors, Comparison, Rankings, Rating Trends, Service Coverage, AI Visibility
- **MarketTable** — Market positions table with city, ratings, Lighthouse, position score, grade
- **ReputationRaceChart** — Line chart comparing competitor ratings over time
- **WebPerformanceGapChart** — Scatter chart of Lighthouse score vs Google rating
- **RatingTrendChart** — Line chart comparing location vs competitors rating history
- **CompetitorRankTable** — Ranking table of location vs competitors by composite score
- **ServiceOverlapMatrix** — Grid comparing services between location and its competitors
- **MarketAIVisibility** — AI visibility check results with card layout per prompt/model
- **AIVisibilitySection** — Portfolio-wide AI visibility overview, LLM mention frequency

### Competitors (4)
- **CompetitorCard** — Card with name, rating, URL, edit/delete actions
- **CompetitorForm** — Dialog form for creating/editing competitors
- **CompetitorComparison** — Side-by-side metric comparison (location vs competitor)
- **CompetitorAuditButton** — Trigger button for competitor website audit

---

## 13. Library Functions

### `grading.ts` — Letter Grade System
- `computeOverallScore(perf, a11y, seo, bp)` — Weighted average: 30% perf, 25% a11y, 25% seo, 20% bp
- `getLetterGrade(score)` — Maps 0-100 score to A+ through F (97+=A+, 93+=A, 90+=A-, ... <60=F)
- `getGradeColor(grade)` / `getGradeBgColor(grade)` — Color mapping for grade display

### `pagespeed.ts` — Google PageSpeed API
- `runPageSpeedAudit(url, strategy)` — Calls PageSpeed Insights API, returns scores + audit items
- Interfaces: `PSIAuditItem`, `PSIResult`
- Uses `PAGESPEED_API_KEY` env var

### `seo-crawl.ts` — SEO Crawler
- `runSeoCrawl(url)` — Fetches HTML with cheerio, runs 16 weighted checks
- **16 checks**: meta title, meta description, OG tags, H1 tag, heading hierarchy, image alt text, canonical URL, JSON-LD schema, internal links, external links, robots.txt, sitemap.xml, HTTPS, viewport meta, favicon, response time
- Returns overall score (0-100), letter grade, individual check results

### `seo-recommendations.ts` — Recommendation Engine
- `generateRecommendations(location, checkResults)` — Creates actionable recommendations from failed/warning checks
- `buildRecommendation(check, context)` — Builds individual recommendation with code snippets
- `calculatePotentialScore(checks, recommendations)` — Estimates score improvement
- Returns `SeoRecommendation[]` with priority levels

### `competitor-audit.ts` — Competitor Audit Orchestrator
- `runCompetitorAudit(competitorId)` — Runs PageSpeed + SEO crawl on competitor URL
- Stores CompetitorSnapshot, denormalizes Lighthouse scores onto Competitor record

### `google-places.ts` — Google Places API
- `fetchPlaceDetails(placeId)` — Gets rating, review count, website via Places API field masking
- `searchPlace(query)` — Searches for places by name/location

### `market-position.ts` — Market Position Scoring
- `computeMarketPosition(location, competitors)` — Composite score (0-100) based on:
  - Google rating weight
  - Review volume comparison
  - Web performance (Lighthouse average)
  - SEO health score
  - Service breadth coverage
- `getMarketGrade(score)` — Maps score to letter grade A-F
- Returns `MarketPosition` object with scores, grade, rank

### `ai-visibility.ts` — AI Brand Visibility
- `PROMPT_TEMPLATES` — Templates like "best [service] in [city]"
- `buildPrompts(location)` — Generates prompts from templates
- `queryOpenAI(prompt)` / `queryClaude(prompt)` / `queryGemini(prompt)` — Query each LLM
- `parseResponse(response, location, competitors)` — Detects mentions, positions, competitor references
- Uses `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`

### `groupLocations.ts` — Tier System
- `getLocationGroup(location)` — Derives engagement tier (see Section 9)
- `groupLocations(locations)` — Groups array into `Record<LocationGroup, Location[]>`
- `GROUP_META` — Tier color/label definitions
- `GROUP_ORDER` — Display ordering

---

## 14. State Management

### Zustand Store (`src/store/ui.store.ts`)
```typescript
interface UIState {
  sidebarCollapsed: boolean;         // Desktop sidebar collapsed state
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;        // Mobile drawer open state
  setMobileSidebarOpen: (open: boolean) => void;
  overviewViewMode: "grouped" | "list";  // Portfolio view toggle
  setOverviewViewMode: (mode) => void;
}
```

**Persistence**: Uses `zustand/persist` middleware with `localStorage` key `"embark-os-ui"`. Only persists `sidebarCollapsed` and `overviewViewMode`.

---

## 15. Auth System

### NextAuth v5 Configuration (`src/lib/auth.ts`)
- **Provider**: Credentials (email + password)
- **Strategy**: JWT sessions
- **Single user**: Validates against `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars
- **Custom pages**: `/login` for sign-in
- **Exports**: `handlers`, `signIn`, `signOut`, `auth`

### Middleware (`src/middleware.ts`)
```
- Allows /api/auth/* routes through (NextAuth handlers)
- Unauthenticated users → redirect to /login
- Authenticated users on /login → redirect to /
- Matcher: all routes except _next/static, _next/image, favicon.ico
```

---

## 16. PDF Export

### Portfolio Report (`src/lib/pdf/generatePortfolioReport.tsx`)
- Uses `@react-pdf/renderer` to generate a downloadable PDF
- **Pages**:
  1. Cover page with title and generation date
  2. Summary stats (tier counts, averages)
  3. Service coverage matrix (10 locations x 9 services)
  4. Location snapshots with Lighthouse scores and pipeline status
- **Triggered via**: ExportButton → `GET /api/reports/portfolio-pdf`
- **Styling**: React PDF StyleSheet (not Tailwind)

---

## 17. Seed Data

The seed script (`prisma/seed.ts`) creates:
- **10 locations**: Hound Around, Wags Stay N' Play, Canine Country Club, Rio Grooming, Barks & Rec, Boxers Bed & Biscuits, Kingdom Canine, Home Away From Home, Embark Pet Services, Cadence Private Capital
- **6 contacts** across various locations with different roles
- **6 notes** including blocker notes
- **16 competitors** distributed across locations with Google Places IDs
- **20 rating snapshots** with historical trends for reputation tracking
- **Competitor rating snapshots** with historical data

Run with: `npx tsx prisma/seed.ts` (configured in `package.json` prisma.seed)

---

## 18. Patterns & Conventions

### Inline Editing Flow
1. Component renders `InlineEditField` / `InlineSelectField` / `InlineToggleField`
2. User clicks to edit → field becomes editable
3. On save → calls `useLocationUpdate()` hook
4. Hook sends `PATCH /api/locations/{id}` with changed field
5. Shows toast notification (success/error via Sonner)
6. Calls `router.refresh()` to revalidate server data

### Data Mutation Pattern
- All mutations go through API routes (`/api/*`)
- API routes use `auth()` to check session (most routes)
- Prisma queries run server-side in API handlers and page components
- Client components fetch via `fetch()` to API routes
- Page components (server) query Prisma directly

### Server Components vs Client Components
- **Page files** (`page.tsx`): Server components that query Prisma directly
- **Feature components**: Client components (`"use client"`) that receive data as props
- **Data flow**: Page queries DB → passes data as props → client components render + handle interactions

### Responsive Breakpoints
- `md` (768px): Primary breakpoint for sidebar visibility
- `sm` (640px): Padding adjustments (`p-4 sm:p-6`)
- Tables always use `overflow-x-auto` with `min-w-[700px]`

### File Naming
- Components: PascalCase (`LocationCard.tsx`)
- Lib files: kebab-case (`seo-crawl.ts`)
- Routes: Next.js conventions (`page.tsx`, `route.ts`, `layout.tsx`)

### Import Alias
- `@/*` maps to `src/*` (configured in `tsconfig.json`)

---

## 19. Known Gotchas

1. **Framer Motion ease arrays**: Must use tuple cast `as [number, number, number, number]` for custom cubic-bezier values
2. **Prisma 6 vs 7**: Prisma 7 requires adapter/accelerateUrl — this project uses Prisma 6 with `prisma-client-js` generator for SQLite compatibility
3. **`useRef()` in React 19**: Requires initial value in strict mode — always pass `useRef(null)` not `useRef()`
4. **Inline styles vs Tailwind for dynamic colors**: CSS vars via Tailwind classes don't reliably apply to dynamic `backgroundColor`. Use inline `style` for tier accent colors and PipelineTrack segment fills.
5. **Next.js 16 middleware deprecation**: Next.js 16 deprecates `middleware.ts` in favor of `proxy` (shows warning but still works)
6. **Tier colors from GROUP_META**: Never hardcode tier hex values — always import from `GROUP_META`. The same hex values appear as semantic colors (success/warning) in grading — those are fine hardcoded.
7. **`AUTH_SECRET` vs `NEXTAUTH_SECRET`**: NextAuth v5 uses `AUTH_SECRET` env var. Both are set to the same value for compatibility.
8. **maxDuration on API routes**: Long-running operations (audits, crawls, AI checks) set `maxDuration` in route config (120s for audits/SEO, 300s for AI visibility)
9. **Competitor model has duplicate fields**: The Prisma schema has duplicate `lighthouseA11y`, `lighthouseSEO`, `lighthouseBP` fields on the Competitor model (desktop fields declared, then mobile fields re-declare some with the same name instead of `lighthouseMobile*` prefix)
10. **AI visibility 24hr cooldown**: The AI visibility API enforces a 24-hour cooldown between checks for the same location/prompt/model combination
