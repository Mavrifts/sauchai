import { useState } from "react";

import { CheckIcon } from "./icons";
import { supabase } from "@/integrations/supabase/client";
import { getReporterId, type Facility } from "@/lib/cleanscan";

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[15px]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className="relative h-[30px] w-[50px] rounded-full transition-colors"
        style={{ backgroundColor: value ? "var(--good)" : "rgba(138,138,142,0.35)" }}
      >
        <span
          className="absolute top-[3px] h-6 w-6 rounded-full bg-card transition-[left]"
          style={{ left: value ? 23 : 3, boxShadow: "var(--shadow-soft)" }}
        />
      </button>
    </div>
  );
}

export function ReportSheet({
  facility,
  onClose,
  onSubmitted,
}: {
  facility: Facility;
  onClose: () => void;
  onSubmitted: () => Promise<void> | void;
}) {
  const [water, setWater] = useState(true);
  const [lighting, setLighting] = useState(true);
  const [door, setDoor] = useState(true);
  const [status, setStatus] = useState<"working" | "broken">("working");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit() {
    setState("saving");
    const { error } = await supabase.from("reports").insert({
      toilet_id: facility.id,
      water_available: water,
      lighting_ok: lighting,
      door_functional: door,
      overall_status: status,
      reporter_id: getReporterId(),
    });
    if (error) {
      setState("error");
      return;
    }
    setState("done");
    await onSubmitted();
    window.setTimeout(onClose, 1000);
  }

  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-5 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight">Report</h2>
          <p className="mt-1 text-[14px] text-muted">{facility.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[15px] text-muted transition-opacity hover:opacity-60"
        >
          Cancel
        </button>
      </div>

      <div className="divide-y divide-black/5">
        <Toggle label="Water" value={water} onChange={setWater} />
        <Toggle label="Lighting" value={lighting} onChange={setLighting} />
        <Toggle label="Door" value={door} onChange={setDoor} />
      </div>


      <div>
        <p className="label-xs">Overall</p>
        <div
          className="mt-2 grid grid-cols-2 gap-1 rounded-[12px] p-1"
          style={{ backgroundColor: "rgba(138,138,142,0.12)" }}
        >
          {(["working", "broken"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className="rounded-[9px] py-2 text-[15px] font-medium capitalize transition-colors"
              style={
                status === option
                  ? { backgroundColor: "var(--card)", color: "var(--ink)", boxShadow: "var(--shadow-soft)" }
                  : { color: "var(--muted)" }
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={state === "saving" || state === "done"}
        onClick={submit}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-ink py-3.5 text-[16px] font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-100"
      >
        {state === "done" ? (
          <>
            <CheckIcon className="text-good" /> Submitted
          </>
        ) : state === "saving" ? (
          "Submitting"
        ) : (
          "Submit Report"
        )}
      </button>

      {state === "error" && (
        <p className="text-[13px] text-alert">Could not submit. Please try again.</p>
      )}
    </div>

  );
}
