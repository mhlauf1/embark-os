# Embark OS - Location Reference

> Source of truth for seed data. Updated with research findings.

---

## 1. Hound Around Resort

- **Slug**: `hound-around`
- **City/State**: Cottage Grove, MN
- **Facility Type**: multi-service
- **Services**: Daycare, Boarding, Grooming
- **Current URL**: https://www.houndaroundresort.com
- **Current Platform**: Wix (being replaced)
- **Rebuild Status**: in-development
- **Rebuild Template**: Template 5 - Warm Editorial
- **Preview URL**: https://hound-3-frontend.vercel.app/
- **Migration Status**: complete
- **Infrastructure**: Cloudflare DNS, M365 email, GoDaddy reseller
- **Domain Registrar**: GoDaddy
- **DNS Provider**: Cloudflare
- **Email Platform**: M365
- **MX Status**: correct
- **SPF Status**: correct
- **Notes**: Pricing pages, webcam integration, and service calculator built. Webcam decision pending (Zosi/IPCamLive vs. Bravas). Full rebuild in progress. Migration complete (Bluehost -> M365 via GoDaddy/Cloudflare).
- **Assets**: Logo raster available, brand colors defined
- **Photography**: partial

---

## 2. Wags Stay N' Play

- **Slug**: `wags-stay-n-play`
- **City/State**: Moorhead, MN
- **Facility Type**: multi-service
- **Services**: Daycare, Boarding, Grooming
- **Current URL**: https://www.wagsstaynplay.com
- **Current Platform**: Wix
- **Rebuild Status**: not-scoped
- **Migration Status**: access-gathered
- **Infrastructure**: Wix-hosted site, separate cPanel mail server via subdomain MX, no SPF records
- **Email Platform**: cpanel
- **MX Status**: misconfigured
- **SPF Status**: missing
- **Migration Blocked By**: Awaiting Wix login + facility contact info from Peter
- **Quality Assessment**: Outdated Wix template, no performance optimization
- **Google Rating**: TBD
- **Photography**: none

---

## 3. Canine Country Club

- **Slug**: `canine-country-club`
- **City/State**: West Des Moines, IA
- **Facility Type**: multi-service
- **Services**: Daycare, Boarding, Grooming, Training
- **Current URL**: https://caninecountryclubwdm.com
- **Current Platform**: custom (recently rebuilt by IMPACT Marketing)
- **Rebuild Status**: not-scoped (domain + email migration only, no website rebuild)
- **Migration Status**: stakeholder-outreach
- **Infrastructure**:
  - Primary domain: caninecountryclubwdm.com (DNS via Randy Goldstein/Bizmarquee/AWS)
  - Secondary domain: ccc-wdm.com (email-heavy, Homestead nameservers, Google Workspace MX with misconfigured SPF)
- **Domain Registrar**: AWS (Bizmarquee)
- **DNS Provider**: AWS Route 53
- **Email Platform**: google-workspace
- **MX Status**: correct (primary), misconfigured (secondary)
- **SPF Status**: misconfigured
- **Secondary Domain**: ccc-wdm.com
- **Secondary Domain Notes**: Email-heavy, Homestead nameservers, Google Workspace MX, misconfigured SPF

### Contacts
| Name | Role | Company | Email |
|------|------|---------|-------|
| Karissa Schreurs | owner | Canine Country Club | |
| Sara Krier | operations | Canine Country Club | |
| Erin Reiner | marketing-agency | IMPACT Marketing | |
| Randy Goldstein | it-dns | Bizmarquee | |

---

## 4. Rio Grooming School & Salon

- **Slug**: `rio-grooming`
- **City/State**: Hastings, MN
- **Facility Type**: grooming
- **Services**: Grooming, Grooming Education, Self-Service Dog Wash (retail)
- **Current URL**: https://riogrooming.com
- **Current Platform**: TBD (needs assessment)
- **Rebuild Status**: not-scoped
- **Migration Status**: not-started
- **Google Rating**: 4.7 (222 reviews)
- **Photography**: none

---

## 5. Barks & Rec Hastings

- **Slug**: `barks-and-rec`
- **City/State**: Hastings, MN
- **Facility Type**: multi-service
- **Services**: Daycare, Boarding
- **Current URL**: https://www.barksnrec.co
- **Current Platform**: TBD (needs assessment)
- **Rebuild Status**: not-scoped
- **Migration Status**: not-started
- **Google Rating**: 4.9 (56 reviews)
- **Photography**: none

---

## 6. Boxers Bed & Biscuits

- **Slug**: `boxers-bed-biscuits`
- **City/State**: Belpre, OH
- **Facility Type**: multi-service
- **Services**: Daycare, Boarding, Grooming, Vet Care, Training, Webcams
- **Current URL**: https://www.boxersbedandbiscuits.com
- **Current Platform**: Wix
- **Rebuild Status**: not-scoped
- **Migration Status**: not-started
- **Managed By**: Biztec IT
- **Google Rating**: 4.6 (272 reviews)
- **Notes**: Has a TV commercial, active social media. Most full-service location in portfolio.
- **Photography**: partial

---

## 7. Kingdom Canine

- **Slug**: `kingdom-canine`
- **City/State**: Pacific, MO
- **Facility Type**: multi-service
- **Services**: Boarding, Daycare, Grooming, Transportation
- **Current URL**: https://kingdomcanine.com
- **Current Platform**: GHL (GoHighLevel/LeadConnector)
- **Rebuild Status**: not-scoped
- **Migration Status**: not-started
- **Booking System**: Gingr portal
- **Google Rating**: 4.5 (111 reviews)
- **Photography**: none

---

## 8. Home Away From Home (HAFH)

- **Slug**: `home-away-from-home`
- **City/State**: Fargo, ND
- **Facility Type**: multi-service
- **Services**: Daycare, Boarding, Grooming, Mobile Grooming
- **Current URL**: https://hafhfacility.com
- **Current Platform**: TBD (needs assessment)
- **Rebuild Status**: not-scoped
- **Migration Status**: not-started
- **Google Rating**: 4.6 (154 reviews)
- **Photography**: none

---

## 9. Embark Pet Services (Corporate)

- **Slug**: `embark-pet-services`
- **City/State**: Minneapolis, MN (corporate)
- **Facility Type**: multi-service
- **Services**: (corporate umbrella)
- **Current URL**: https://www.embarkpetservices.com
- **Current Platform**: Next.js (built by Lauf)
- **Rebuild Status**: live
- **Migration Status**: complete
- **Notes**: Pending - add Canine Country Club, update location count
- **Photography**: full

---

## 10. Cadence Private Capital (PE Parent)

- **Slug**: `cadence-private-capital`
- **City/State**: Minneapolis, MN
- **Facility Type**: multi-service
- **Services**: (PE holding company)
- **Current URL**: https://www.cadenceprivatecapital.com
- **Current Platform**: Next.js (built by Lauf)
- **Rebuild Status**: live
- **Migration Status**: complete
- **Photography**: full

### Contacts
| Name | Role | Company |
|------|------|---------|
| Peter Mark | owner | Cadence Private Capital |
| Jack Brady | operations | Cadence Private Capital |

---

## Site Research Findings

### Platform Confirmations & Quality Tiers

| Location | Platform | Quality Tier | Rebuild Priority |
|----------|----------|-------------|-----------------|
| Wags Stay N' Play | Wix (confirmed) | Poor | High |
| Boxers Bed & Biscuits | Wix (confirmed) | Poor-Fair | High |
| Kingdom Canine | GHL/LeadConnector (confirmed) | Poor | High |
| Canine Country Club | Custom/IMPACT Marketing | Fair-Good | Low (no rebuild scope) |
| Rio Grooming School | Needs assessment | Unknown | Medium |
| Barks & Rec Hastings | Needs assessment | Unknown | Medium |
| Home Away From Home | Needs assessment | Unknown | Medium |
| Embark Pet Services | Next.js (Lauf) | Excellent | N/A (complete) |
| Cadence Private Capital | Next.js (Lauf) | Excellent | N/A (complete) |
| Hound Around Resort | Wix -> Next.js | Good (rebuilding) | In Progress |

### Priority Notes
- **High priority rebuilds**: Wix and GHL sites have dated templates, poor performance, and no mobile optimization
- **Hound Around**: Already in development with Template 5, closest to completion
- **CCC**: Only domain/email migration needed, no website rebuild (recently rebuilt by IMPACT)
- **Lauf-built sites**: Serve as quality reference for what rebuilt sites should look like
