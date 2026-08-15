UPDATE public.reports
SET water_available = CASE WHEN (abs(hashtext(id::text)) % 3) = 0 THEN false ELSE water_available END,
    lighting_ok = CASE WHEN (abs(hashtext(id::text)) % 3) = 1 THEN false ELSE lighting_ok END,
    door_functional = CASE WHEN (abs(hashtext(id::text)) % 3) = 2 THEN false ELSE door_functional END
WHERE overall_status = 'broken'
  AND water_available AND lighting_ok AND door_functional;