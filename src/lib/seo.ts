import type { Metadata } from "next";
import { site } from "./site";

/** Served by `src/app/opengraph-image.png`. A page that sets its own `openGraph` would otherwise lose it. */
const SHARE_IMAGE = "/opengraph-image.png";

/** Page metadata with a canonical path and matching share titles, so links
 * shared from any page preview with that page's own title and description. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const shareTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, title: shareTitle, description, url: path, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [SHARE_IMAGE] },
  };
}

/** Schema.org description of the site and its owner. Only verified, already
 * public facts: name, public email, GitHub profile, languages and country. */
export function structuredData() {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      name: site.name,
      email: `mailto:${site.contactEmail}`,
      sameAs: [site.githubUrl],
      knowsAbout: ["TypeScript", "C#", "Next.js", "Windows desktop software", "Web development"],
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      ...(site.hasPublicOrigin ? { url: site.origin } : {}),
    },
    { "@type": "WebSite", name: site.name, description: site.description, ...(site.hasPublicOrigin ? { url: site.origin } : {}) },
  ];
  // "<" is escaped so the JSON can never close the script element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\u003c");
}
