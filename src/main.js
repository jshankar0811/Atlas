import { irelandScotland2026 } from './data/ireland-scotland-2026.js';
import { createTripStore } from './core/store.js';
import { getMapStops, getTripSummary } from './core/trip.js';

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

function openBookings() {
  return trip.bookings.filter(item => item.status !== 'booked');
}

function localDate(value) {
  return new Date(`${value}T12:00:00`);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
}

function dayDiff(from, to) {
  return Math.round((to - from) / 86400000);
}

function getTripMoment() {
  const today = startOfToday();
  const start = localDate(trip.startDate);
  const end = localDate(trip.endDate);
  const current = trip.days.find(day => {
    const dayStart = localDate(day.date);
    const dayEnd = localDate(day.end || day.date);
    return today >= dayStart && today <= dayEnd;
  });
  const next = trip.days.find(day => localDate(day.date) > today);

  if (today < start) return { phase: 'before', daysUntil: dayDiff(today, start), current: null, next: trip.days[0] };
  if (today > end) return { phase: 'after', daysSince: dayDiff(end, today), current: null, next: null };
  return { phase: 'during', tripDay: dayDiff(start, today) + 1, current: current || next || trip.days.at(-1), next };
}

function incompleteChecks(limit = 3) {
  return trip.checklists
    .flatMap(group => group.items.map(item => ({ ...item, group: group.group })))
    .filter(item => !state.checks[item.id])
    .slice(0, limit);
}

function showView(view) {
  document.querySelectorAll('.tab').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  document.querySelectorAll('.view').forEach(section => section.classList.toggle('active', section.id === `view-${view}`));
  if (view === 'map' && map) setTimeout(() => { map.invalidateSize(); fitRoute(); }, 100);
}

function initTabs() {
  document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
}

function timelineItem(day) {
  const moment = getTripMoment();
  const isCurrent = moment.phase === 'during' && moment.current?.id === day.id;
  return `<button class="timeline-item ${isCurrent ? 'active' : ''}" data-day="${day.id}"><span class="date">${day.label}</span><span class="dot"></span><span class="timeline-card"><b>${day.title}${isCurrent ? ' · Today' : ''}</b><span>${day.place}</span></span></button>`;
}

function renderNextCard(moment) {
  if (moment.phase === 'before') {
    const tasks = incompleteChecks(3);
    $('nextTitle').textContent = moment.daysUntil === 0 ? 'Departure day' : 'Departure prep';
    $('nextBadge').textContent = moment.daysUntil === 0 ? 'Today' : `${moment.daysUntil} day${moment.daysUntil === 1 ? '' : 's'} to go`;
    return `<h2 style="margin:14px 0 6px">${moment.daysUntil === 0 ? 'You leave today' : `Get ready for ${trip.days[0].title}`}</h2><p class="muted">${tasks.length ? tasks.map(task => task.label).join(' · ') : 'The preparation checklist is complete. Keep confirmations and travel documents offline.'}</p><button class="primary" data-go="readiness">Open Mission Control</button>`;
  }

  if (moment.phase === 'during') {
    const current = moment.current;
    $('nextTitle').textContent = `Trip day ${moment.tripDay}`;
    $('nextBadge').textContent = current.label;
    return `<span class="eyebrow">You are here</span><h2 style="margin:10px 0 6px">${current.title}</h2><p class="muted">${current.place}</p><p>${current.detail}</p><button class="primary" data-open-day="${current.id}">View today’s plan</button>${moment.next ? ` <button class="ghost" data-open-day="${moment.next.id}">Next: ${moment.next.title}</button>` : ''}`;
  }

  $('nextTitle').textContent = 'Trip complete';
  $('nextBadge').textContent = `${moment.daysSince} day${moment.daysSince === 1 ? '' : 's'} ago`;
  return `<h2 style="margin:14px 0 6px">Welcome home</h2><p class="muted">Your itinerary, bookings, and completed preparation remain saved in Atlas.</p><button class="primary" data-go="trip">Replay the journey</button>`;
}

function renderToday() {
  const readiness = checklistStatus();
  const summary = getTripSummary(trip);
  const moment = getTripMoment();
  const phaseCopy = moment.phase === 'before'
    ? `${moment.daysUntil} day${moment.daysUntil === 1 ? '' : 's'} until departure.`
    : moment.phase === 'during'
      ? `Trip day ${moment.tripDay}: ${moment.current.title}.`
      : `Completed ${moment.daysSince} day${moment.daysSince === 1 ? '' : 's'} ago.`;

  $('heroTitle').textContent = trip.title;
  $('heroSubtitle').textContent = phaseCopy;
  $('heroScore').textContent = `${readiness.score}%`;
  $('todayMetrics').innerHTML = `
    <div class="metric"><b>${moment.phase === 'before' ? moment.daysUntil : moment.phase === 'during' ? `Day ${moment.tripDay}` : summary.durationDays}</b><span>${moment.phase === 'before' ? 'days to departure' : moment.phase === 'during' ? 'of the journey' : 'trip days completed'}</span></div>
    <div class="metric"><b>${summary.bases} bases</b><span>${trip.regions.join(', ')}</span></div>
    <div class="metric"><b>${summary.confirmedBookings}</b><span>confirmed bookings</span></div>
    <div class="metric"><b>${readiness.done}/${readiness.total}</b><span>prep items complete</span></div>`;
  $('nextCard').innerHTML = renderNextCard(moment);

  const priorities = moment.phase === 'before'
    ? [...openBookings().map(item => ({ title: item.title, note: item.notes })), ...incompleteChecks(3).map(item => ({ title: item.label, note: item.note }))].slice(0, 4)
    : openBookings().map(item => ({ title: item.title, note: item.notes })).slice(0, 4);
  $('todayIssues').innerHTML = priorities.map(item => `<div class="issue"><b>${item.title}</b><div class="muted">${item.note}</div></div>`).join('') || '<div class="win">Nothing urgent needs attention.</div>';

  const timelineDays = moment.phase === 'during'
    ? trip.days.filter(day => localDate(day.end || day.date) >= startOfToday()).slice(0, 5)
    : trip.days;
  $('todayTimeline').innerHTML = timelineDays.map(timelineItem).join('');

  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
  document.querySelectorAll('[data-open-day]').forEach(button => button.addEventListener('click', () => {
    showView('trip');
    selectDay(button.dataset.openDay);
  }));
}

function selectDay(id) {
  const day = trip.days.find(item => item.id === id);
  if (!day) return;
  persist({ selectedDayId: id });
  document.querySelectorAll('[data-day]').forEach(item => item.classList.toggle('active', item.dataset.day === id));
  $('dayDetail').innerHTML = `<span class="eyebrow">${day.label}</span><h2>${day.title}</h2><p class="muted">${day.place}</p><span class="status-pill ${day.status === 'booked' ? 'good' : 'warn'}">${day.status}</span><div class="detail-list"><div class="detail-row"><small>Plan</small>${day.detail}</div>${day.confirmation ? `<div class="detail-row"><small>Confirmation</small><b>${day.confirmation}</b></div>` : ''}<div class="detail-row"><small>Atlas note</small>${day.status === 'open' ? 'This still needs a final decision or verified booking.' : 'This item is currently marked confirmed.'}</div></div>`;
}

function renderTrip() {
  $('tripTimeline').innerHTML = trip.days.map(timelineItem).join('');
  document.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => selectDay(button.dataset.day)));
  const moment = getTripMoment();
  selectDay(state.selectedDayId || moment.current?.id || trip.days[0].id);
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
