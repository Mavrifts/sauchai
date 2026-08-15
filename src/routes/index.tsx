import { ClientOnly } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useState } from "react";

import { ReportSheet } from "@/components/cleanscan/ReportSheet";
import { StatusDot } from "@/components/cleanscan/StatusDot";
import { ToiletDetail } from "@/components/cleanscan/ToiletDetail";
import { TopNav } from "@/components/cleanscan/TopNav";
import { useFacilities } from "@/hooks/use-facilities";
import type { Facility } from "@/lib/cleanscan";

const ToiletMap = lazy(() => import("@/components/cleanscan/ToiletMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sauch.ai — Realtime toilet status, Jaipur" },
      {
        name: "description",
        content:
          "Sauch.ai catches Jaipur toilets that have been \"under repair\" for a month while officially marked fine. The gap between paperwork and pee.",
      },
      { property: "og:title", content: "Sauch.ai — Realtime toilet status, Jaipur" },
      {
        property: "og:description",
        content:
          "Sauch.ai catches Jaipur toilets that have been \"under repair\" for a month while officially marked fine. The gap between paperwork and pee.",
      },
    ],
  }),
  component: MapView,
});

function MapView() {
  const { data, isLoading, refetch } = useFacilities();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const [priorityZones, setPriorityZones] = useState(false);

  const facilities = data ?? [];
  const selected = facilities.find((f) => f.id === selectedId) ?? null;
  const flagged = facilities.filter((f) => f.status === "alert").length;

  function select(facility: Facility) {
    setSelectedId(facility.id);
    setReporting(false);
  }

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-surface">
      <div className="absolute inset-0">
        <ClientOnly fallback={<div className="h-full w-full bg-surface" />}>
          <Suspense fallback={<div className="h-full w-full bg-surface" />}>
            <ToiletMap
              facilities={facilities}
              selectedId={selectedId}
              priorityZones={priorityZones}
              onSelect={select}
            />
          </Suspense>
        </ClientOnly>
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="pointer-events-auto flex flex-col gap-3">
          <div className="card-surface px-4 py-3">
            <h1 className="text-[17px] font-semibold tracking-tight">CleanScan Jaipur</h1>
            <p className="mt-0.5 text-[13px] text-muted">
              {isLoading
                ? "Loading facilities"
                : `${facilities.length} public toilets · ${flagged} flagged`}
            </p>
          </div>
          <TopNav />
        </div>

        <button
          type="button"
          onClick={() => setPriorityZones((v) => !v)}
          aria-pressed={priorityZones}
          className="pointer-events-auto card-surface px-3.5 py-2 text-left text-[14px] font-medium"
          style={priorityZones ? { color: "var(--alert)" } : { color: "var(--muted)" }}
        >
          Show Priority Zones
        </button>
      </header>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] hidden justify-center p-4 sm:flex">
        <div className="card-surface pointer-events-auto flex gap-5 px-4 py-2.5 text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <StatusDot status="good" /> Verified working
          </span>
          <span className="flex items-center gap-2">
            <StatusDot status="warn" /> Unverified 14+ days
          </span>
          <span className="flex items-center gap-2">
            <StatusDot status="alert" /> Discrepancy
          </span>
        </div>
      </div>

      <Panel open={Boolean(selected)}>
        {selected &&
          (reporting ? (
            <ReportSheet
              facility={selected}
              onClose={() => setReporting(false)}
              onSubmitted={async () => {
                await refetch();
              }}
            />
          ) : (
            <ToiletDetail
              facility={selected}
              onClose={() => setSelectedId(null)}
              onReport={() => setReporting(true)}
            />
          ))}
      </Panel>
    </main>
  );
}

function Panel({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[600] transition-transform duration-300 ease-out sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[380px] sm:p-5"
      style={{
        transform: open ? "translate3d(0,0,0)" : undefined,
        pointerEvents: open ? "auto" : "none",
      }}
      data-open={open}
    >
      <div
        className="max-h-[82dvh] overflow-y-auto rounded-t-[12px] bg-card transition-transform duration-300 ease-out sm:h-full sm:max-h-none sm:rounded-[12px]"
        style={{
          boxShadow: "var(--shadow-sheet)",
          transform: open ? "translateY(0)" : "translateY(110%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
