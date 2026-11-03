import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=== DIGITAL TAQWA — SEO, AEO & GEO AUDIT ===");

let passed = true;

function check(name, condition, errorMsg) {
  if (condition) {
    console.log(`[PASS] ${name}`);
  } else {
    console.error(`[FAIL] ${name}: ${errorMsg}`);
    passed = false;
  }
}

// 1. Robots.txt
const robotsCode = fs.readFileSync(path.join(rootDir, "src/app/robots.ts"), "utf8");
check(
  "robots.ts uses canonical domain https://digitaltaqwa.site",
  robotsCode.includes("https://digitaltaqwa.site"),
  "robots.ts does not use canonical domain"
);
check(
  "robots.ts disallows /admin, /admin/*, /api, /api/*",
  robotsCode.includes('"/admin"') && robotsCode.includes('"/admin/*"') && robotsCode.includes('"/api/*"'),
  "robots.ts missing admin/api disallow rules"
);
check(
  "robots.ts allows /, /privacy, /terms",
  robotsCode.includes('"/"') && robotsCode.includes('"/privacy"') && robotsCode.includes('"/terms"'),
  "robots.ts missing public page allow rules"
);

// 2. Sitemap.ts
const sitemapCode = fs.readFileSync(path.join(rootDir, "src/app/sitemap.ts"), "utf8");
check(
  "sitemap.ts uses canonical domain https://digitaltaqwa.site",
  sitemapCode.includes("https://digitaltaqwa.site"),
  "sitemap.ts does not use canonical domain"
);
check(
  "sitemap.ts includes /, /privacy, /terms",
  sitemapCode.includes('url: `${canonicalUrl}/`') &&
  sitemapCode.includes('url: `${canonicalUrl}/privacy`') &&
  sitemapCode.includes('url: `${canonicalUrl}/terms`'),
  "sitemap.ts missing canonical routes"
);

// 3. Layout Metadata & Canonical
const layoutCode = fs.readFileSync(path.join(rootDir, "src/app/layout.tsx"), "utf8");
check(
  "layout.tsx metadataBase is https://digitaltaqwa.site",
  layoutCode.includes('metadataBase: new URL("https://digitaltaqwa.site")'),
  "layout.tsx metadataBase mismatch"
);
check(
  "layout.tsx has canonical alternate https://digitaltaqwa.site",
  layoutCode.includes('canonical: "https://digitaltaqwa.site"'),
  "layout.tsx missing canonical alternate"
);
check(
  "layout.tsx includes JsonLd structured data component",
  layoutCode.includes("<JsonLd />"),
  "layout.tsx missing JsonLd"
);

// 4. Structured Data (JsonLd.tsx)
const jsonLdCode = fs.readFileSync(path.join(rootDir, "src/components/JsonLd.tsx"), "utf8");
check(
  "JsonLd includes Organization schema with Barakah Habits Daily parent",
  jsonLdCode.includes('"@type": "Organization"') && jsonLdCode.includes("Barakah Habits Daily"),
  "JsonLd missing Organization or parent organization"
);
check(
  "JsonLd includes WebSite schema",
  jsonLdCode.includes('"@type": "WebSite"'),
  "JsonLd missing WebSite schema"
);
check(
  "JsonLd includes FAQPage schema with authentic questions",
  jsonLdCode.includes('"@type": "FAQPage"') && jsonLdCode.includes("What is Digital Taqwa and who is behind it?"),
  "JsonLd missing FAQPage schema"
);

// 5. Admin Protection
const adminLayout = fs.readFileSync(path.join(rootDir, "src/app/admin/layout.tsx"), "utf8");
check(
  "admin/layout.tsx has strict noindex, nofollow robots metadata",
  adminLayout.includes("index: false") && adminLayout.includes("follow: false"),
  "admin/layout.tsx missing noindex robots tag"
);

// 6. Public Pages Metadata & Canonical
const homeCode = fs.readFileSync(path.join(rootDir, "src/app/page.tsx"), "utf8");
const privacyCode = fs.readFileSync(path.join(rootDir, "src/app/privacy/page.tsx"), "utf8");
const termsCode = fs.readFileSync(path.join(rootDir, "src/app/terms/page.tsx"), "utf8");

check(
  "page.tsx specifies canonical https://digitaltaqwa.site",
  homeCode.includes('canonical: "https://digitaltaqwa.site"'),
  "page.tsx missing canonical"
);
check(
  "privacy/page.tsx specifies canonical https://digitaltaqwa.site/privacy",
  privacyCode.includes('canonical: "https://digitaltaqwa.site/privacy"'),
  "privacy/page.tsx missing canonical"
);
check(
  "terms/page.tsx specifies canonical https://digitaltaqwa.site/terms",
  termsCode.includes('canonical: "https://digitaltaqwa.site/terms"'),
  "terms/page.tsx missing canonical"
);
check(
  "privacy/page.tsx has BreadcrumbList JSON-LD",
  privacyCode.includes('"@type": "BreadcrumbList"'),
  "privacy/page.tsx missing BreadcrumbList"
);
check(
  "terms/page.tsx has BreadcrumbList JSON-LD",
  termsCode.includes('"@type": "BreadcrumbList"'),
  "terms/page.tsx missing BreadcrumbList"
);

// 7. Real Brand Assets Verification
const publicDir = path.join(rootDir, "public");
check("logo.png exists in public/", fs.existsSync(path.join(publicDir, "logo.png")), "Missing logo.png");
check("logo-icon.png exists in public/", fs.existsSync(path.join(publicDir, "logo-icon.png")), "Missing logo-icon.png");
check(
  "barakah-habits-logo.jpg exists in public/",
  fs.existsSync(path.join(publicDir, "barakah-habits-logo.jpg")),
  "Missing barakah-habits-logo.jpg"
);

// 8. 404 Page Verification
const notFoundCode = fs.readFileSync(path.join(rootDir, "src/app/not-found.tsx"), "utf8");
check(
  "not-found.tsx has noindex robots metadata",
  notFoundCode.includes("index: false"),
  "not-found.tsx should have noindex metadata"
);

if (passed) {
  console.log("\nALL SEO, AEO & GEO AUDIT CHECKS PASSED!");
  process.exit(0);
} else {
  console.error("\nSOME AUDIT CHECKS FAILED.");
  process.exit(1);
}

