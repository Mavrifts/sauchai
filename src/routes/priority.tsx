import { createFileRoute } from "@tanstack/react-router";

import { StatusDot } from "@/components/cleanscan/StatusDot";
import { TopNav } from "@/components/cleanscan/TopNav";
import { useFacilities } from "@/hooks/use-facilities";
import { priorityList } from "@/lib/cleanscan";

export const Route = createFileRoute("/priority")({
  head: () => ({
    meta: [
      { title: "Priority Repairs — CleanScan Jaipur" },
      {
        name: "description",
        content:
          "A municipal repair list for Jaipur's public toilets, sorted by how long each facility has been silently broken.",
      },
      { property: "og:title", content: "Priority Repairs — CleanScan Jaipur" },
      {
        property: "og:description",
        content: "Sorted by days silently broken, with discrepancies against municipal records flagged.",
      },
    ],
  }),
  component: PriorityView,
});

function PriorityView() {
  const { data, isLoading } = useFacilities();
  const rows = priorityList(data ?? []);
  const flagged = rows.filter((f) => f.status === "alert").length;

  return (
    <main className="min-h-[100dvh] bg-surface px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-[680px]">
        <TopNav />

        <h1 className="mt-8 text-[30px] font-semibold leading-tight tracking-tight sm:text-[34px]">
          Priority repairs
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          {isLoading
            ? "Loading facilities"
            : `${flagged} of ${rows.length} facilities contradict the municipal record. Longest silence first.`}
        </p>

        <div className="mt-8 divide-y divide-black/5">
          {rows.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate text-[16px] font-medium">{f.name}</p>
                <p className="mt-0.5 text-[13px] text-muted">{f.area}</p>
              </div>
              <div className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-[15px] tabular-nums text-muted">
                  {f.daysSilentlyBroken}d
                </span>
                {f.status === "alert" ? (
                  <StatusDot status="alert" size={9} />
                ) : (
                  <span className="inline-block w-[9px]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
