import * as cheerio from "cheerio";
import { getLetterGrade } from "./grading";
import type { SeoCheckResult } from "@/types";

export interface SeoCrawlResult {
  url: string;
  overallScore: number;
  letterGrade: string;
  responseTimeMs: number;
  checks: SeoCheckResult[];
}

function check(
  id: string,
  name: string,
  category: SeoCheckResult["category"],
  weight: number,
  status: SeoCheckResult["status"],
  message: string,
  details?: string
): SeoCheckResult {
  const score = status === "pass" ? 1 : status === "warn" ? 0.5 : 0;
  return { id, name, category, weight, status, score, message, details };
}

export async function runSeoCrawl(url: string): Promise<SeoCrawlResult> {
  // Normalize URL
  if (!url.startsWith("http")) url = `https://${url}`;
  const parsedUrl = new URL(url);
  const baseUrl = parsedUrl.origin;

  // Fetch page
  const start = performance.now();
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; EmbarkOS-SEO-Crawler/1.0)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  const responseTimeMs = Math.round(performance.now() - start);
  const html = await res.text();
  const $ = cheerio.load(html);

  const checks: SeoCheckResult[] = [];

  // 1. Meta Title
  const title = $("title").text().trim();
  if (!title) {
    checks.push(check("meta-title", "Meta Title", "meta", 10, "fail", "Missing title tag"));
  } else if (title.length >= 50 && title.length <= 60) {
    checks.push(check("meta-title", "Meta Title", "meta", 10, "pass", `Title found (${title.length} chars)`, title));
  } else {
    checks.push(check("meta-title", "Meta Title", "meta", 10, "warn", `Title length ${title.length} chars (ideal: 50-60)`, title));
  }

  // 2. Meta Description
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  if (!metaDesc) {
    checks.push(check("meta-desc", "Meta Description", "meta", 10, "fail", "Missing meta description"));
  } else if (metaDesc.length >= 150 && metaDesc.length <= 160) {
    checks.push(check("meta-desc", "Meta Description", "meta", 10, "pass", `Description found (${metaDesc.length} chars)`, metaDesc));
  } else {
    checks.push(check("meta-desc", "Meta Description", "meta", 10, "warn", `Description length ${metaDesc.length} chars (ideal: 150-160)`, metaDesc));
  }

  // 3. Open Graph Tags
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  if (ogCount === 3) {
    checks.push(check("og-tags", "Open Graph Tags", "meta", 5, "pass", "All OG tags present (title, description, image)"));
  } else if (ogCount > 0) {
    checks.push(check("og-tags", "Open Graph Tags", "meta", 5, "warn", `${ogCount}/3 OG tags present`));
  } else {
    checks.push(check("og-tags", "Open Graph Tags", "meta", 5, "fail", "No Open Graph tags found"));
  }

  // 4. H1 Tag
  const h1Count = $("h1").length;
  if (h1Count === 1) {
    checks.push(check("h1-tag", "H1 Tag", "content", 8, "pass", "Exactly one H1 tag", $("h1").first().text().trim()));
  } else if (h1Count > 1) {
    checks.push(check("h1-tag", "H1 Tag", "content", 8, "warn", `Multiple H1 tags found (${h1Count})`));
  } else {
    checks.push(check("h1-tag", "H1 Tag", "content", 8, "fail", "Missing H1 tag"));
  }

  // 5. Heading Hierarchy
  const h2Count = $("h2").length;
  const headings = $("h1, h2, h3, h4, h5, h6").toArray();
  let hasSkip = false;
  for (let i = 1; i < headings.length; i++) {
    const prev = parseInt(headings[i - 1].tagName.charAt(1));
    const curr = parseInt(headings[i].tagName.charAt(1));
    if (curr > prev + 1) {
      hasSkip = true;
      break;
    }
  }
  if (h2Count > 0 && !hasSkip) {
    checks.push(check("heading-hierarchy", "Heading Hierarchy", "content", 5, "pass", `${h2Count} H2 tags, logical order`));
  } else if (h2Count > 0 && hasSkip) {
    checks.push(check("heading-hierarchy", "Heading Hierarchy", "content", 5, "warn", `${h2Count} H2 tags but heading levels skip`));
  } else {
    checks.push(check("heading-hierarchy", "Heading Hierarchy", "content", 5, "fail", "No H2 tags found"));
  }

  // 6. Image Alt Text
  const images = $("img");
  const totalImages = images.length;
  if (totalImages === 0) {
    checks.push(check("img-alt", "Image Alt Text", "content", 8, "pass", "No images to check"));
  } else {
    const withAlt = images.filter((_, el) => {
      const alt = $(el).attr("alt");
      return alt !== undefined && alt.trim() !== "";
    }).length;
    const coverage = Math.round((withAlt / totalImages) * 100);
    if (coverage >= 90) {
      checks.push(check("img-alt", "Image Alt Text", "content", 8, "pass", `${coverage}% coverage (${withAlt}/${totalImages})`));
    } else if (coverage >= 50) {
      checks.push(check("img-alt", "Image Alt Text", "content", 8, "warn", `${coverage}% coverage (${withAlt}/${totalImages})`));
    } else {
      checks.push(check("img-alt", "Image Alt Text", "content", 8, "fail", `${coverage}% coverage (${withAlt}/${totalImages})`));
    }
  }

  // 7. Canonical URL
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical) {
    checks.push(check("canonical", "Canonical URL", "technical", 6, "pass", "Canonical tag present", canonical));
  } else {
    checks.push(check("canonical", "Canonical URL", "technical", 6, "fail", "Missing canonical tag"));
  }

  // 8. Schema.org / JSON-LD
  const jsonLdScripts = $('script[type="application/ld+json"]');
  let hasLocalBusiness = false;
  let hasAnyJsonLd = false;
  jsonLdScripts.each((_, el) => {
    hasAnyJsonLd = true;
    try {
      const data = JSON.parse($(el).html() ?? "");
      const types = Array.isArray(data) ? data.map((d: Record<string, unknown>) => d["@type"]) : [data["@type"]];
      for (const t of types) {
        if (typeof t === "string" && t.toLowerCase().includes("localbusiness")) {
          hasLocalBusiness = true;
        }
        // Also check @graph
        if (data["@graph"]) {
          for (const node of data["@graph"]) {
            if (typeof node["@type"] === "string" && node["@type"].toLowerCase().includes("localbusiness")) {
              hasLocalBusiness = true;
            }
          }
        }
      }
    } catch {
      // invalid JSON-LD
    }
  });
  if (hasLocalBusiness) {
    checks.push(check("schema-jsonld", "Schema.org/JSON-LD", "structured-data", 8, "pass", "LocalBusiness schema found"));
  } else if (hasAnyJsonLd) {
    checks.push(check("schema-jsonld", "Schema.org/JSON-LD", "structured-data", 8, "warn", "JSON-LD found but no LocalBusiness type"));
  } else {
    checks.push(check("schema-jsonld", "Schema.org/JSON-LD", "structured-data", 8, "fail", "No JSON-LD structured data found"));
  }

  // 9. Internal Links
  const links = $("a[href]");
  let internalCount = 0;
  let externalCount = 0;
  links.each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    try {
      const linkUrl = new URL(href, baseUrl);
      if (linkUrl.hostname === parsedUrl.hostname) {
        internalCount++;
      } else {
        externalCount++;
      }
    } catch {
      // relative links count as internal
      internalCount++;
    }
  });

  if (internalCount >= 5) {
    checks.push(check("internal-links", "Internal Links", "content", 5, "pass", `${internalCount} internal links found`));
  } else if (internalCount >= 1) {
    checks.push(check("internal-links", "Internal Links", "content", 5, "warn", `Only ${internalCount} internal links found`));
  } else {
    checks.push(check("internal-links", "Internal Links", "content", 5, "fail", "No internal links found"));
  }

  // 10. External Links
  if (externalCount >= 1) {
    checks.push(check("external-links", "External Links", "content", 3, "pass", `${externalCount} external links found`));
  } else {
    checks.push(check("external-links", "External Links", "content", 3, "fail", "No external links found"));
  }

  // 11. robots.txt
  try {
    const robotsRes = await fetch(`${baseUrl}/robots.txt`, {
      signal: AbortSignal.timeout(5000),
    });
    if (robotsRes.ok) {
      checks.push(check("robots-txt", "robots.txt", "technical", 6, "pass", "robots.txt found"));
    } else {
      checks.push(check("robots-txt", "robots.txt", "technical", 6, "fail", `robots.txt returned ${robotsRes.status}`));
    }
  } catch {
    checks.push(check("robots-txt", "robots.txt", "technical", 6, "fail", "robots.txt not accessible"));
  }

  // 12. sitemap.xml
  try {
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`, {
      signal: AbortSignal.timeout(5000),
    });
    if (sitemapRes.ok) {
      checks.push(check("sitemap-xml", "sitemap.xml", "technical", 6, "pass", "sitemap.xml found"));
    } else {
      checks.push(check("sitemap-xml", "sitemap.xml", "technical", 6, "fail", `sitemap.xml returned ${sitemapRes.status}`));
    }
  } catch {
    checks.push(check("sitemap-xml", "sitemap.xml", "technical", 6, "fail", "sitemap.xml not accessible"));
  }

  // 13. HTTPS
  if (parsedUrl.protocol === "https:" || res.url?.startsWith("https://")) {
    checks.push(check("https", "HTTPS", "technical", 8, "pass", "Site uses HTTPS"));
  } else {
    checks.push(check("https", "HTTPS", "technical", 8, "fail", "Site does not use HTTPS"));
  }

  // 14. Mobile Viewport
  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport) {
    checks.push(check("viewport", "Mobile Viewport", "technical", 6, "pass", "Viewport meta tag present", viewport));
  } else {
    checks.push(check("viewport", "Mobile Viewport", "technical", 6, "fail", "Missing viewport meta tag"));
  }

  // 15. Favicon
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;
  if (favicon) {
    checks.push(check("favicon", "Favicon", "technical", 3, "pass", "Favicon found"));
  } else {
    checks.push(check("favicon", "Favicon", "technical", 3, "fail", "No favicon found"));
  }

  // 16. Response Time
  if (responseTimeMs < 1000) {
    checks.push(check("response-time", "Response Time", "technical", 3, "pass", `${responseTimeMs}ms`));
  } else if (responseTimeMs <= 3000) {
    checks.push(check("response-time", "Response Time", "technical", 3, "warn", `${responseTimeMs}ms (ideal: <1s)`));
  } else {
    checks.push(check("response-time", "Response Time", "technical", 3, "fail", `${responseTimeMs}ms (too slow)`));
  }

  // Calculate overall score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  const overallScore = Math.round((weightedScore / totalWeight) * 100);
  const letterGrade = getLetterGrade(overallScore);

  return {
    url,
    overallScore,
    letterGrade,
    responseTimeMs,
    checks,
  };
}
