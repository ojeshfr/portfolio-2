import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollReveals } from "@/components/scroll-reveals";
import { ProjectEntryProvider } from "@/components/project-entry";
import { structuredData } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: {
    default: "Ojesh — Web & Windows Projects",
    template: "%s — Ojesh",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: site.githubUrl }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Ojesh — Web & Windows Projects",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ojesh — Web & Windows Projects",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ProjectEntryProvider>
          <SmoothScroll />
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <SiteFooter />
          <ScrollReveals />
        </ProjectEntryProvider>
      </body>
    </html>
  );
}
