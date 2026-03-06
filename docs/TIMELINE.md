# Embark OS - Build Timeline

## Phase 1: Foundation

### Deliverables
- [x] Generate all `/docs/*.md` files
- [ ] Restructure to `src/` layout
- [ ] Install all dependencies
- [ ] Initialize shadcn/ui with dark theme
- [ ] Initialize Prisma with SQLite
- [ ] Create full schema + run migration
- [ ] Create seed script with all 10 locations + contacts + notes
- [ ] Build auth (next-auth credentials provider)
- [ ] Build layout shell (sidebar + topbar)
- [ ] Create `globals.css` with full design system tokens
- [ ] Build Portfolio Overview page (`/`) with location cards grid
- [ ] Summary stats bar (total locations, migrations, rebuilds)

### Routes Created
- `/login`
- `/` (portfolio overview)

---

## Phase 2: Core

### Deliverables
- [ ] Location detail page (`/locations/[slug]`) with all 7 tabs
  - Overview, Site, Infrastructure, Migration, Contacts, Assets, Notes
- [ ] Locations table (`/locations`) with TanStack Table
- [ ] Contacts directory (`/contacts`) with TanStack Table
- [ ] Inline editing pattern (click-to-edit)
- [ ] API routes for CRUD (locations, contacts, notes)
- [ ] Copy-to-clipboard on DNS values and emails
- [ ] Toast notifications on save

### Routes Created
- `/locations`
- `/locations/[slug]`
- `/contacts`
- `/api/locations/[id]`
- `/api/contacts/[id]`
- `/api/notes`

---

## Phase 3: Pipeline

### Deliverables
- [ ] Migration kanban board
- [ ] Rebuild kanban board
- [ ] Drag-and-drop reordering (dnd-kit)
- [ ] Quick-edit status from kanban cards
- [ ] Tabbed view switching between pipelines

### Routes Created
- `/pipeline`

---

## Phase 4: Metrics

### Deliverables
- [ ] Lighthouse score display (4 circular gauges per location)
- [ ] Cross-portfolio score comparison table (color-coded cells)
- [ ] Bar chart comparing scores across locations (Recharts)
- [ ] "Last audited" timestamp + "Mark as audited" button
- [ ] Score editing from metrics page and location detail

### Routes Created
- `/metrics`

---

## Phase 5: Polish

### Deliverables
- [ ] Cmd+K command palette (cmdk)
- [ ] Framer Motion animations
  - Staggered card entrance
  - Page transitions (fade + translateY)
  - Tab crossfade
  - Sidebar collapse animation
- [ ] Keyboard shortcuts (Linear-style G+O, G+L, G+P, G+M, G+C)
- [ ] Mobile responsiveness (sidebar collapse, table scroll, card stack)
- [ ] Settings page (user preferences)
- [ ] Final QA
  - No console errors/warnings
  - TypeScript strict, no `any`
  - All routes protected
  - Accessible (keyboard nav, ARIA labels)
  - `npm run build` succeeds

### Routes Created
- `/settings`
