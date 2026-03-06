# SEO Health & Digital Marketing Command Center

Embark Pet Services (10 locations) — replacing expensive vendor teams with in-house automated tooling.

---

## Phase 1: Site Crawler + SEO Scorecard (DONE)

Crawls each location's website, parses HTML with `cheerio`, runs 16 on-page SEO checks, and produces a health score (0-100) with letter grade. Zero external API cost.

### The 16 Checks

| # | Check | Weight | Pass | Warn | Fail |
|---|-------|--------|------|------|------|
| 1 | Meta Title | 10 | Exists, 50-60 chars | Exists, wrong length | Missing |
| 2 | Meta Description | 10 | Exists, 150-160 chars | Exists, wrong length | Missing |
| 3 | Open Graph Tags | 5 | og:title + og:desc + og:image | 1-2 present | None |
| 4 | H1 Tag | 8 | Exactly one | Multiple | Missing |
| 5 | Heading Hierarchy | 5 | H2s, logical order | H2s, skip levels | No H2s |
| 6 | Image Alt Text | 8 | >=90% coverage | 50-89% | <50% |
| 7 | Canonical URL | 6 | Present | - | Missing |
| 8 | Schema.org/JSON-LD | 8 | LocalBusiness found | Other JSON-LD | None |
| 9 | Internal Links | 5 | >=5 | 1-4 | 0 |
| 10 | External Links | 3 | >=1 | - | 0 |
| 11 | robots.txt | 6 | Exists (200) | - | Missing |
| 12 | sitemap.xml | 6 | Exists (200) | - | Missing |
| 13 | HTTPS | 8 | Yes | - | No |
| 14 | Mobile Viewport | 6 | Present | - | Missing |
| 15 | Favicon | 3 | Present | - | Missing |
| 16 | Response Time | 3 | <1s | 1-3s | >3s |

**Scoring:** `overallScore = sum(check.score * check.weight) / sum(weights) * 100`

### Routes
- `/seo` — Portfolio-level dashboard with avg grade, crawled count, pass/warn/fail distribution, location table, comparison chart
- `/seo/[locationId]` — Per-location detail with all checks, issues filter, crawl history

---

## Phase 2: Local SEO Tracker (Free)

- Google Business Profile data monitoring
- NAP (Name/Address/Phone) consistency checker across directories
- Review velocity tracking (extend existing RatingSnapshot with competitor review counts)
- Local citation discovery

---

## Phase 3: Keyword Rank Tracking (Paid API)

- Track 10-20 target keywords per location ("dog boarding [city]", "pet grooming [city]")
- Weekly position tracking with trend charts
- Competitor keyword overlap analysis
- API options: DataForSEO, SerpAPI, ValueSERP ($20-50/mo)

---

## Phase 4: AI/LLM Discoverability (Free/Low-cost)

- Periodically query ChatGPT/Claude: "best dog boarding in [city]"
- Log whether Embark appears in responses
- Track discoverability score over time
- Correlate with structured data improvements

---

## Phase 5: Content & Recommendations Engine (Partially DONE)

- [x] Deterministic SEO recommendations engine (`src/lib/seo-recommendations.ts`)
  - Prioritized fix suggestions (critical/important/minor) for all 16 checks
  - Location-aware: uses name, city, state, services, phone to generate contextual copy
  - Copy-paste code snippets (meta tags, JSON-LD, robots.txt, sitemap.xml)
  - Score potential calculator showing grade improvement if all issues fixed
- [x] Recommendations tab on SEO detail view with expandable cards + copy buttons
- [ ] Location-specific keyword recommendations
- [ ] Blog topic suggestions based on keyword gaps
- [ ] Meta tag copy generation (AI-assisted)
