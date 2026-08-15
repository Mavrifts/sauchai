import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import {
  buildFacilities,
  type Facility,
  type MaintenanceLog,
  type Report,
  type Toilet,
} from "@/lib/cleanscan";

export const facilitiesQueryKey = ["facilities"] as const;

async function fetchFacilities(): Promise<Facility[]> {
  const [toilets, reports, logs] = await Promise.all([
    supabase.from("toilets").select("id,name,lat,lng,area").order("name"),
    supabase
      .from("reports")
      .select("id,toilet_id,water_available,lighting_ok,door_functional,overall_status,created_at")
      .order("created_at", { ascending: false })
      .limit(2000),
    supabase.from("maintenance_logs").select("toilet_id,last_serviced_date,official_status"),
  ]);

  const error = toilets.error ?? reports.error ?? logs.error;
  if (error) throw error;

  return buildFacilities(
    (toilets.data ?? []) as Toilet[],
    (reports.data ?? []) as Report[],
    (logs.data ?? []) as MaintenanceLog[],
  );
}

export function useFacilities() {
  return useQuery({
    queryKey: facilitiesQueryKey,
    queryFn: fetchFacilities,
    staleTime: 30_000,
  });
}
