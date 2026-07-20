export function createTrip(config) {
  const required = ['id', 'title', 'startDate', 'endDate', 'days', 'bookings', 'checklists'];
  for (const key of required) {
    if (config[key] == null) throw new Error(`Trip is missing required field: ${key}`);
  }

  const dayIds = new Set();
  for (const day of config.days) {
    if (!day.id || dayIds.has(day.id)) throw new Error(`Trip day ids must be unique: ${day.id || 'missing id'}`);
    dayIds.add(day.id);
  }

  return Object.freeze({
    ...config,
    days: Object.freeze(config.days.map(day => Object.freeze({ ...day }))),
    bookings: Object.freeze(config.bookings.map(booking => Object.freeze({ ...booking }))),
    checklists: Object.freeze(config.checklists.map(group => Object.freeze({
      ...group,
      items: Object.freeze(group.items.map(item => Object.freeze({ ...item })))
    })))
  });
}

export function getTripSummary(trip) {
  const start = new Date(`${trip.startDate}T12:00:00`);
  const end = new Date(`${trip.endDate}T12:00:00`);
  const durationDays = Math.round((end - start) / 86400000) + 1;
  const confirmedBookings = trip.bookings.filter(item => item.status === 'booked').length;
  const openBookings = trip.bookings.filter(item => item.status !== 'booked').length;
  const bases = trip.days.filter(item => item.type === 'hotel').length;
  return { durationDays, confirmedBookings, openBookings, bases };
}

export function getMapStops(trip) {
  return trip.days.filter(day => Number.isFinite(day.lat) && Number.isFinite(day.lng) && day.type !== 'flight');
}
