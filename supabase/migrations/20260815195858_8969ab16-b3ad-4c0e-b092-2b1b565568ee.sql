CREATE TABLE public.toilets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  area text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.toilets TO anon;
GRANT SELECT ON public.toilets TO authenticated;
GRANT ALL ON public.toilets TO service_role;
ALTER TABLE public.toilets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Toilets are publicly readable" ON public.toilets FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  toilet_id uuid NOT NULL REFERENCES public.toilets(id) ON DELETE CASCADE,
  water_available boolean NOT NULL DEFAULT true,
  lighting_ok boolean NOT NULL DEFAULT true,
  door_functional boolean NOT NULL DEFAULT true,
  overall_status text NOT NULL DEFAULT 'working',
  reporter_id text NOT NULL DEFAULT 'anon',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX reports_toilet_created_idx ON public.reports (toilet_id, created_at DESC);
GRANT SELECT, INSERT ON public.reports TO anon;
GRANT SELECT, INSERT ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports are publicly readable" ON public.reports FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit a report" ON public.reports FOR INSERT TO anon, authenticated WITH CHECK (overall_status IN ('working','broken') AND length(reporter_id) <= 64);

CREATE TABLE public.maintenance_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  toilet_id uuid NOT NULL REFERENCES public.toilets(id) ON DELETE CASCADE,
  last_serviced_date date NOT NULL,
  official_status text NOT NULL DEFAULT 'working',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX maintenance_logs_toilet_idx ON public.maintenance_logs (toilet_id);
GRANT SELECT ON public.maintenance_logs TO anon;
GRANT SELECT ON public.maintenance_logs TO authenticated;
GRANT ALL ON public.maintenance_logs TO service_role;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maintenance logs are publicly readable" ON public.maintenance_logs FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.toilets (id,name,lat,lng,area) VALUES
('a0000000-1111-4111-8111-000000000001','MI Road Public Convenience',26.910972,75.79762,'MI Road'),
('a0000001-1111-4111-8111-000000000002','MI Road Community Toilet',26.918822,75.795738,'MI Road'),
('a0000002-1111-4111-8111-000000000003','MI Road Sulabh Complex',26.916061,75.802777,'MI Road'),
('a0000003-1111-4111-8111-000000000004','MI Road Market Toilet',26.904592,75.806178,'MI Road'),
('a0000004-1111-4111-8111-000000000005','MI Road Bus Stand Toilet',26.9041,75.804407,'MI Road'),
('a0000005-1111-4111-8111-000000000006','Malviya Nagar Public Convenience',26.840177,75.796177,'Malviya Nagar'),
('a0000006-1111-4111-8111-000000000007','Malviya Nagar Community Toilet',26.848688,75.813844,'Malviya Nagar'),
('a0000007-1111-4111-8111-000000000008','Malviya Nagar Sulabh Complex',26.841471,75.799358,'Malviya Nagar'),
('a0000008-1111-4111-8111-000000000009','Malviya Nagar Market Toilet',26.853558,75.816745,'Malviya Nagar'),
('a0000009-1111-4111-8111-00000000000a','Malviya Nagar Bus Stand Toilet',26.85235,75.80352,'Malviya Nagar'),
('a000000a-1111-4111-8111-00000000000b','Vaishali Nagar Public Convenience',26.92383,75.726118,'Vaishali Nagar'),
('a000000b-1111-4111-8111-00000000000c','Vaishali Nagar Community Toilet',26.921003,75.731951,'Vaishali Nagar'),
('a000000c-1111-4111-8111-00000000000d','Vaishali Nagar Sulabh Complex',26.903862,75.727827,'Vaishali Nagar'),
('a000000d-1111-4111-8111-00000000000e','Vaishali Nagar Market Toilet',26.907804,75.744587,'Vaishali Nagar'),
('a000000e-1111-4111-8111-00000000000f','Vaishali Nagar Bus Stand Toilet',26.904737,75.738958,'Vaishali Nagar'),
('a000000f-1111-4111-8111-000000000010','Sanganer Public Convenience',26.821334,75.786938,'Sanganer'),
('a0000010-1111-4111-8111-000000000011','Sanganer Community Toilet',26.819146,75.779507,'Sanganer'),
('a0000011-1111-4111-8111-000000000012','Sanganer Sulabh Complex',26.80743,75.782943,'Sanganer'),
('a0000012-1111-4111-8111-000000000013','Sanganer Market Toilet',26.82233,75.788262,'Sanganer'),
('a0000013-1111-4111-8111-000000000014','Sanganer Bus Stand Toilet',26.81354,75.792053,'Sanganer'),
('a0000014-1111-4111-8111-000000000015','Bagru Public Convenience',26.816876,75.545194,'Bagru'),
('a0000015-1111-4111-8111-000000000016','Bagru Community Toilet',26.825065,75.554776,'Bagru'),
('a0000016-1111-4111-8111-000000000017','Bagru Sulabh Complex',26.811858,75.551786,'Bagru'),
('a0000017-1111-4111-8111-000000000018','Bagru Market Toilet',26.818605,75.559003,'Bagru'),
('a0000018-1111-4111-8111-000000000019','Bagru Bus Stand Toilet',26.823507,75.544911,'Bagru'),
('a0000019-1111-4111-8111-00000000001a','C-Scheme Public Convenience',26.916524,75.788834,'C-Scheme'),
('a000001a-1111-4111-8111-00000000001b','C-Scheme Community Toilet',26.903035,75.804171,'C-Scheme'),
('a000001b-1111-4111-8111-00000000001c','C-Scheme Sulabh Complex',26.896648,75.797735,'C-Scheme'),
('a000001c-1111-4111-8111-00000000001d','C-Scheme Market Toilet',26.893941,75.802037,'C-Scheme'),
('a000001d-1111-4111-8111-00000000001e','C-Scheme Bus Stand Toilet',26.91135,75.799753,'C-Scheme'),
('a000001e-1111-4111-8111-00000000001f','Jagatpura Public Convenience',26.827011,75.85253,'Jagatpura'),
('a000001f-1111-4111-8111-000000000020','Jagatpura Community Toilet',26.822687,75.859265,'Jagatpura'),
('a0000020-1111-4111-8111-000000000021','Jagatpura Sulabh Complex',26.819917,75.855949,'Jagatpura'),
('a0000021-1111-4111-8111-000000000022','Jagatpura Market Toilet',26.826159,75.867672,'Jagatpura'),
('a0000022-1111-4111-8111-000000000023','Jagatpura Bus Stand Toilet',26.817378,75.86094,'Jagatpura'),
('a0000023-1111-4111-8111-000000000024','Mansarovar Public Convenience',26.845456,75.762836,'Mansarovar'),
('a0000024-1111-4111-8111-000000000025','Mansarovar Community Toilet',26.859531,75.769834,'Mansarovar'),
('a0000025-1111-4111-8111-000000000026','Mansarovar Sulabh Complex',26.863726,75.75283,'Mansarovar'),
('a0000026-1111-4111-8111-000000000027','Mansarovar Market Toilet',26.853259,75.762048,'Mansarovar'),
('a0000027-1111-4111-8111-000000000028','Mansarovar Bus Stand Toilet',26.844542,75.757081,'Mansarovar');

-- Seed reports: 9 toilets are deliberate discrepancies (5 silent for 30+ days, 4 actively reported broken),
-- 6 more are stale-but-officially-broken (amber), the rest are freshly verified working (green).
INSERT INTO public.reports (toilet_id, water_available, lighting_ok, door_functional, overall_status, reporter_id, created_at)
SELECT
  c.id,
  CASE WHEN st.status = 'working' THEN true ELSE (abs(hashtext(c.id::text || g::text || 'w')) % 3) <> 0 END,
  CASE WHEN st.status = 'working' THEN true ELSE (abs(hashtext(c.id::text || g::text || 'l')) % 3) <> 0 END,
  CASE WHEN st.status = 'working' THEN true ELSE (abs(hashtext(c.id::text || g::text || 'd')) % 3) <> 0 END,
  st.status,
  'seed-' || (abs(hashtext(c.id::text || g::text)) % 9000 + 1000)::text,
  now() - make_interval(days => st.days_ago, hours => abs(hashtext(c.id::text || g::text || 'h')) % 12)
FROM (
  SELECT t.id, t.kind, g
  FROM (
    SELECT id, name,
      CASE
        WHEN row_number() OVER (ORDER BY area, name) IN (1, 11, 21, 31, 39) THEN 'silent'
        WHEN row_number() OVER (ORDER BY area, name) IN (6, 16, 26, 36) THEN 'broken'
        WHEN row_number() OVER (ORDER BY area, name) % 7 = 3 THEN 'stale'
        ELSE 'fresh'
      END AS kind
    FROM public.toilets
  ) t, generate_series(0, 5) g
) c
CROSS JOIN LATERAL (
  SELECT
    CASE c.kind
      WHEN 'silent' THEN 32 + c.g * 5
      WHEN 'stale'  THEN 19 + c.g * 6
      ELSE 2 + c.g * 9
    END AS days_ago,
    CASE
      WHEN c.kind = 'broken' AND c.g <= 2 THEN 'broken'
      WHEN c.kind = 'silent' AND c.g = 0 THEN 'broken'
      WHEN (abs(hashtext(c.id::text || c.g::text || 's')) % 6) = 0 THEN 'broken'
      ELSE 'working'
    END AS status
) st;

-- Municipal records: discrepancy toilets are on paper "working"; stale ones are officially known broken.
INSERT INTO public.maintenance_logs (toilet_id, last_serviced_date, official_status)
SELECT t.id,
  (now() - make_interval(days => 4 + (abs(hashtext(t.id::text)) % 60)))::date,
  CASE WHEN t.kind = 'stale' THEN 'broken' ELSE 'working' END
FROM (
  SELECT id,
    CASE
      WHEN row_number() OVER (ORDER BY area, name) IN (1, 11, 21, 31, 39) THEN 'silent'
      WHEN row_number() OVER (ORDER BY area, name) IN (6, 16, 26, 36) THEN 'broken'
      WHEN row_number() OVER (ORDER BY area, name) % 7 = 3 THEN 'stale'
      ELSE 'fresh'
    END AS kind
  FROM public.toilets
) t;