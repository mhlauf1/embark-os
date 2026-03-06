import type { Location, SeoCheckResult, SeoRecommendation, ServiceKey } from "@/types";
import { SERVICE_LABELS } from "@/types";
import { getLetterGrade } from "./grading";

function getActiveServices(location: Location): string[] {
  const keys = Object.keys(SERVICE_LABELS) as ServiceKey[];
  return keys
    .filter((key) => (location as Record<string, unknown>)[key] === true)
    .map((key) => SERVICE_LABELS[key]);
}

function getPriority(
  check: SeoCheckResult
): SeoRecommendation["priority"] {
  if (check.status === "fail" && check.weight >= 8) return "critical";
  if (check.status === "fail" && check.weight >= 5) return "important";
  if (check.status === "warn") return "important";
  return "minor";
}

export function generateRecommendations(
  location: Location,
  checks: SeoCheckResult[]
): SeoRecommendation[] {
  const failing = checks.filter((c) => c.status !== "pass");
  if (failing.length === 0) return [];

  const services = getActiveServices(location);
  const topServices = services.slice(0, 2).join(" & ") || "Pet Services";
  const allServices = services.join(", ") || "pet care services";
  const { name, city, state, currentUrl } = location;
  const url = currentUrl || `https://${name.toLowerCase().replace(/\s+/g, "")}.com`;

  const recommendations: SeoRecommendation[] = [];

  for (const check of failing) {
    const rec = buildRecommendation(check, {
      name,
      city,
      state,
      url,
      topServices,
      allServices,
      services,
      phone: location.phone,
    });
    if (rec) recommendations.push(rec);
  }

  // Sort: critical first, then important, then minor
  const order: Record<string, number> = { critical: 0, important: 1, minor: 2 };
  recommendations.sort((a, b) => order[a.priority] - order[b.priority]);

  return recommendations;
}

interface LocationContext {
  name: string;
  city: string;
  state: string;
  url: string;
  topServices: string;
  allServices: string;
  services: string[];
  phone: string | null;
}

function buildRecommendation(
  check: SeoCheckResult,
  ctx: LocationContext
): SeoRecommendation | null {
  const priority = getPriority(check);
  const impactText = `This check is worth ${check.weight} points${check.weight >= 8 ? " (highest weight)" : ""}`;

  switch (check.id) {
    case "meta-title": {
      const suggestedTitle = `${ctx.topServices} in ${ctx.city} | ${ctx.name}`;
      if (check.status === "fail") {
        return {
          checkId: check.id,
          priority,
          title: "Add Meta Title",
          impact: impactText,
          explanation:
            "The title tag is the most important on-page SEO element. It appears in search results and browser tabs. A missing title means search engines have no clear understanding of your page.",
          suggestion: `Use a descriptive title with your services and city: "${suggestedTitle}"`,
          codeSnippet: `<title>${suggestedTitle}</title>`,
        };
      }
      // warn — wrong length
      const currentLen = check.details?.length ?? 0;
      const trimmed =
        currentLen > 60
          ? suggestedTitle.slice(0, 57) + "..."
          : suggestedTitle;
      return {
        checkId: check.id,
        priority,
        title: "Optimize Meta Title Length",
        impact: impactText,
        explanation: `Your title is ${currentLen} characters. Search engines display 50-60 characters. Titles outside this range may be truncated or underutilize the available space.`,
        suggestion: `Adjust to 50-60 characters. Suggested: "${trimmed}"`,
        codeSnippet: `<title>${trimmed}</title>`,
        currentValue: check.details,
      };
    }

    case "meta-desc": {
      const suggestedDesc = `Trusted ${ctx.allServices} in ${ctx.city}, ${ctx.state}. Locally owned pet care your dog will love. Book today!`;
      if (check.status === "fail") {
        return {
          checkId: check.id,
          priority,
          title: "Add Meta Description",
          impact: impactText,
          explanation:
            "The meta description appears below your title in search results. Without one, Google generates a snippet from your page content which may not be compelling.",
          suggestion: `Write a 150-160 character description: "${suggestedDesc}"`,
          codeSnippet: `<meta name="description" content="${suggestedDesc}" />`,
        };
      }
      // warn — wrong length
      const currentLen = check.details?.length ?? 0;
      return {
        checkId: check.id,
        priority,
        title: "Optimize Meta Description Length",
        impact: impactText,
        explanation: `Your description is ${currentLen} characters. The ideal range is 150-160 characters for full visibility in search results.`,
        suggestion: `Adjust to 150-160 characters. Suggested: "${suggestedDesc}"`,
        codeSnippet: `<meta name="description" content="${suggestedDesc}" />`,
        currentValue: check.details,
      };
    }

    case "og-tags": {
      const ogTitle = `${ctx.topServices} in ${ctx.city} | ${ctx.name}`;
      const ogDesc = `Trusted ${ctx.allServices} in ${ctx.city}, ${ctx.state}. Book today!`;
      return {
        checkId: check.id,
        priority,
        title: check.status === "fail" ? "Add Open Graph Tags" : "Complete Open Graph Tags",
        impact: impactText,
        explanation:
          "Open Graph tags control how your page appears when shared on Facebook, LinkedIn, and other social platforms. Missing tags result in generic or missing previews.",
        suggestion:
          "Add og:title, og:description, and og:image tags. The image should be a branded photo (1200x630px recommended).",
        codeSnippet: `<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDesc}" />
<meta property="og:image" content="${ctx.url}/og-image.jpg" />`,
      };
    }

    case "h1-tag": {
      const suggestedH1 = `${ctx.name} — ${ctx.topServices} in ${ctx.city}`;
      if (check.status === "fail") {
        return {
          checkId: check.id,
          priority,
          title: "Add H1 Heading",
          impact: impactText,
          explanation:
            "The H1 is the primary heading on your page and tells search engines what your page is about. Every page should have exactly one H1.",
          suggestion: `Add a clear H1 with your business name and services: "${suggestedH1}"`,
          codeSnippet: `<h1>${suggestedH1}</h1>`,
        };
      }
      // warn — multiple H1s
      return {
        checkId: check.id,
        priority,
        title: "Fix Multiple H1 Tags",
        impact: impactText,
        explanation:
          "Your page has multiple H1 tags. Each page should have exactly one H1 to clearly signal the main topic. Additional headings should use H2-H6.",
        suggestion: `Keep only the most relevant H1 and change others to H2. Suggested H1: "${suggestedH1}"`,
        codeSnippet: `<h1>${suggestedH1}</h1>`,
      };
    }

    case "heading-hierarchy": {
      if (check.status === "fail") {
        return {
          checkId: check.id,
          priority,
          title: "Add Section Headings (H2)",
          impact: impactText,
          explanation:
            "H2 headings break your content into scannable sections and help search engines understand your page structure.",
          suggestion:
            'Add H2 headings for key sections like "Our Services", "About Us", "Visit Us", and "Reviews".',
          codeSnippet: `<h2>Our Services</h2>
<h2>About Us</h2>
<h2>Visit Us in ${ctx.city}</h2>
<h2>Customer Reviews</h2>`,
        };
      }
      // warn — skip levels
      return {
        checkId: check.id,
        priority,
        title: "Fix Heading Level Hierarchy",
        impact: impactText,
        explanation:
          "Heading levels should be sequential: H1 followed by H2, then H3. Skipping levels (e.g., H1 to H3) confuses screen readers and weakens your content structure.",
        suggestion:
          "Ensure headings follow the correct order: H1 → H2 → H3. Never skip from H1 directly to H3.",
      };
    }

    case "img-alt": {
      return {
        checkId: check.id,
        priority,
        title: "Improve Image Alt Text Coverage",
        impact: impactText,
        explanation:
          "Alt text describes images for visually impaired users and search engines. Missing alt text means lost SEO value and accessibility issues.",
        suggestion: `Add descriptive alt text to every <img> tag. Use specific descriptions that include your business name and location.`,
        codeSnippet: `<!-- Good examples: -->
<img src="play-area.jpg" alt="Golden retriever in play area at ${ctx.name}" />
<img src="grooming.jpg" alt="Dog grooming station at ${ctx.name} ${ctx.city}" />
<img src="facility.jpg" alt="${ctx.name} facility exterior in ${ctx.city}, ${ctx.state}" />`,
      };
    }

    case "canonical": {
      return {
        checkId: check.id,
        priority,
        title: "Add Canonical URL Tag",
        impact: impactText,
        explanation:
          "A canonical tag tells search engines which URL is the official version of a page. This prevents duplicate content issues when the same page is accessible via multiple URLs.",
        suggestion: `Add a canonical link element pointing to your primary URL.`,
        codeSnippet: `<link rel="canonical" href="${ctx.url}" />`,
      };
    }

    case "schema-jsonld": {
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: ctx.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: ctx.city,
          addressRegion: ctx.state,
        },
        url: ctx.url,
      };
      if (ctx.phone) schema.telephone = ctx.phone;
      if (ctx.services.length > 0) {
        schema.hasOfferCatalog = {
          "@type": "OfferCatalog",
          name: "Pet Services",
          itemListElement: ctx.services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s },
          })),
        };
      }

      if (check.status === "fail") {
        return {
          checkId: check.id,
          priority,
          title: "Add Schema.org Structured Data",
          impact: impactText,
          explanation:
            "Structured data helps Google understand your business and can enable rich search results (star ratings, business hours, etc). A LocalBusiness schema is essential for local SEO.",
          suggestion:
            "Add a JSON-LD script with your business information. The snippet below is pre-filled with your location data.",
          codeSnippet: `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`,
        };
      }
      // warn — has JSON-LD but no LocalBusiness
      return {
        checkId: check.id,
        priority,
        title: "Add LocalBusiness Schema Type",
        impact: impactText,
        explanation:
          'Your site has JSON-LD structured data but is missing the LocalBusiness type. For a local pet services business, this schema type is critical for appearing in local search results and Google Maps.',
        suggestion:
          "Replace or supplement your existing JSON-LD with a LocalBusiness schema.",
        codeSnippet: `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`,
      };
    }

    case "internal-links": {
      if (check.status === "fail") {
        return {
          checkId: check.id,
          priority,
          title: "Add Internal Links",
          impact: impactText,
          explanation:
            "Internal links help search engines discover your pages and distribute page authority. They also help visitors navigate your site.",
          suggestion:
            "Add navigation links to key pages: services, about, contact, and individual location pages. Aim for at least 5 internal links.",
        };
      }
      // warn — too few
      return {
        checkId: check.id,
        priority,
        title: "Increase Internal Links",
        impact: impactText,
        explanation:
          "Your page has very few internal links. More links help search engines crawl and index your site, and help visitors find related content.",
        suggestion:
          "Add in-content links to services pages, about page, contact page, and other location pages. Target at least 5 internal links.",
      };
    }

    case "external-links": {
      return {
        checkId: check.id,
        priority,
        title: "Add External Links",
        impact: impactText,
        explanation:
          "External links to authoritative sources signal trust and relevance. For a pet services business, linking to relevant directories and review sites adds credibility.",
        suggestion:
          "Link to your Google Maps listing, review sites (Yelp, Google Reviews), professional associations, or local business directories.",
      };
    }

    case "robots-txt": {
      return {
        checkId: check.id,
        priority,
        title: "Add robots.txt File",
        impact: impactText,
        explanation:
          "A robots.txt file tells search engine crawlers which pages to index. Without it, crawlers may not efficiently index your site.",
        suggestion:
          "Create a robots.txt file at your site root with basic allow rules and a sitemap reference.",
        codeSnippet: `User-agent: *
Allow: /

Sitemap: ${ctx.url}/sitemap.xml`,
      };
    }

    case "sitemap-xml": {
      return {
        checkId: check.id,
        priority,
        title: "Add XML Sitemap",
        impact: impactText,
        explanation:
          "A sitemap helps search engines discover and index all your important pages. Most CMS platforms can generate one automatically.",
        suggestion:
          "If using WordPress, install Yoast SEO or RankMath — they auto-generate sitemaps. For other platforms, create a sitemap.xml listing all your pages.",
        codeSnippet: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ctx.url}/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${ctx.url}/services</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${ctx.url}/contact</loc>
    <priority>0.8</priority>
  </url>
</urlset>`,
      };
    }

    case "https": {
      return {
        checkId: check.id,
        priority,
        title: "Enable HTTPS",
        impact: impactText,
        explanation:
          "HTTPS encrypts data between your site and visitors. Google considers HTTPS a ranking signal, and browsers mark non-HTTPS sites as 'Not Secure' — damaging trust.",
        suggestion:
          "Contact your hosting provider to enable SSL/TLS, or use Cloudflare (free tier) for automatic HTTPS. Most modern hosts offer free SSL via Let's Encrypt.",
      };
    }

    case "viewport": {
      return {
        checkId: check.id,
        priority,
        title: "Add Mobile Viewport Meta Tag",
        impact: impactText,
        explanation:
          "The viewport meta tag ensures your site displays correctly on mobile devices. Without it, mobile users see a tiny desktop version of your site, hurting usability and SEO.",
        suggestion: "Add the viewport meta tag to your page's <head> section.",
        codeSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
      };
    }

    case "favicon": {
      return {
        checkId: check.id,
        priority,
        title: "Add Favicon",
        impact: impactText,
        explanation:
          "A favicon is the small icon shown in browser tabs and bookmarks. It reinforces brand recognition and makes your site look professional.",
        suggestion:
          "Create a favicon from your logo (32x32px) and add it to your site's <head>.",
        codeSnippet: `<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
      };
    }

    case "response-time": {
      if (check.status === "fail") {
        return {
          checkId: check.id,
          priority,
          title: "Reduce Response Time",
          impact: impactText,
          explanation:
            "Your site takes over 3 seconds to respond. Slow sites rank lower and lose visitors — 53% of mobile users leave sites that take over 3 seconds.",
          suggestion:
            "Consider upgrading your hosting plan, enabling a CDN, removing blocking scripts, and optimizing large images.",
        };
      }
      // warn
      return {
        checkId: check.id,
        priority,
        title: "Improve Response Time",
        impact: impactText,
        explanation:
          "Your site responds in 1-3 seconds. While acceptable, faster is better for SEO and user experience. Aim for under 1 second.",
        suggestion:
          "Optimize images (use WebP format), enable browser caching, minify CSS/JS, and consider using a CDN like Cloudflare.",
      };
    }

    default:
      return null;
  }
}

export function calculatePotentialScore(checks: SeoCheckResult[]): {
  currentScore: number;
  potentialScore: number;
  potentialGrade: string;
} {
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const currentWeighted = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const currentScore = Math.round((currentWeighted / totalWeight) * 100);

  // If all warn/fail checks became pass
  const potentialWeighted = checks.reduce((sum, c) => sum + 1 * c.weight, 0);
  const potentialScore = Math.round((potentialWeighted / totalWeight) * 100);

  return {
    currentScore,
    potentialScore,
    potentialGrade: getLetterGrade(potentialScore),
  };
}
