const DAY_MS = 86400000;

function localDate(value) {
  return new Date(`${value}T12:00:00`);
}

function dateDiff(from, to) {
  return Math.round((to - from) / DAY_MS);
}

function flattenedChecks(trip, checks) {
  return trip.checklists.flatMap(group => group.items.map(item => ({ ...item, group: group.group, complete: Boolean(checks[item.id]) })));
}

function priorityScore(item) {
  const text = `${item.group || ''} ${item.label || ''} ${item.title || ''}`.toLowerCase();
  if (/passport|eta|insurance|confirmation/.test(text)) return 100;
  if (/ferry|transfer|car|train|flight|transport/.test(text)) return 90;
  if (/hotel|lodging|highlands/.test(text)) return 80;
  if (/phone|money|esim|map/.test(text)) return 70;
  return 40;
}

function briefingFor(day, next) {
  const typeCopy = {
    flight: 'Keep documents, medication, chargers, and one change of clothes in your personal item.',
    hotel: 'Confirm check-in timing, save the address offline, and keep the day flexible around arrival.',
    car: 'Protect the schedule with a generous driving buffer and photograph the vehicle before return.',
    ferry: 'Treat the check-in deadline like an airport deadline and keep passports and ETA details accessible.',
    transfer: 'Verify the exact pickup point and do not rely on a tight walk-up connection.',
    train: 'Download the ticket, verify the departure station, and arrive early enough to find the platform.',
    activity: 'Keep a weather-safe backup and make the final go/no-go decision the evening before.'
  };
  return {
    headline: day.title,
    summary: day.detail,
    focus: typeCopy[day.type] || 'Keep confirmations offline and leave enough margin for the unexpected.',
    next: next ? `${next.title} · ${next.place}` : 'Final scheduled item of the trip',
    facts: [
      { label: 'Location', value: day.place },
      { label: 'Date', value: day.label },
      { label: 'Status', value: day.status === 'booked' ? 'Confirmed' : 'Decision needed' },
      { label: 'Next', value: next ? next.title : 'Trip complete' }
    ]
  };
}

export function buildTripIntelligence(trip, state, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const start = localDate(trip.startDate);
  const end = localDate(trip.endDate);
  const checks = flattenedChecks(trip, state.checks || {});
  const unresolvedBookings = trip.bookings.filter(item => item.status !== 'booked');
  const currentIndex = trip.days.findIndex(day => today >= localDate(day.date) && today <= localDate(day.end || day.date));
  const nextIndex = trip.days.findIndex(day => localDate(day.date) > today);
  const current = currentIndex >= 0 ? trip.days[currentIndex] : null;
  const next = nextIndex >= 0 ? trip.days[nextIndex] : null;
  const phase = today < start ? 'before' : today > end ? 'after' : 'during';

  const priorities = [
    ...unresolvedBookings.map(item => ({ kind: 'booking', title: item.title, note: item.notes, score: priorityScore(item) })),
    ...checks.filter(item => !item.complete).map(item => ({ kind: 'check', title: item.label, note: item.note, group: item.group, score: priorityScore(item) }))
  ].sort((a, b) => b.score - a.score).slice(0, 5);

  if (phase === 'before') {
    const daysUntil = dateDiff(today, start);
    return {
      phase,
      daysUntil,
      current: null,
      next: trip.days[0],
      tripDay: null,
      briefing: {
        headline: daysUntil === 0 ? 'Departure day' : `${daysUntil} day${daysUntil === 1 ? '' : 's'} until departure`,
        summary: priorities.length ? `Your highest-priority item is ${priorities[0].title.toLowerCase()}.` : 'Critical trip preparation is complete.',
        focus: priorities.length ? priorities[0].note : 'Keep documents and confirmations available offline.',
        next: `${trip.days[0].title} · ${trip.days[0].place}`,
        facts: [
          { label: 'Departure', value: trip.days[0].label },
          { label: 'Open bookings', value: String(unresolvedBookings.length) },
          { label: 'Prep remaining', value: String(checks.filter(item => !item.complete).length) },
          { label: 'First move', value: trip.days[0].title }
        ]
      },
      priorities
    };
  }

  if (phase === 'after') {
    return {
      phase,
      daysSince: dateDiff(end, today),
      current: null,
      next: null,
      tripDay: null,
      briefing: {
        headline: 'Journey complete',
        summary: `${trip.title} remains available as a complete itinerary and booking record.`,
        focus: 'This intelligence layer is ready to power a future journal and memories mode.',
        next: 'Replay the route',
        facts: [
          { label: 'Trip', value: trip.title },
          { label: 'Regions', value: String(trip.regions.length) },
          { label: 'Stops', value: String(trip.days.length) },
          { label: 'Status', value: 'Completed' }
        ]
      },
      priorities: unresolvedBookings.map(item => ({ kind: 'booking', title: item.title, note: item.notes, score: priorityScore(item) })).slice(0, 5)
    };
  }

  const active = current || next || trip.days.at(-1);
  const activeIndex = trip.days.findIndex(day => day.id === active.id);
  const following = trip.days[activeIndex + 1] || null;
  return {
    phase,
    tripDay: dateDiff(start, today) + 1,
    current: active,
    next: following,
    briefing: briefingFor(active, following),
    priorities: [
      ...(active.status !== 'booked' ? [{ kind: 'booking', title: `${active.title} needs a decision`, note: active.detail, score: 110 }] : []),
      ...priorities
    ].slice(0, 5)
  };
}
