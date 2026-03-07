# Competitor Intelligence System — Capabilities Guide

## What It Does

The Competitor Intel system gives Peter and Jack a single dashboard to see where Embark is winning and losing across every market. It combines website auditing, automated rating tracking, market position scoring, and AI brand visibility into one portfolio-level view.

---

## Stage 1: Competitor Website Auditing

**What**: Runs the same PageSpeed + SEO crawler we use on Embark sites against competitor websites. One-click audit, stored historically.

**Where**: Location detail → Competitors tab

**How to use**:
1. Each competitor card has an **Audit** button (scan icon) in the top-right — click it to run a full desktop + mobile audit
2. The **Audit All** button in the header runs audits sequentially across all competitors for that location
3. After auditing, each card shows an **SEO grade pill** (e.g., "SEO B+") and Lighthouse scores populate in the comparison table
4. Competitors must have a **URL** set to be auditable — edit a competitor and add their website URL if missing

**What you get**:
- Desktop + mobile Lighthouse scores (Performance, Accessibility, SEO, Best Practices)
- SEO crawl results (16 checks: meta tags, structured data, internal links, etc.)
- Letter grade and overall score
- Historical snapshots for trend tracking

**API**: `POST /api/competitors/{id}/audit` with `{ strategy: "both" }`

---

## Stage 2: Automated Rating Intelligence

**What**: Pulls live Google ratings and review counts for competitors via the Google Places API. Tracks changes over time.

**Where**: Competitor Intel dashboard → built into charts; individual competitor ratings endpoint

**How to use**:
1. Edit a competitor and add their **Google Place ID** (find it via [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id))
2. Use the **batch scan** endpoint to pull fresh ratings for all competitors that have Place IDs
3. Rating history feeds into the Rating Trend Chart on each market detail page

**What you get**:
- Automated monthly rating snapshots (no more manual data entry)
- Trend charts showing Embark vs competitor ratings over time
- Delta indicators showing if you're gaining or losing ground

**API**:
- `POST /api/competitors/{id}/ratings` — fetch + store one competitor
- `POST /api/competitor-intel/ratings/scan` — batch scan all competitors with Place IDs

**Cost**: ~$0.83 per full portfolio scan via Google Places API (~$3.32/month at weekly scans)

**Required**: `GOOGLE_API_KEY` or `PAGESPEED_API_KEY` env variable with Places API enabled

---

## Stage 3: Market Position Dashboard

**What**: Portfolio-level competitive intelligence hub with composite scoring.

**Where**: Sidebar → **Competitor Intel** (`/competitors`)

### Dashboard Sections

**01 // MARKET OVERVIEW** — Four stat cards:
- **Total Competitors**: Count across all markets
- **Avg Market Position**: Composite score (0-100) with letter grade
- **Rating Advantage**: How Embark's avg rating compares to competitors (green = ahead, red = behind)
- **AI Visibility**: Percentage of AI models that mention Embark (populated after Stage 4 scans)

**02 // MARKET-BY-MARKET** — Table showing per-location:
- Our rating vs avg competitor rating, with delta pill
- Lighthouse performance gap
- Service count comparison
- Composite market position score with letter grade
- Click "Detail →" to drill into any market

**03 // REPUTATION RACE** — Grouped bar chart: Embark rating vs avg competitor rating per market

**04 // WEB PERFORMANCE GAP** — Grouped bar chart: Embark Lighthouse avg vs competitor avg per market

### Market Detail View (`/competitors/{locationId}`)

Click into any market to see:
- **Market Score** — composite position with rating delta and Lighthouse gap
- **Competitor Rankings** — all businesses ranked by rating (Embark highlighted in blue)
- **Rating Trends** — multi-line chart showing Embark + each competitor's rating over time
- **Service Coverage** — matrix showing which services each business offers, with red "GAP" labels where competitors offer something Embark doesn't

### Composite Scoring Algorithm (0-100)

| Factor | Weight | How It's Calculated |
|--------|--------|-------------------|
| Google Rating | 25 pts | Embark rating relative to market average |
| Review Volume | 20 pts | Embark review count as percentile in market |
| Web Performance | 25 pts | Embark Lighthouse avg vs competitor avg |
| SEO Health | 15 pts | Embark SEO score vs competitor avg |
| Service Breadth | 15 pts | Embark service count vs max competitor services |

---

## Stage 4: AI Brand Visibility

**What**: Queries ChatGPT (GPT-4o), Claude, and Google Gemini with real pet-owner prompts to see which businesses get recommended.

**Where**: Competitor Intel dashboard → Section 05 // AI BRAND VISIBILITY

**How to use**:
1. Click **Scan** next to any location in the AI Visibility table
2. The system sends 3-5 prompts (filtered by the location's active services) to each available AI model
3. Results show: mention rate per model, overall mention percentage, and average ranking position

**Prompt examples**:
- "What are the best dog boarding facilities in Cottage Grove, MN?"
- "Can you recommend dog daycare centers in Moorhead, MN?"
- "What are the top-rated dog grooming salons near Hastings, MN?"
- "What are the best pet care facilities in the Belpre, OH area?"
- "Where can I get my dog trained in Pacific, MO?"

**What the results mean**:
- **High mention rate (>50%)**: AI models know about your business — good local SEO presence
- **Low mention rate (<25%)**: Your web presence isn't strong enough for AI models to recommend you — focus on structured data, LocalBusiness schema, content depth, and review volume
- **Position #1-3**: You're a top recommendation
- **Not listed**: The AI doesn't associate your brand with that service/location

**Cost**: ~$2-5 per full portfolio scan across all 3 models

**Cooldown**: 24 hours between scans per location (to prevent API cost runaway)

**Required env keys** (all optional — skips any missing model):
- `OPENAI_API_KEY` — for GPT-4o
- `ANTHROPIC_API_KEY` — for Claude
- `GOOGLE_API_KEY` — for Gemini Pro

---

## Recommended Monthly Workflow

| Week | Action | Time | Where |
|------|--------|------|-------|
| 1st | Run rating scan for all competitors | 2 min | API or future "Scan All" button |
| 1st | Review Market Table — flag any score drops | 5 min | `/competitors` |
| 2nd | Run AI visibility scan for priority markets | 5 min | `/competitors` → Scan buttons |
| 3rd | Audit competitor websites (focus on recently rebuilt sites) | 10 min | Location → Competitors → Audit All |
| 4th | Review trends, prepare monthly competitive brief | 15 min | `/competitors/{locationId}` detail pages |

## Prioritization Framework

Use the Market Table to prioritize action:

| Composite Score | Grade | Action |
|----------------|-------|--------|
| 80+ | A/B | Maintain — you're winning this market |
| 60-79 | C | Watch — monitor for competitor moves |
| 40-59 | D | Act — invest in site rebuild, review generation, or content |
| <40 | F | Urgent — this market needs immediate attention |

## Key Signals to Watch

- **Rating delta going negative**: A competitor is gaining reviews faster — launch a review campaign
- **Lighthouse gap closing**: A competitor rebuilt their site — re-audit and compare
- **AI mention rate dropping**: Your content may be stale — refresh service pages, add structured data
- **Service GAP labels**: Competitors offer something you don't — evaluate if it's a real opportunity
- **Review count divergence**: If a competitor has 3x your reviews, they'll dominate local search regardless of rating
