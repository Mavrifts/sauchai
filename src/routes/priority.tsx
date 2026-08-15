import { createFileRoute } from "@tanstack/react-router";

import { StatusDot } from "@/components/cleanscan/StatusDot";
import { TopNav } from "@/components/cleanscan/TopNav";
import { useFacilities } from "@/hooks/use-facilities";
import {
  formatServiceDate,
  priorityList,
  relativeTime,
  STATUS_LABEL,
  type Facility,
} from "@/lib/cleanscan";

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

function brokenShare(f: Facility) {
  const recent = f.reports.slice(0, 5);
  return {
    broken: recent.filter((r) => r.overall_status === "broken").length,
    total: recent.length,
  };
}

function Row({ facility, rank }: { facility: Facility; rank: number }) {
  const { broken, total } = brokenShare(facility);
  const flagged = facility.status === "alert";

  return (
    <li className="flex gap-4 py-5">
      <span className="mt-0.5 w-5 shrink-0 text-[13px] tabular-nums text-muted">{rank}</span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <p className="truncate text-[16px] font-medium">{facility.name}</p>
          <span className="shrink-0 text-[15px] tabular-nums">
            {facility.daysSilentlyBroken}d
          </span>
        </div>

        <p className="mt-0.5 text-[13px] text-muted">{facility.area}</p>

        <div className="mt-2.5 flex items-center gap-2 text-[13px]">
          <StatusDot status={facility.status} size={8} />
          <span className="font-medium">{STATUS_LABEL[facility.status]}</span>
          <span className="text-muted">
            ·{" "}
            {total === 0
              ? "no citizen reports"
              : `${broken} of last ${total} reports broken`}
          </span>
        </div>

        <p className="mt-1.5 text-[13px] text-muted">
          {facility.log
            ? `Municipal record: marked ${facility.log.official_status}, last serviced ${formatServiceDate(
                facility.log.last_serviced_date,
              )}`
            : "Municipal record: none on file"}
          {facility.latest ? ` · last citizen report ${relativeTime(facility.latest.created_at).toLowerCase()}` : ""}
        </p>

        {flagged && (
          <p className="mt-1.5 text-[13px]" style={{ color: "var(--alert)" }}>
            Marked working on paper for {facility.daysSilentlyBroken} days of citizen-reported failure.
          </p>
        )}
      </div>
    </li>
  );
}

function PriorityView() {
  const { data, isLoading } = useFacilities();
  const rows = priorityList(data ?? []);
  const flagged = rows.filter((f) => f.status === "alert");
  const rest = rows.filter((f) => f.status !== "alert");

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
            : `${flagged.length} of ${rows.length} facilities contradict the municipal record. Longest silence first.`}
        </p>

        {flagged.length > 0 && (
          <section className="mt-9">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
              Repair first · discrepancies
            </h2>
            <ul className="mt-1 divide-y divide-black/5">
              {flagged.map((f, i) => (
                <Row key={f.id} facility={f} rank={i + 1} />
              ))}
            </ul>
          </section>
        )}

        {rest.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
              Monitoring
            </h2>
            <ul className="mt-1 divide-y divide-black/5">
              {rest.map((f, i) => (
                <Row key={f.id} facility={f} rank={flagged.length + i + 1} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
