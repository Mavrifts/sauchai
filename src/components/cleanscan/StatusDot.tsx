import { STATUS_COLOR, STATUS_LABEL, type Status } from "@/lib/cleanscan";

export function StatusDot({ status, size = 8 }: { status: Status; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, backgroundColor: STATUS_COLOR[status] }}
    />
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-2 text-[15px] font-medium">
      <StatusDot status={status} size={9} />
      {STATUS_LABEL[status]}
    </span>
  );
}
