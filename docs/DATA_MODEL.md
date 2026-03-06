# Embark OS - Data Model

## Prisma Schema

### Location

The central entity. Each row represents one facility in the Embark portfolio.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `slug` | String (unique) | URL-safe identifier, e.g. `hound-around` |
| `name` | String | Display name, e.g. "Hound Around Resort" |
| `address` | String? | Street address |
| `city` | String | City name |
| `state` | String | Two-letter state code |
| `phone` | String? | Primary phone number |
| `acquiredAt` | DateTime? | Date acquired by Embark/Cadence |
| `facilityType` | String | See enum below |

#### Service Flags (Boolean)
- `serviceBoarding`, `serviceDaycare`, `serviceGrooming`, `serviceTraining`
- `serviceVetCare`, `serviceGroomingEd`, `serviceWebcams`, `serviceMobileGroom`, `serviceRetail`

#### Website - Current State
| Field | Type | Description |
|-------|------|-------------|
| `currentUrl` | String? | Live URL of current site |
| `currentPlatform` | String? | Platform enum (see below) |
| `currentTechStack` | String? | Freeform, e.g. "Wix, cPanel email" |
| `lighthousePerf` | Int? | 0-100 performance score |
| `lighthouseA11y` | Int? | 0-100 accessibility score |
| `lighthouseSEO` | Int? | 0-100 SEO score |
| `lighthouseBP` | Int? | 0-100 best practices score |
| `lighthouseAudited` | DateTime? | Last audit timestamp |
| `googleRating` | Float? | Google Business rating |
| `googleReviewCount` | Int? | Number of Google reviews |

#### Website - Rebuild State
| Field | Type | Description |
|-------|------|-------------|
| `rebuildStatus` | String | Rebuild pipeline status (enum below) |
| `rebuildTemplate` | String? | Template name, e.g. "Template 5 - Warm Editorial" |
| `previewUrl` | String? | Vercel preview deployment URL |
| `targetLaunchDate` | DateTime? | Target go-live date |
| `liveUrl` | String? | Production URL once live |

#### Functional Requirements (Boolean)
- `needsOnlineBooking`, `needsWebcamFeed`, `needsPricingCalculator`
- `needsStaffPage`, `needsServicePages`, `needsPhotoGallery`
- `needsContactForm`, `needsMapsEmbed`, `needsReviewsWidget`

#### Infrastructure
| Field | Type | Description |
|-------|------|-------------|
| `domainRegistrar` | String? | GoDaddy, Cloudflare, etc. |
| `dnsProvider` | String? | Who manages DNS |
| `nameservers` | String? | JSON array string |
| `hostingProvider` | String? | Wix, Vercel, etc. |
| `emailPlatform` | String? | Email enum (see below) |
| `mxStatus` | String? | DNS record status enum |
| `spfStatus` | String? | DNS record status enum |
| `dkimStatus` | String? | DNS record status enum |
| `infraNotes` | String? | Freeform notes |
| `secondaryDomain` | String? | Alternate domain if exists |
| `secondaryDomainNotes` | String? | Notes about secondary domain |

#### Migration
| Field | Type | Description |
|-------|------|-------------|
| `migrationStatus` | String | Migration pipeline status (enum below) |
| `migrationBlockedBy` | String? | What's blocking progress |
| `migrationNotes` | String? | Freeform notes |

#### Assets
| Field | Type | Description |
|-------|------|-------------|
| `hasLogoVector` | Boolean | Has vector (.svg/.ai) logo |
| `hasLogoRaster` | Boolean | Has raster (.png/.jpg) logo |
| `hasBrandColors` | Boolean | Has defined brand palette |
| `hasPhotography` | String | "none" / "partial" / "full" |
| `assetNotes` | String? | Notes about available assets |

### Contact

People associated with locations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `locationId` | String | FK to Location |
| `name` | String | Full name |
| `email` | String? | Email address |
| `phone` | String? | Phone number |
| `role` | String | Role enum (see below) |
| `company` | String? | External company name |
| `notes` | String? | Freeform |
| `isPrimary` | Boolean | Primary contact for location |

### Note

Activity log entries per location.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `locationId` | String | FK to Location |
| `body` | String | Note content |
| `author` | String | Default "Mike" |
| `isBlocker` | Boolean | Flagged as blocking issue |
| `isResolved` | Boolean | Blocker resolved |

## Enum Values

### `currentPlatform`
`"wix"` | `"wordpress"` | `"squarespace"` | `"ghl"` | `"webflow"` | `"nextjs"` | `"custom"` | `"none"`

### `rebuildStatus`
`"not-scoped"` | `"scoped"` | `"in-design"` | `"in-development"` | `"in-review"` | `"live"`

### `migrationStatus`
`"not-started"` | `"recon"` | `"stakeholder-outreach"` | `"access-gathered"` | `"in-execution"` | `"complete"`

### `emailPlatform`
`"m365"` | `"google-workspace"` | `"cpanel"` | `"none"`

### DNS Record Status (`mxStatus`, `spfStatus`, `dkimStatus`)
`"correct"` | `"misconfigured"` | `"missing"` | `"unknown"`

### `facilityType`
`"multi-service"` | `"grooming"` | `"boarding"` | `"training"`

### Contact `role`
`"owner"` | `"operations"` | `"it-dns"` | `"marketing-agency"` | `"billing"` | `"facility-manager"`

### `hasPhotography`
`"none"` | `"partial"` | `"full"`

## Relationships

```
Location 1---* Contact  (cascade delete)
Location 1---* Note     (cascade delete)
```

## Seed Approach

The seed script (`prisma/seed.ts`) pre-populates:
- All 10 locations with every known field from the spec
- Known contacts (Karissa, Sara, Erin, Randy for CCC; Peter Mark for Cadence)
- Initial notes capturing blockers and status context
- Google ratings and review counts from public data
- Infrastructure details (DNS, email, registrar) where known

Seed is idempotent: uses `upsert` keyed on `slug` so it can be re-run safely.
