# Changelog

## 2026-07-03

### Added

- Initialized Atlast repository.
- Added static app shell with top-level tabs: Map, Calendar, Route Builder, AI Planner.
- Added Leaflet/OpenStreetMap route map.
- Added editable route stop data stored in localStorage.
- Added full-page lodging overlap calendar.
- Added lodging coverage checker.
- Added route builder with add/edit/delete/enable/disable stops.
- Added calendar block creation and deletion.
- Added local planning helper for gaps, bookings, ferry/rental strategy, Dublin nights, and Skye pacing.
- Added README and roadmap.

### Added in v2 planning layer

- Added route versions with switch, duplicate, rename, and delete support.
- Added version-specific enabled/disabled stops so different trip shapes can coexist.
- Added Bookings dashboard for lodging, flights, ferry, rental car, attractions, restaurants, and admin items.
- Added booking statuses: not started, researching, booked, paid, cancelled.
- Added booking fields for cost, confirmation number, link, deadline, and notes.
- Added Trip Readiness tab with a readiness score.
- Added automatic readiness checks for lodging gaps, overlaps, critical bookings, ferry representation, and Skye lodging risk.
- Expanded AI Planner helper to answer readiness and booking questions.

### Notes

Atlast now has the first real planning-control-center layer. It is still static and localStorage-based, but it now supports route comparison, booking tracking, and readiness scoring.
