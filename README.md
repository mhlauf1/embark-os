# Embark OS

Internal operations dashboard for **Lauf Studio** managing the **Embark Pet Services** portfolio (10 locations). Single source of truth for web infrastructure, DNS/email state, migration status, rebuild progress, site metrics, contacts, assets, and operational notes.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, TypeScript strict)
- **Styling**: Tailwind CSS v4, light theme with semantic CSS variables
- **Components**: shadcn/ui (Radix UI primitives)
- **State**: Zustand (sidebar, UI preferences)
- **Tables**: TanStack Table v8
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Database**: SQLite via Prisma 6
- **Auth**: NextAuth credentials provider (single-user)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Initialize database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Portfolio overview with stats + location cards |
| `/locations` | All locations table (sortable, filterable) |
| `/locations/[slug]` | Location detail with 7 tabs |
| `/pipeline` | Migration + rebuild kanban boards |
| `/metrics` | Lighthouse scores + comparison charts |
| `/contacts` | Contact directory |
| `/settings` | App info + keyboard shortcuts |

## Design System

Light theme using semantic CSS custom properties defined in `src/styles/globals.css`. Components use Tailwind classes like `bg-background`, `text-foreground`, `border-border` -- never hardcoded hex colors. Status badges use dedicated tokens (`bg-status-live-bg`, `text-status-live`, etc.) with high-contrast text on pastel backgrounds.

See `docs/DESIGN_SYSTEM.md` for full color tokens, typography, spacing, and motion guidelines.

## Documentation

- `docs/ARCHITECTURE.md` - System architecture and component hierarchy
- `docs/DATA_MODEL.md` - Prisma schema and data relationships
- `docs/DESIGN_SYSTEM.md` - Color tokens, typography, spacing, motion
- `docs/DECISIONS.md` - Architectural decision records
- `docs/TIMELINE.md` - Build phases
- `docs/LOCATIONS.md` - Portfolio location reference data
- `EMBARK_OS_SPEC.md` - Full project specification
