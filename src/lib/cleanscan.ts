export type Toilet = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area: string;
};

export type Report = {
  id: string;
  toilet_id: string;
  water_available: boolean;
  lighting_ok: boolean;
  door_functional: boolean;
  overall_status: string;
  created_at: string;
};

export type MaintenanceLog = {
  toilet_id: string;
  last_serviced_date: string;
  official_status: string;
};

export type Status = "good" | "warn" | "alert";

export type Facility = Toilet & {
  reports: Report[];
  latest: Report | null;
  log: MaintenanceLog | null;
  daysSinceReport: number | null;
  status: Status;
  daysSilentlyBroken: number;
};

export const STATUS_LABEL: Record<Status, string> = {
  good: "Verified",
  warn: "Unverified",
  alert: "Discrepancy",
};

export const STATUS_COLOR: Record<Status, string> = {
  good: "var(--good)",
  warn: "var(--warn)",
  alert: "var(--alert)",
};

const DAY = 86_400_000;
const STALE_DAYS = 14;

export function daysAgo(iso: string, now = Date.now()): number {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / DAY));
}

export function relativeTime(iso: string, now = Date.now()): string {
  const d = daysAgo(iso, now);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
  const m = Math.round(d / 30);
  return m <= 1 ? "1 month ago" : `${m} months ago`;
}

export function formatServiceDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Days the facility has been broken (or unheard from) without the record reflecting it. */
function silentDays(reports: Report[], now: number): number {
  const latest = reports[0];
  if (!latest) return STALE_DAYS;
  const since = daysAgo(latest.created_at, now);
  if (latest.overall_status !== "broken") return since;
  let start: Report = latest;
  for (const r of reports) {
    if (r.overall_status !== "broken") break;
    start = r;
  }
  return daysAgo(start.created_at, now);
}

export function buildFacilities(
  toilets: Toilet[],
  reports: Report[],
  logs: MaintenanceLog[],
  now = Date.now(),
): Facility[] {
  const byToilet = new Map<string, Report[]>();
  for (const r of reports) {
    const list = byToilet.get(r.toilet_id) ?? [];
    list.push(r);
    byToilet.set(r.toilet_id, list);
  }
  for (const list of byToilet.values()) {
    list.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const logByToilet = new Map(logs.map((l) => [l.toilet_id, l]));

  return toilets.map((t) => {
    const own = byToilet.get(t.id) ?? [];
    const latest = own[0] ?? null;
    const log = logByToilet.get(t.id) ?? null;
    const daysSinceReport = latest ? daysAgo(latest.created_at, now) : null;
    const stale = daysSinceReport === null || daysSinceReport >= STALE_DAYS;
    const crowdBroken = latest?.overall_status === "broken";
    const officiallyWorking = log?.official_status === "working";

    const status: Status = officiallyWorking && (crowdBroken || stale)
      ? "alert"
      : stale
        ? "warn"
        : "good";

    return {
      ...t,
      reports: own,
      latest,
      log,
      daysSinceReport,
      status,
      daysSilentlyBroken: silentDays(own, now),
    };
  });
}

export function priorityList(facilities: Facility[]): Facility[] {
  return [...facilities].sort((a, b) => {
    const rank = (f: Facility) => (f.status === "alert" ? 0 : f.status === "warn" ? 1 : 2);
    return rank(a) - rank(b) || b.daysSilentlyBroken - a.daysSilentlyBroken;
  });
}

const STORAGE_KEY = "cleanscan.reporter_id";

export function getReporterId(): string {
  if (typeof window === "undefined") return "anon";
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
