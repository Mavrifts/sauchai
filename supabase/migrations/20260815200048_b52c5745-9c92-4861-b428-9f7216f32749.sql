WITH ranked AS (
  SELECT id, toilet_id, row_number() OVER (PARTITION BY toilet_id ORDER BY created_at DESC) rn
  FROM public.reports
), kinds AS (
  SELECT id AS toilet_id,
    CASE
      WHEN row_number() OVER (ORDER BY area, name) IN (1, 11, 21, 31, 39) THEN 'silent'
      WHEN row_number() OVER (ORDER BY area, name) IN (6, 16, 26, 36) THEN 'broken'
      WHEN row_number() OVER (ORDER BY area, name) % 7 = 3 THEN 'stale'
      ELSE 'fresh'
    END AS kind
  FROM public.toilets
)
UPDATE public.reports r
SET overall_status = 'working', water_available = true, lighting_ok = true, door_functional = true
FROM ranked, kinds
WHERE ranked.id = r.id
  AND ranked.rn = 1
  AND kinds.toilet_id = r.toilet_id
  AND kinds.kind = 'fresh'
  AND r.overall_status = 'broken';