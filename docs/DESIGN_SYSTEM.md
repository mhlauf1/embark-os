# Embark OS - Design System

## Philosophy

Linear meets Apple. Dense, restrained, confident. Every pixel intentional. Micro-animations communicate state, not decorate. The UI feels faster than it is.

## Color Tokens (Light Theme)

All colors are defined as CSS custom properties in `src/styles/globals.css` and referenced via semantic Tailwind classes (e.g., `bg-background`, `text-foreground`, `border-border`). Components should never use hardcoded hex values -- always use the semantic classes.

### Base
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--background` | `#ffffff` | `bg-background` | Page background |
| `--card` | `#ffffff` | `bg-card` | Card/panel backgrounds |
| `--muted` | `#f4f4f5` | `bg-muted` | Hover states, active rows, subtle fills |
| `--border` | `#e4e4e7` | `border-border` | Dividers, input borders |
| `--ring` | `#2563eb` | `ring-ring` | Focus rings |

### Typography Colors
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--foreground` | `#09090b` | `text-foreground` | Headings, primary content |
| `--muted-foreground` | `#71717a` | `text-muted-foreground` | Labels, descriptions, tertiary |

### Accent (Embark Blue)
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--primary` | `#2563eb` | `bg-primary` / `text-primary` | Buttons, links, active states |
| `--accent` | `#dbeafe` | `bg-accent` | Tinted backgrounds |
| `--accent-foreground` | `#1e3a5f` | `text-accent-foreground` | Text on accent backgrounds |

### Semantic UI Colors
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--success` | `#22c55e` | `text-success` / `fill-success` | Good scores, live indicators, confirmations |
| `--warning` | `#f59e0b` | `text-warning` / `fill-warning` | Medium scores, in-progress indicators, star ratings |
| `--destructive` | `#ef4444` | `text-destructive` | Error text, bad scores, blocked indicators |

### Status Colors
| Status | Foreground | Background | Text Class | Bg Class |
|--------|-----------|------------|------------|----------|
| Live | `#15803d` | `#dcfce7` | `text-status-live` | `bg-status-live-bg` |
| In Progress | `#92400e` | `#fef3c7` | `text-status-progress` | `bg-status-progress-bg` |
| Blocked | `#991b1b` | `#fee2e2` | `text-status-blocked` | `bg-status-blocked-bg` |
| Queued | `#3f3f46` | `#f4f4f5` | `text-status-queued` | `bg-status-queued-bg` |
| Complete | `#1d4ed8` | `#dbeafe` | `text-status-complete` | `bg-status-complete-bg` |

### Chart Colors
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--chart-1` | `#2563eb` | `chart-1` | Performance bars (blue) |
| `--chart-2` | `#16a34a` | `chart-2` | Accessibility bars (green) |
| `--chart-3` | `#d97706` | `chart-3` | SEO bars (amber) |
| `--chart-4` | `#dc2626` | `chart-4` | Reserved (red) |
| `--chart-5` | `#71717a` | `chart-5` | Best Practices bars (gray) |

### Rules
- Use semantic Tailwind classes, not hardcoded hex colors
- For score coloring: `text-success` (≥90), `text-warning` (≥50), `text-destructive` (<50)
- For star ratings: `fill-warning text-warning` (filled), `text-muted-foreground` (empty)
- Status colors appear only in pills/chips, never as large surface areas
- Primary blue is for interactive elements only, not decoration
- For inline styles (Recharts, Toaster, SVG), use `var(--token-name)` CSS variable syntax
- For group accent colors (border-left on cards), use `var(--success)`, `var(--warning)`, `var(--muted-foreground)`

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | DM Serif Display | 400 italic | Location names on cards, page heroes |
| UI / Body | Geist | 400, 500, 600 | All interface text |
| Monospace | Geist Mono | 400 | URLs, DNS records, IPs, code snippets |

### Scale
| Size | Pixels | Usage |
|------|--------|-------|
| xs | 11px | Status pill text (uppercase, letter-spaced) |
| sm | 13px | Table cells, secondary labels |
| base | 14px | Body text, form inputs |
| lg | 16px | Section headers, card titles |
| xl | 20px | Page titles |
| 2xl | 24px | Location name (DM Serif Display) |

## Spacing

- Base unit: 4px
- Content padding: 24px (6 units)
- Card internal padding: 16px-20px
- Gap between cards: 16px
- Section spacing: 32px

## Border Radius

| Element | Radius |
|---------|--------|
| Cards | 8px |
| Inputs | 6px |
| Pills/Chips | 9999px (full round) |
| Buttons | 6px |
| Modals | 12px |

## Motion

### Timing
| Type | Duration | Use |
|------|----------|-----|
| Micro | 120ms | Hover states, color changes |
| State | 200ms | Status transitions, toggles |
| Layout | 250-350ms | Page transitions, panel open/close |

### Easing
- Standard: `cubic-bezier(0.16, 1, 0.3, 1)` - fast out, natural settle
- Use `will-change: transform` for frequently animated elements

### Patterns
- Page transitions: fade + 4px translateY (content slides up)
- Card stagger: 50ms delay between siblings on load
- Sidebar collapse: smooth width transition
- Status pills: color transition on state change (not instant)
- Row hover: background transition only, 120ms
- Loading: skeleton shimmer, never spinners (except explicit async)
- Tab content: crossfade between panels
- Inline edit: pencil icon fades in on hover (`opacity-0 → group-hover:opacity-100`), input border highlights on focus
- Toggle switch: smooth translate + color transition on boolean fields

## Component Inventory

### Layout
- `Sidebar` - Collapsible nav, icon-only at narrow
- `Topbar` - Page title, breadcrumbs
- `PageHeader` - Title + description + actions

### Data Display
- `StatusPill` - Colored status indicator; optionally clickable with dropdown for status changes
- `LocationCard` - Portfolio overview card
- `LocationRow` - Table row component
- `LighthouseScore` - Circular gauge (0-100)
- `ScoreRadar` - Recharts comparison chart

### Inline Editing
- `InlineEditField` - Click-to-edit text/textarea with pencil icon, Enter/Escape/blur, checkmark/X buttons
- `InlineSelectField` - Click-to-open dropdown for enum fields (platforms, facility types, email providers)
- `InlineToggleField` - Toggle switch for boolean fields (services, requirements, asset availability)

### Pipeline
- `KanbanBoard` - Column layout with dnd-kit
- `KanbanCard` - Draggable location card

### Shared
- `EmptyState` - Centered icon + text + CTA
- `SkeletonRow` - Loading placeholder
- `CopyButton` - Click-to-copy with toast
- `CommandPalette` - Cmd+K search (cmdk)

### Hooks
- `useLocationUpdate` - Shared hook for PATCH mutations with toast confirmation + `router.refresh()`

### shadcn/ui Components Used
Button, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent, Dialog, DropdownMenu, Select, Badge, Tooltip, Toast/Sonner, Separator, Card, Table, Skeleton, Avatar, Command
