# Atlast

Atlast is a customizable AI-assisted travel planning app. It started as an Ireland + Scotland trip planner, but the goal is broader: a map-first travel command center where you can build routes manually, manage lodging coverage, track bookings, and eventually let an AI agent suggest and apply route/calendar edits.

## Current app goals

- Map-first trip planning
- Full-page lodging overlap calendar
- Custom route builder with add/edit/delete/enable/disable stops
- Booking and lodging coverage tracking
- Lightweight planning assistant tab
- Future AI agent that can inspect and modify the route, calendar, and bookings with user approval

## Current prototype

The current version is a static front-end prototype intended to run locally or on GitHub Pages/Netlify. Data is stored in browser `localStorage`, with export/import and cloud sync planned later.

## Product direction

Atlast should become a full-fledged travel agent app: manual controls when you know what you want, and an embedded planning agent when you want help reasoning through trade-offs.

## Run locally

Open `index.html` directly in a browser, or serve the folder with a simple static server.

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`.
