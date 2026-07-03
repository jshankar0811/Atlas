# Atlast Roadmap

Atlast is being built in stages so it can grow from a static travel prototype into a fully fledged AI-assisted travel planner.

## Phase 1 — Excellent standalone app

Goal: a clean static app that can be hosted on GitHub Pages/Netlify and saves data locally.

- [x] Map tab
- [x] Full-page calendar tab
- [x] Route Builder tab
- [x] Local AI Planner helper tab
- [x] Add/edit/delete/enable/disable stops
- [x] Add/delete lodging/travel calendar blocks
- [x] Lodging coverage checker
- [x] Export JSON
- [ ] Route versions: balanced, Ireland-heavy, Scotland-heavy, final
- [ ] Drag-and-drop stop ordering
- [ ] Edit existing calendar blocks
- [ ] Import JSON
- [ ] Booking dashboard
- [ ] Trip readiness score
- [ ] Mobile bottom drawer polish

## Phase 2 — Installable web app

Goal: make Atlast feel like a real app on iPhone/iPad.

- [ ] GitHub Pages or Netlify deployment
- [ ] PWA manifest
- [ ] App icon
- [ ] Add to Home Screen support
- [ ] Offline shell
- [ ] Data backup/restore

## Phase 3 — Cloud app

Goal: sync trips across devices and support collaboration.

Suggested stack:

- Next.js
- Supabase
- Leaflet or Mapbox
- OpenAI API
- Vercel or Netlify

Features:

- [ ] User login
- [ ] Cloud-saved trips
- [ ] Multi-trip dashboard
- [ ] Share/collaborate with another traveler
- [ ] Version history
- [ ] Attach confirmations/screenshots/PDFs

## Phase 4 — Agentic travel planning

Goal: the AI planner can read and edit trip state with user approval.

Agent actions:

- [ ] Find lodging gaps
- [ ] Find aggressive days
- [ ] Suggest booking priorities
- [ ] Create new route version
- [ ] Add stop
- [ ] Disable stop
- [ ] Move stop to another day
- [ ] Add lodging block
- [ ] Shift lodging dates
- [ ] Compare two route versions
- [ ] Apply approved changes

Example future commands:

- “Make this less rushed.”
- “Add one more night in Scotland.”
- “Move Doolin back to Galway.”
- “Create a Scotland-heavy route.”
- “Remove Skye and replace it with Edinburgh + Glencoe.”
- “Tell me what I need to book next.”
