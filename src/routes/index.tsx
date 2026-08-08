import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/data/content";
import { GridOverlay } from "@/components/GridOverlay";
import { LeftRail } from "@/components/LeftRail";
import { Hero } from "@/components/sections/Hero";
import { SystemOverview } from "@/components/sections/SystemOverview";
import { Stack } from "@/components/sections/Stack";
import { DeploymentLog } from "@/components/sections/DeploymentLog";
import { IncidentReport } from "@/components/sections/IncidentReport";
import { Architecture } from "@/components/sections/Architecture";
import { Endpoints } from "@/components/sections/Endpoints";
import { CommandPalette, PaletteHint } from "@/components/CommandPalette";
import { Terminal } from "@/components/Terminal";
import { CustomCursor } from "@/components/CustomCursor";
import { MouseSpotlight } from "@/components/MouseSpotlight";

const TITLE = "Piyush Sharma — DevOps Engineer";
const DESCRIPTION =
  "DevOps engineer in Jaipur. Multi-cloud infrastructure, CI/CD, Kubernetes and observability. Cut cloud spend 60% and recovered a compromised AWS account in four hours.";
const OG_IMAGE =
  "https://project--d20c25b4-25fb-465a-b552-bf0a9de6bf55.lovable.app/og.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.role,
          email: `mailto:${profile.email}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Jaipur",
            addressRegion: "Rajasthan",
            addressCountry: "IN",
          },
          sameAs: [profile.linkedin, profile.github].filter((u) => u !== ""),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-bg text-text">
      <GridOverlay />
      <LeftRail />

      <div className="relative z-10 lg:pl-[220px]">
        <main className="shell">
          <Hero />
          <SystemOverview />
          <Stack />
          <DeploymentLog />
          <IncidentReport />
          <Architecture />
          <Endpoints />
        </main>
      </div>

      <PaletteHint />
      <CommandPalette />
      <Terminal />
      <CustomCursor />
      <MouseSpotlight />
    </div>
  );
}
