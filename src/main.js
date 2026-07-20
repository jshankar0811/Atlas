import { irelandScotland2026 } from './data/ireland-scotland-2026.js';
import { createTripStore } from './core/store.js';
import { getMapStops, getTripSummary } from './core/trip.js';
import { buildTripIntelligence } from './core/intelligence.js';

const trip = irelandScotland2026;
const store = createTripStore(trip);
const $ = id => document.getElementById(id);
let state = store.read();
let map;
let routeLine;
let markers = [];

function persist(patch = {}) {
  state = { ...state, ...patch };
  store.write(state);
}

function checklistStatus() {
  const total = trip.checklists.reduce((sum, group) => sum + group.items.length, 0);
  const done = trip.checklists.reduce((sum, group) => sum + group.items.filter(item => state.checks[item.id]).length, 0);
  return { total, done, score: total ? Math.round((done / total) * 100) : 0 };
}

function localDate(value) { return new Date(`${value}T12:00:00`); }
function startOfToday() { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12); }
function intelligence() { return buildTripIntelligence(trip, state); }

function showView(view) {
  document.querySelectorAll('.tab').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  document.querySelectorAll('.view').forEach(section => section.classList.toggle('active', section.id === `view-${view}`));
  if (view === 'map' && map) setTimeout(() => { map.invalidateSize(); fitRoute(); }, 100);
}

function initTabs() {
  document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
}

function timelineItem(day) {
  const insight = intelligence();
  const isCurrent = insight.phase === 'during' && insight.current?.id === day.id;
  return `<button class="timeline-item ${isCurrent ? 'active' : ''}" data-day="${day.id}"><span class="date">${day.label}</span><span class="dot"></span><span class="timeline-card"><b>${day.title}${isCurrent ? ' · Today' : ''}</b><span>${day.place}</span></span></button>`;
}

function briefingMarkup(briefing) {
  return `<div class="briefing-copy"><span class="eyebrow">Atlas briefing</span><h2>${briefing.headline}</h2><p>${briefing.summary}</p><div class="briefing-focus"><small>What matters</small>${briefing.focus}</div></div><div class="briefing-facts">${briefing.facts.map(fact => `<div><small>${fact.label}</small><b>${fact.value}</b></div>`).join('')}</div>`;
}

function renderNextCard(insight) {
  $('nextTitle').textContent = insight.phase === 'before' ? 'Departure intelligence' : insight.phase === 'during' ? `Trip day ${insight.tripDay}` : 'Trip complete';
  $('nextBadge').textContent = insight.phase === 'before' ? `${insight.daysUntil} day${insight.daysUntil === 1 ? '' : 's'} to go` : insight.phase === 'during' ? insight.current.label : `${insight.daysSince} day${insight.daysSince === 1 ? '' : 's'} ago`;
  const actions = insight.phase === 'before'
    ? '<button class="primary" data-go="readiness">Open Mission Control</button>'
    : insight.phase === 'during'
      ? `<button class="primary" data-open-day="${insight.current.id}">Open today’s plan</button>${insight.next ? ` <button class="ghost" data-open-day="${insight.next.id}">Next: ${insight.next.title}</button>` : ''}`
      : '<button class="primary" data-go="trip">Replay the journey</button>';
  return `<div class="smart-briefing">${briefingMarkup(insight.briefing)}</div><div class="briefing-actions">${actions}</div>`;
}

function renderToday() {
  const readiness = checklistStatus();
  const summary = getTripSummary(trip);
  const insight = intelligence();
  const phaseCopy = insight.phase === 'before'
    ? insight.briefing.summary
    : insight.phase === 'during'
      ? `Trip day ${insight.tripDay}: ${insight.current.title}.`
      : 'Your completed journey is ready to replay.';

  $('heroTitle').textContent = trip.title;
  $('heroSubtitle').textContent = phaseCopy;
  $('heroScore').textContent = `${readiness.score}%`;
  $('todayMetrics').innerHTML = `
    <div class="metric"><b>${insight.phase === 'before' ? insight.daysUntil : insight.phase === 'during' ? `Day ${insight.tripDay}` : summary.durationDays}</b><span>${insight.phase === 'before' ? 'days to departure' : insight.phase === 'during' ? 'of the journey' : 'trip days completed'}</span></div>
    <div class="metric"><b>${summary.bases} bases</b><span>${trip.regions.join(', ')}</span></div>
    <div class="metric"><b>${summary.confirmedBookings}</b><span>confirmed bookings</span></div>
    <div class="metric"><b>${readiness.done}/${readiness.total}</b><span>prep items complete</span></div>`;
  $('nextCard').innerHTML = renderNextCard(insight);
  $('todayIssues').innerHTML = insight.priorities.map((item, index) => `<div class="issue priority-${index + 1}"><span class="priority-rank">${index + 1}</span><div><b>${item.title}</b><div class="muted">${item.note}</div></div></div>`).join('') || '<div class="win">Atlas found nothing urgent.</div>';

  const timelineDays = insight.phase === 'during'
    ? trip.days.filter(day => localDate(day.end || day.date) >= startOfToday()).slice(0, 5)
    : trip.days;
  $('todayTimeline').innerHTML = timelineDays.map(timelineItem).join('');

  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
  document.querySelectorAll('[data-open-day]').forEach(button => button.addEventListener('click', () => { showView('trip'); selectDay(button.dataset.openDay); }));
}

function selectDay(id) {
  const day = trip.days.find(item => item.id === id);
  if (!day) return;
  const dayIndex = trip.days.findIndex(item => item.id === id);
  const next = trip.days[dayIndex + 1] || null;
  const dayBriefing = buildTripIntelligence({ ...trip, startDate: day.date, endDate: day.end || day.date, days: trip.days.slice(dayIndex) }, state, localDate(day.date)).briefing;
  persist({ selectedDayId: id });
  document.querySelectorAll('[data-day]').forEach(item => item.classList.toggle('active', item.dataset.day === id));
  $('dayDetail').innerHTML = `<span class="eyebrow">${day.label}</span><h2>${day.title}</h2><p class="muted">${day.place}</p><span class="status-pill ${day.status === 'booked' ? 'good' : 'warn'}">${day.status}</span><div class="day-briefing"><small>Atlas briefing</small><p>${dayBriefing.focus}</p><span>Next: ${next ? `${next.title} · ${next.place}` : 'Journey complete'}</span></div><div class="detail-list"><div class="detail-row"><small>Plan</small>${day.detail}</div>${day.confirmation ? `<div class="detail-row"><small>Confirmation</small><b>${day.confirmation}</b></div>` : ''}<div class="detail-row"><small>Atlas note</small>${day.status === 'open' ? 'This still needs a final decision or verified booking.' : 'This item is currently marked confirmed.'}</div></div>`;
}

function renderTrip() {
  $('tripTimeline').innerHTML = trip.days.map(timelineItem).join('');
  document.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => selectDay(button.dataset.day)));
  const insight = intelligence();
  selectDay(state.selectedDayId || insight.current?.id || trip.days[0].id);
}

function mapStops() { return getMapStops(trip); }

function drawMap() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  if (routeLine) map.removeLayer(routeLine);
  const stops = mapStops();
  routeLine = L.polyline(stops.map(stop => [stop.lat, stop.lng]), { color: '#173f2b', weight: 4, opacity: .75 }).addTo(map);
  stops.forEach((stop, index) => {
    const icon = L.divIcon({ className: '', html: `<div class="marker">${index + 1}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] });
    const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(map).bindPopup(`<b>${stop.title}</b><br>${stop.place}<br><small>${stop.label}</small>`);
    marker.on('click', () => selectMapStop(stop.id));
    markers.push(marker);
  });
}

function fitRoute() {
  if (!map) return;
  const points = mapStops().map(stop => [stop.lat, stop.lng]);
  if (points.length) map.fitBounds(points, { padding: [35, 35] });
}

function selectMapStop(id) {
  const stop = trip.days.find(item => item.id === id);
  if (!stop || !map) return;
  map.setView([stop.lat, stop.lng], Math.max(map.getZoom(), 9));
  const index = mapStops().findIndex(item => item.id === id);
  if (markers[index]) markers[index].openPopup();
}

function renderStopList() {
  const query = $('stopSearch').value.toLowerCase().trim();
  const stops = mapStops().filter(stop => !query || JSON.stringify(stop).toLowerCase().includes(query));
  $('stopList').innerHTML = stops.map((stop, index) => `<div class="stop-card" data-map-stop="${stop.id}"><span class="stop-num">${index + 1}</span><div><b>${stop.title}</b><span>${stop.label} · ${stop.place}</span></div></div>`).join('');
  document.querySelectorAll('[data-map-stop]').forEach(item => item.addEventListener('click', () => selectMapStop(item.dataset.mapStop)));
}

function initMap() {
  if (!window.L) return;
  map = L.map('map', { zoomControl: true }).setView([54.5, -7], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  drawMap();
  fitRoute();
}

function renderBookings() {
  const summary = getTripSummary(trip);
  $('bookingMetrics').innerHTML = `<div class="metric"><b>${trip.bookings.length}</b><span>tracked items</span></div><div class="metric"><b>${summary.confirmedBookings}</b><span>confirmed</span></div><div class="metric"><b>${summary.openBookings}</b><span>needs attention</span></div><div class="metric"><b>1</b><span>active trip</span></div>`;
  $('bookingList').innerHTML = trip.bookings.map(item => `<article class="booking-card"><span class="eyebrow">${item.category}</span><h3>${item.title}</h3><p>${item.date}</p><span class="status-pill ${item.status === 'booked' ? 'good' : 'warn'}">${item.status}</span>${item.confirmation ? `<span class="status-pill"># ${item.confirmation}</span>` : ''}<p>${item.notes}</p></article>`).join('');
}

function renderReadiness() {
  const readiness = checklistStatus();
  $('readinessScore').textContent = `${readiness.score}%`;
  $('progressBar').style.width = `${readiness.score}%`;
  $('progressLabel').textContent = `${readiness.done} of ${readiness.total} preparation items complete`;
  $('scoreCopy').textContent = readiness.score >= 90 ? 'Nearly ready. Focus only on the final transport and document checks.' : readiness.score >= 60 ? 'Good progress. Finish the unresolved transport and booking items next.' : 'Start with documents, critical transport, and the purchase list.';
  $('checkGroups').innerHTML = trip.checklists.map(group => `<section class="panel check-group"><span class="eyebrow">Checklist</span><h3>${group.group}</h3>${group.items.map(item => `<div class="check-row"><input type="checkbox" id="${item.id}" data-check="${item.id}" ${state.checks[item.id] ? 'checked' : ''}><label for="${item.id}">${item.label}<small>${item.note}</small></label></div>`).join('')}</section>`).join('');
  document.querySelectorAll('[data-check]').forEach(input => input.addEventListener('change', () => {
    persist({ checks: { ...state.checks, [input.dataset.check]: input.checked } });
    renderReadiness();
    renderToday();
  }));
}

function init() {
  document.title = `Atlas · ${trip.title}`;
  document.querySelector('.brand p').textContent = `${trip.title} · ${trip.subtitle}`;
  initTabs();
  renderToday();
  renderTrip();
  renderStopList();
  renderBookings();
  renderReadiness();
  initMap();
  $('fitRoute').addEventListener('click', fitRoute);
  $('stopSearch').addEventListener('input', renderStopList);
  $('printTrip').addEventListener('click', () => window.print());
  $('resetChecks').addEventListener('click', () => {
    if (!confirm('Reset every readiness checkbox?')) return;
    persist({ checks: {} });
    renderReadiness();
    renderToday();
  });
}

document.addEventListener('DOMContentLoaded', init);
