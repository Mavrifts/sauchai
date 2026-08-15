import { StatusBadge } from "./StatusDot";
import { BulbIcon, CheckIcon, CloseIcon, CrossIcon, LockIcon, WaterIcon } from "./icons";
import { formatServiceDate, relativeTime, type Facility } from "@/lib/cleanscan";

function AspectRow({
  icon,
  label,
  ok,
}: {
  icon: React.ReactNode;
  label: string;
  ok: boolean | null;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="flex items-center gap-3 text-[15px] text-ink">
        <span className="text-muted">{icon}</span>
        {label}
      </span>
      {ok === null ? (
        <span className="text-[13px] text-muted">No data</span>
      ) : ok ? (
        <CheckIcon className="text-good" />
      ) : (
        <CrossIcon className="text-alert" />
      )}
    </div>
  );
}

export function ToiletDetail({
  facility,
  onClose,
  onReport,
}: {
  facility: Facility;
  onClose: () => void;
  onReport: () => void;
}) {
  const latest = facility.latest;

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-4 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-semibold leading-tight tracking-tight">{facility.name}</h2>
          <p className="mt-1 text-[14px] text-muted">{facility.area}, Jaipur</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-1 -mt-1 p-1 text-muted transition-opacity hover:opacity-60"
        >
          <CloseIcon />
        </button>
      </div>

      <StatusBadge status={facility.status} />

      <div className="divide-y divide-black/5">
        <AspectRow icon={<WaterIcon />} label="Water" ok={latest ? latest.water_available : null} />
        <AspectRow icon={<BulbIcon />} label="Lighting" ok={latest ? latest.lighting_ok : null} />
        <AspectRow icon={<LockIcon />} label="Door lock" ok={latest ? latest.door_functional : null} />
      </div>

      <div>
        <p className="label-xs">Last 5 reports</p>
        <div className="mt-2 divide-y divide-black/5">
          {facility.reports.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2 text-[15px]">
              <span>{relativeTime(r.created_at)}</span>
              <span className={r.overall_status === "broken" ? "text-alert" : "text-muted"}>
                {r.overall_status === "broken" ? "Broken" : "Working"}
              </span>
            </div>
          ))}
          {facility.reports.length === 0 && (
            <p className="py-2 text-[15px] text-muted">No citizen reports yet.</p>
          )}
        </div>
      </div>

      {facility.log && (
        <p className="text-[13px] leading-relaxed text-muted">
          Municipal record: marked {facility.log.official_status}, last serviced{" "}
          {formatServiceDate(facility.log.last_serviced_date)}.
        </p>
      )}

      <button
        type="button"
        onClick={onReport}
        className="w-full rounded-[12px] bg-ink py-3.5 text-[16px] font-medium text-surface transition-opacity hover:opacity-90"
      >
        Report This Toilet
      </button>
    </div>
  );
}
