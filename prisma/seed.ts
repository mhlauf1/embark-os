import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Hound Around Resort
  const hound = await prisma.location.upsert({
    where: { slug: "hound-around" },
    update: {},
    create: {
      slug: "hound-around",
      name: "Hound Around Resort",
      city: "Cottage Grove",
      state: "MN",
      facilityType: "multi-service",
      serviceBoarding: true,
      serviceDaycare: true,
      serviceGrooming: true,
      currentUrl: "https://www.houndaroundresort.com",
      currentPlatform: "wix",
      currentTechStack: "Wix (current), Next.js + Sanity (rebuild)",
      rebuildStatus: "in-development",
      rebuildTemplate: "Template 5 - Warm Editorial",
      previewUrl: "https://hound-3-frontend.vercel.app/",
      migrationStatus: "complete",
      domainRegistrar: "GoDaddy",
      dnsProvider: "Cloudflare",
      hostingProvider: "Wix (current), Vercel (rebuild)",
      emailPlatform: "m365",
      mxStatus: "correct",
      spfStatus: "correct",
      dkimStatus: "correct",
      infraNotes: "Migration complete: Bluehost -> M365 via GoDaddy/Cloudflare",
      needsOnlineBooking: true,
      needsWebcamFeed: true,
      needsPricingCalculator: true,
      needsServicePages: true,
      needsPhotoGallery: true,
      needsContactForm: true,
      needsMapsEmbed: true,
      needsReviewsWidget: true,
      hasLogoRaster: true,
      hasBrandColors: true,
      hasPhotography: "partial",
    },
  });

  // Wags Stay N' Play
  const wags = await prisma.location.upsert({
    where: { slug: "wags-stay-n-play" },
    update: {},
    create: {
      slug: "wags-stay-n-play",
      name: "Wags Stay N' Play",
      city: "Moorhead",
      state: "MN",
      facilityType: "multi-service",
      serviceBoarding: true,
      serviceDaycare: true,
      serviceGrooming: true,
      currentUrl: "https://www.wagsstaynplay.com",
      currentPlatform: "wix",
      currentTechStack: "Wix, cPanel email",
      rebuildStatus: "not-scoped",
      migrationStatus: "access-gathered",
      migrationBlockedBy: "Awaiting Wix login + facility contact info from Peter",
      hostingProvider: "Wix",
      emailPlatform: "cpanel",
      mxStatus: "misconfigured",
      spfStatus: "missing",
      infraNotes: "Wix-hosted site, separate cPanel mail server via subdomain MX, no SPF records",
    },
  });

  // Canine Country Club
  const ccc = await prisma.location.upsert({
    where: { slug: "canine-country-club" },
    update: {},
    create: {
      slug: "canine-country-club",
      name: "Canine Country Club",
      city: "West Des Moines",
      state: "IA",
      facilityType: "multi-service",
      serviceBoarding: true,
      serviceDaycare: true,
      serviceGrooming: true,
      serviceTraining: true,
      currentUrl: "https://caninecountryclubwdm.com",
      currentPlatform: "custom",
      currentTechStack: "Custom (rebuilt by IMPACT Marketing)",
      rebuildStatus: "not-scoped",
      migrationStatus: "stakeholder-outreach",
      migrationNotes: "Domain + email migration only, no website rebuild in scope",
      domainRegistrar: "AWS (Bizmarquee)",
      dnsProvider: "AWS Route 53",
      emailPlatform: "google-workspace",
      mxStatus: "correct",
      spfStatus: "misconfigured",
      infraNotes: "Primary: caninecountryclubwdm.com (DNS via Randy Goldstein/Bizmarquee/AWS). Secondary: ccc-wdm.com (email-heavy, Homestead NS, GWS MX, misconfigured SPF)",
      secondaryDomain: "ccc-wdm.com",
      secondaryDomainNotes: "Email-heavy domain, Homestead nameservers, Google Workspace MX, misconfigured SPF",
    },
  });

  // Rio Grooming School & Salon
  const rio = await prisma.location.upsert({
    where: { slug: "rio-grooming" },
    update: {},
    create: {
      slug: "rio-grooming",
      name: "Rio Grooming School & Salon",
      city: "Hastings",
      state: "MN",
      facilityType: "grooming",
      serviceGrooming: true,
      serviceGroomingEd: true,
      serviceRetail: true,
      currentUrl: "https://riogrooming.com",
      currentPlatform: "unknown",
      rebuildStatus: "not-scoped",
      migrationStatus: "not-started",
      googleRating: 4.7,
      googleReviewCount: 222,
    },
  });

  // Barks & Rec Hastings
  const barks = await prisma.location.upsert({
    where: { slug: "barks-and-rec" },
    update: {},
    create: {
      slug: "barks-and-rec",
      name: "Barks & Rec Hastings",
      city: "Hastings",
      state: "MN",
      facilityType: "multi-service",
      serviceBoarding: true,
      serviceDaycare: true,
      currentUrl: "https://www.barksnrec.co",
      currentPlatform: "unknown",
      rebuildStatus: "not-scoped",
      migrationStatus: "not-started",
      googleRating: 4.9,
      googleReviewCount: 56,
    },
  });

  // Boxers Bed & Biscuits
  const boxers = await prisma.location.upsert({
    where: { slug: "boxers-bed-biscuits" },
    update: {},
    create: {
      slug: "boxers-bed-biscuits",
      name: "Boxers Bed & Biscuits",
      city: "Belpre",
      state: "OH",
      facilityType: "multi-service",
      serviceBoarding: true,
      serviceDaycare: true,
      serviceGrooming: true,
      serviceTraining: true,
      serviceVetCare: true,
      serviceWebcams: true,
      currentUrl: "https://www.boxersbedandbiscuits.com",
      currentPlatform: "wix",
      currentTechStack: "Wix, managed by Biztec IT",
      rebuildStatus: "not-scoped",
      migrationStatus: "not-started",
      googleRating: 4.6,
      googleReviewCount: 272,
      hasPhotography: "partial",
      infraNotes: "Managed by Biztec IT. Has TV commercial, active social media. Most full-service location in portfolio.",
    },
  });

  // Kingdom Canine
  const kingdom = await prisma.location.upsert({
    where: { slug: "kingdom-canine" },
    update: {},
    create: {
      slug: "kingdom-canine",
      name: "Kingdom Canine",
      city: "Pacific",
      state: "MO",
      facilityType: "multi-service",
      serviceBoarding: true,
      serviceDaycare: true,
      serviceGrooming: true,
      currentUrl: "https://kingdomcanine.com",
      currentPlatform: "ghl",
      currentTechStack: "GoHighLevel/LeadConnector, Gingr booking",
      rebuildStatus: "not-scoped",
      migrationStatus: "not-started",
      googleRating: 4.5,
      googleReviewCount: 111,
      infraNotes: "GHL/LeadConnector site. Gingr portal for booking.",
    },
  });

  // Home Away From Home (HAFH)
  const hafh = await prisma.location.upsert({
    where: { slug: "home-away-from-home" },
    update: {},
    create: {
      slug: "home-away-from-home",
      name: "Home Away From Home",
      city: "Fargo",
      state: "ND",
      facilityType: "multi-service",
      serviceBoarding: true,
      serviceDaycare: true,
      serviceGrooming: true,
      serviceMobileGroom: true,
      currentUrl: "https://hafhfacility.com",
      currentPlatform: "unknown",
      rebuildStatus: "not-scoped",
      migrationStatus: "not-started",
      googleRating: 4.6,
      googleReviewCount: 154,
    },
  });

  // Embark Pet Services (Corporate)
  const embark = await prisma.location.upsert({
    where: { slug: "embark-pet-services" },
    update: {},
    create: {
      slug: "embark-pet-services",
      name: "Embark Pet Services",
      city: "Minneapolis",
      state: "MN",
      facilityType: "multi-service",
      currentUrl: "https://www.embarkpetservices.com",
      currentPlatform: "nextjs",
      currentTechStack: "Next.js (built by Lauf)",
      rebuildStatus: "live",
      liveUrl: "https://www.embarkpetservices.com",
      migrationStatus: "complete",
      dnsProvider: "Cloudflare",
      hostingProvider: "Vercel",
      hasPhotography: "full",
      migrationNotes: "Pending: Add Canine Country Club, update location count",
    },
  });

  // Cadence Private Capital
  const cadence = await prisma.location.upsert({
    where: { slug: "cadence-private-capital" },
    update: {},
    create: {
      slug: "cadence-private-capital",
      name: "Cadence Private Capital",
      city: "Minneapolis",
      state: "MN",
      facilityType: "multi-service",
      currentUrl: "https://www.cadenceprivatecapital.com",
      currentPlatform: "nextjs",
      currentTechStack: "Next.js (built by Lauf)",
      rebuildStatus: "live",
      liveUrl: "https://www.cadenceprivatecapital.com",
      migrationStatus: "complete",
      dnsProvider: "Cloudflare",
      hostingProvider: "Vercel",
      hasPhotography: "full",
    },
  });

  // Contacts
  await prisma.contact.upsert({
    where: { id: "contact-karissa" },
    update: {},
    create: {
      id: "contact-karissa",
      locationId: ccc.id,
      name: "Karissa Schreurs",
      role: "owner",
      company: "Canine Country Club",
      isPrimary: true,
    },
  });

  await prisma.contact.upsert({
    where: { id: "contact-sara" },
    update: {},
    create: {
      id: "contact-sara",
      locationId: ccc.id,
      name: "Sara Krier",
      role: "operations",
      company: "Canine Country Club",
    },
  });

  await prisma.contact.upsert({
    where: { id: "contact-erin" },
    update: {},
    create: {
      id: "contact-erin",
      locationId: ccc.id,
      name: "Erin Reiner",
      role: "marketing-agency",
      company: "IMPACT Marketing",
    },
  });

  await prisma.contact.upsert({
    where: { id: "contact-randy" },
    update: {},
    create: {
      id: "contact-randy",
      locationId: ccc.id,
      name: "Randy Goldstein",
      role: "it-dns",
      company: "Bizmarquee",
    },
  });

  await prisma.contact.upsert({
    where: { id: "contact-peter" },
    update: {},
    create: {
      id: "contact-peter",
      locationId: cadence.id,
      name: "Peter Mark",
      role: "owner",
      company: "Cadence Private Capital",
      isPrimary: true,
    },
  });

  await prisma.contact.upsert({
    where: { id: "contact-jack" },
    update: {},
    create: {
      id: "contact-jack",
      locationId: cadence.id,
      name: "Jack Brady",
      role: "operations",
      company: "Cadence Private Capital",
    },
  });

  // Notes
  await prisma.note.upsert({
    where: { id: "note-hound-webcam" },
    update: {},
    create: {
      id: "note-hound-webcam",
      locationId: hound.id,
      body: "Webcam decision pending: Zosi/IPCamLive vs. Bravas. Need to confirm with facility before finalizing webcam integration on rebuilt site.",
      author: "Mike",
      isBlocker: true,
      isResolved: false,
    },
  });

  await prisma.note.upsert({
    where: { id: "note-hound-progress" },
    update: {},
    create: {
      id: "note-hound-progress",
      locationId: hound.id,
      body: "Pricing pages, webcam integration placeholder, and service calculator built. Preview deployed to Vercel. Pending client approval.",
      author: "Mike",
    },
  });

  await prisma.note.upsert({
    where: { id: "note-wags-blocked" },
    update: {},
    create: {
      id: "note-wags-blocked",
      locationId: wags.id,
      body: "DNS recon complete. Awaiting Wix login + facility contact info from Peter. Cannot proceed without access credentials.",
      author: "Mike",
      isBlocker: true,
      isResolved: false,
    },
  });

  await prisma.note.upsert({
    where: { id: "note-ccc-migration" },
    update: {},
    create: {
      id: "note-ccc-migration",
      locationId: ccc.id,
      body: "Domain + email migration only - no website rebuild in scope. Site was recently rebuilt by IMPACT Marketing. Two domains to manage: caninecountryclubwdm.com and ccc-wdm.com.",
      author: "Mike",
    },
  });

  await prisma.note.upsert({
    where: { id: "note-boxers-fullservice" },
    update: {},
    create: {
      id: "note-boxers-fullservice",
      locationId: boxers.id,
      body: "Most full-service location in the portfolio: daycare, boarding, grooming, vet care, training, and pet cams. Has TV commercial and active social media presence.",
      author: "Mike",
    },
  });

  await prisma.note.upsert({
    where: { id: "note-embark-update" },
    update: {},
    create: {
      id: "note-embark-update",
      locationId: embark.id,
      body: "Need to add Canine Country Club to the locations page and update total location count on the corporate site.",
      author: "Mike",
    },
  });

  console.log("Seed complete: 10 locations, 6 contacts, 6 notes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
