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

### Status Colors
| Status | Foreground | Background | Text Class | Bg Class |
|--------|-----------|------------|------------|----------|
| Live | `#15803d` | `#dcfce7` | `text-status-live` | `bg-status-live-bg` |
| In Progress | `#92400e` | `#fef3c7` | `text-status-progress` | `bg-status-progress-bg` |
| Blocked | `#991b1b` | `#fee2e2` | `text-status-blocked` | `bg-status-blocked-bg` |
| Queued | `#3f3f46` | `#f4f4f5` | `text-status-queued` | `bg-status-queued-bg` |
| Complete | `#1d4ed8` | `#dbeafe` | `text-status-complete` | `bg-status-complete-bg` |

### Rules
- Use semantic Tailwind classes, not hardcoded hex colors
- Status colors appear only in pills/chips, never as large surface areas
- Primary blue is for interactive elements only, not decoration
- For inline styles (Recharts, Toaster), use `var(--token-name)` CSS variable syntax

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

## Component Inventory

### Layout
- `Sidebar` - Collapsible nav, icon-only at narrow
- `Topbar` - Page title, breadcrumbs
- `PageHeader` - Title + description + actions

### Data Display
- `StatusPill` - Colored status indicator
- `LocationCard` - Portfolio overview card
- `LocationRow` - Table row component
- `LighthouseScore` - Circular gauge (0-100)
- `ScoreRadar` - Recharts comparison chart

### Pipeline
- `KanbanBoard` - Column layout with dnd-kit
- `KanbanCard` - Draggable location card

### Shared
- `EmptyState` - Centered icon + text + CTA
- `SkeletonRow` - Loading placeholder
- `CopyButton` - Click-to-copy with toast
- `CommandPalette` - Cmd+K search (cmdk)

### shadcn/ui Components Used
Button, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent, Dialog, DropdownMenu, Select, Badge, Tooltip, Toast/Sonner, Separator, Card, Table, Skeleton, Avatar, Command
