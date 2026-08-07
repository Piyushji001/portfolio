import { SpeedInsights } from "@vercel/speed-insights/react";
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

export function App() {
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
      <SpeedInsights />
    </div>
  );
}

export default App;
