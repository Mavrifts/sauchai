# Sauchai

ROLE

You are a senior product designer and full-stack engineer at a studio known for shipping restrained, high-trust civic-tech products — think the calm confidence of Apple Health or Citymapper, not a typical hackathon dashboard. You have been hired to build CleanScan, a real-time public sanitation trust tool for Jaipur, and you care as much about what you leave out as what you put in.

PRODUCT CONTEXT

CleanScan lets citizens check in on public toilets and rate specific functional aspects (water, lighting, door lock, overall status). The system cross-references crowd reports against official municipal maintenance logs to expose facilities that are silently broken but marked "working" on paper — a discrepancy engine that gives municipalities a prioritized repair list.

This is a hackathon demo. It will be judged in under 3 minutes, live, on a laptop and possibly a phone. Every screen must read clearly at a glance, with zero onboarding needed.

DESIGN DIRECTION — READ CAREFULLY

Philosophy: "less, but better." Every element on screen must earn its place. If a screen has more than one visual focal point, cut until it doesn't.

Avoid, explicitly:

Do NOT use a dark near-black background with a single neon/acid-green or vermilion accent — this is the generic "AI hackathon dashboard" look and judges have seen it 40 times tonight.

Do NOT use a warm cream background with terracotta accents (#D97757-ish) — also an overused AI-default look.

No gradient buttons, no glassmorphism, no glowing borders, no neon pins on the map, no cyberpunk/sci-fi styling (explicitly avoid the neon-on-black look from the problem-statement site itself — this app should feel like the opposite: calm, clinical, trustworthy).

No stock "dashboard" clichés: no fake KPI cards with big numbers and tiny arrows, no sidebar with 8 nav icons, no default shadcn look-and-feel left unstyled.

No more than one accent color used for status/alerts. Everything else stays in a tight neutral range.

No decorative animation. Motion only where it clarifies state change (a pin updating, a score recalculating).

Adopt instead — Apple Health / Apple Maps inspired system:

Background: near-white, slightly warm off-white (#FAFAF8) for light mode. Generous negative space. Content breathes.

Type: one confident sans-serif for everything (system font stack: -apple-system, SF Pro fallback, Inter as web fallback). Use weight and size to create hierarchy — not color, not boxes. Large, quiet headlines. Small, precise labels in a muted grey (#8A8A8E).

Color system (name these exactly, use nowhere else):

--ink: #1C1C1E (primary text)

--muted: #8A8A8E (secondary text, labels)

--surface: #FAFAF8 (background)

--card: #FFFFFF (elevated surface, subtle shadow only, no border)

--good: #34C759 (working / verified — used ONLY for status, never decoratively)

--warn: #FF9F0A (unverified / stale)

--alert: #FF3B30 (discrepancy flagged — this is your one loud color, use it sparingly so it means something when it appears)

Map pins: small, flat, circular dots — not skeuomorphic pin-drop icons. Color is the only signal. On tap, a soft card slides up from the bottom (mobile) or appears as a side panel (desktop) — no modal popups with drop shadows and close buttons.

Cards & spacing: no visible borders. Separation comes from whitespace and very subtle shadow (0 1px 3px rgba(0,0,0,0.06)). Rounded corners, consistent radius (12px), used consistently everywhere.

Iconography: minimal line icons (water drop, bulb, lock) — one weight, one size system, never filled/colored except to indicate status.

The signature moment: the Priority Repair Dashboard should feel like an Apple Health "trends" screen — a clean sorted list, each row showing the toilet name, how many days it's been silently broken, and a single red dot if it's a discrepancy. No chart junk. The sorting itself tells the story.

OBJECTIVES

A judge should understand what the app does within 5 seconds of seeing the map screen — no explanation needed.

The discrepancy engine (crowd data vs. official logs) must visually stand out as the "smart" part of the product, without needing you to explain it out loud.

The whole app must feel like a real, shippable public-sector product — not a hackathon prototype.

DATA MODEL

Use Supabase. Three tables:

toilets
- id (uuid, pk)
- name (text)
- lat (float)
- lng (float)
- area (text)

reports
- id (uuid, pk)
- toilet_id (fk -> toilets.id)
- water_available (boolean)
- lighting_ok (boolean)
- door_functional (boolean)
- overall_status (text: 'working' | 'broken')
- created_at (timestamp)
- reporter_id (text) -- random anon ID, generated client-side, stored in localStorage

maintenance_logs
- id (uuid, pk)
- toilet_id (fk -> toilets.id)
- last_serviced_date (date)
- official_status (text: 'working' | 'broken')

TASKS — BUILD THESE 4 SCREENS, IN THIS ORDER

1. Map view (default landing screen)

Full-screen map (Leaflet.js), minimal light-mode map tiles (no default Google-blue styling — use a muted/monochrome tile style if available, e.g. CartoDB Positron).

Small flat circular dots per toilet, colored by status:

Green = working, verified within 14 days

Amber = unverified 14+ days, no discrepancy

Red = discrepancy flagged (official log says working, but crowd reports show broken or silence 14+ days)

Tapping a pin slides up a clean detail card (see screen 2).

A single toggle top-right: "Show Priority Zones" (see constraint below on this being simple, not a new feature).

2. Toilet detail panel

Toilet name, area, current status badge (colored dot + word, e.g. "● Discrepancy").

Three small rows: Water, Lighting, Door — each with a simple check/cross icon reflecting the most recent report.

"Last 5 reports" as a minimal list: relative time (e.g. "3 days ago") + overall status.

Official maintenance log shown as a single muted line: "Municipal record: marked working, last serviced [date]" — this juxtaposition next to crowd data IS the discrepancy reveal. Let the contrast speak for itself, don't over-design it.

One button: "Report This Toilet" — full width, ink-colored, rounded, no gradient.

3. Report form

Opens as a bottom sheet (mobile) / side panel (desktop), not a separate page.

Three toggles: Water available / Lighting OK / Door functional.

One segmented control: Working / Broken.

Submit button. On submit, sheet closes, map pin updates color live, small unobtrusive confirmation (no toast notification with icon and shadow — just a quiet inline checkmark state on the button for 1 second).

No login. Generate a UUID on first visit, store in localStorage, reuse as reporter_id silently.

4. Priority Repair Dashboard (separate view, accessed via a simple top-nav toggle between "Map" and "Priority List")

Clean sorted list (not cards, not a table with gridlines) — each row: toilet name, area, days silently broken, red dot if discrepancy.

Sorted by longest-silently-broken first.

This is the screen you show judges last, after showing the map — it's the "so what" payoff.

SEED DATA

Generate 40 toilets across real Jaipur neighborhoods: MI Road, Malviya Nagar, Vaishali Nagar, Sanganer, Bagru, C-Scheme, Jagatpura, Mansarovar. Use plausible real lat/lng coordinates for each area.

Generate 5–8 crowd reports per toilet with timestamps spread across the last 60 days.

Generate matching maintenance_logs — but deliberately set 8–10 toilets to official_status = 'working' while their most recent crowd reports show 'broken' or have gone silent for 14+ days. These 8–10 are your demo discrepancies. Make sure at least 3 of them are in different, spread-out neighborhoods so the map looks convincing, not clustered.

CONSTRAINTS

Mobile-responsive is mandatory — assume a judge might view this on a phone.

No login/auth flow of any kind. Anonymous only.

No animation beyond: pin color transitions, bottom sheet slide-up, and the report-submit confirmation. Nothing else moves.

Keep the entire color palette to the 6 named hex values above. Do not introduce new colors, including in charts, buttons, or icons.

Do not add extra screens, extra nav items, or extra "features" beyond the 4 listed. Resist scope creep — a judge remembers one sharp idea, not five half-built ones.

EFFICIENCY NOTE

Build screen 1 (map) and its Supabase connection first, confirm it renders real seeded data, before building screens 2–4. Do not scaffold all four screens empty and fill them in later — build and verify one at a time in this exact order: Map → Detail Panel → Report Form → Priority Dashboard.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sauchai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/02d31457-27e8-4ff6-a5e3-ca09b099b40f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
